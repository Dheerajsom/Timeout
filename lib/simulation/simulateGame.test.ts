import { describe, expect, it } from "vitest";
import { simulateGame } from "./simulateGame";
import { simulateSeries } from "./simulateSeries";
import { getTeamPair, teams } from "@/lib/teams";
import type { Ruleset } from "@/types/simulation";

const pair = getTeamPair("1996-bulls", "2017-warriors")!;
const rulesets: Ruleset[] = ["modern", "physical_90s", "early_2000s", "bubble", "neutral"];

/** A spread of matchups wide enough to exercise mismatched and even teams. */
function sampleMatchups(count: number) {
  return Array.from({ length: count }, (_unused, index) => {
    const teamA = teams[(index * 7) % teams.length];
    const teamB = teams[(index * 131 + 5) % teams.length];
    return teamA.id === teamB.id ? null : { teamA, teamB, seed: `seed-${index}` };
  }).filter((matchup) => matchup !== null);
}

describe("simulateGame", () => {
  it("is deterministic for a given seed", () => {
    const first = simulateGame({ ...pair, ruleset: "modern", seed: "stable" });
    const second = simulateGame({ ...pair, ruleset: "modern", seed: "stable" });

    expect(second).toEqual(first);
  });

  it("produces different results for different seeds", () => {
    const first = simulateGame({ ...pair, ruleset: "modern", seed: "a" });
    const second = simulateGame({ ...pair, ruleset: "modern", seed: "b" });

    expect(second).not.toEqual(first);
  });

  it.each(rulesets)("holds its box-score invariants under the %s ruleset", (ruleset) => {
    for (const { teamA, teamB, seed } of sampleMatchups(120)) {
      const game = simulateGame({ teamA, teamB, ruleset, seed });
      const context = `${teamA.id} vs ${teamB.id} (${seed})`;

      for (const score of [game.teamAScore, game.teamBScore]) {
        expect(score, context).toBeGreaterThanOrEqual(82);
        expect(score, context).toBeLessThanOrEqual(145);
      }

      // A tie would leave the result with no winner to report.
      expect(game.teamAScore, context).not.toBe(game.teamBScore);
      expect([teamA.id, teamB.id], context).toContain(game.winnerTeamId);

      const sides = [
        { players: game.teamABoxScore, score: game.teamAScore },
        { players: game.teamBBoxScore, score: game.teamBScore },
      ];

      for (const { players, score } of sides) {
        const total = players.reduce((sum, player) => sum + player.points, 0);
        expect(total, `points must add up to the team total — ${context}`).toBe(score);

        for (const player of players) {
          expect(player.points, context).toBeGreaterThanOrEqual(0);
          expect(player.fieldGoalsMade, context).toBeLessThanOrEqual(player.fieldGoalsAttempted);
          expect(player.threesMade * 3, context).toBeLessThanOrEqual(player.points);
          for (const stat of [player.rebounds, player.assists, player.steals, player.blocks, player.turnovers]) {
            expect(stat, context).toBeGreaterThanOrEqual(0);
          }
        }
      }

      const quarters = Object.values(game.quarters);
      expect(quarters.reduce((sum, line) => sum + line.teamA, 0), context).toBe(game.teamAScore);
      expect(quarters.reduce((sum, line) => sum + line.teamB, 0), context).toBe(game.teamBScore);
      for (const line of quarters) {
        expect(line.teamA, context).toBeGreaterThan(0);
        expect(line.teamB, context).toBeGreaterThan(0);
      }
    }
  });

  it("picks the MVP from the winning side", () => {
    for (const { teamA, teamB, seed } of sampleMatchups(60)) {
      const game = simulateGame({ teamA, teamB, ruleset: "modern", seed });
      const winningBoxScore = game.winnerTeamId === teamA.id ? game.teamABoxScore : game.teamBBoxScore;

      expect(winningBoxScore.map((player) => player.playerId)).toContain(game.mvp.playerId);
    }
  });
});

describe("simulateSeries", () => {
  it("is deterministic for a given seed", () => {
    expect(simulateSeries({ ...pair, ruleset: "modern", seed: "stable" })).toEqual(
      simulateSeries({ ...pair, ruleset: "modern", seed: "stable" }),
    );
  });

  it("stops as soon as one side reaches four wins", () => {
    for (const { teamA, teamB, seed } of sampleMatchups(60)) {
      const series = simulateSeries({ teamA, teamB, ruleset: "modern", seed });
      const context = `${teamA.id} vs ${teamB.id} (${seed})`;

      expect(Math.max(series.teamAWins, series.teamBWins), context).toBe(4);
      expect(series.games.length, context).toBe(series.teamAWins + series.teamBWins);
      expect(series.games.length, context).toBeGreaterThanOrEqual(4);
      expect(series.games.length, context).toBeLessThanOrEqual(7);
      expect(series.games.map((game) => game.gameNumber), context).toEqual(
        series.games.map((_game, index) => index + 1),
      );
      expect(series.decidingGame.winnerTeamId, context).toBe(series.winnerTeamId);
    }
  });

  it("reports the MVP as a per-game average, not a series total", () => {
    const series = simulateSeries({ ...pair, ruleset: "modern", seed: "mvp-average" });
    const winningLines = series.games.map((game) =>
      (series.winnerTeamId === game.teamA.id ? game.teamABoxScore : game.teamBBoxScore).find(
        (player) => player.playerId === series.mvp.playerId,
      ),
    );
    const played = winningLines.filter((line) => line !== undefined);
    const average = played.reduce((sum, line) => sum + line.points, 0) / played.length;

    expect(series.mvp.points).toBeCloseTo(Math.round(average * 10) / 10, 5);
  });
});
