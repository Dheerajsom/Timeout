import type { PlayerBoxScore, Ruleset, SeriesGame, SimulatedGame, SimulatedSeries, Team } from "@/types/simulation";
import { simulateGame } from "./simulateGame";

/** Counting stats shown to one decimal as a per-game average. */
const perGameStats = [
  "points",
  "rebounds",
  "assists",
  "steals",
  "blocks",
  "turnovers",
  "threesMade",
  "fieldGoalsMade",
  "fieldGoalsAttempted",
] as const;

/** Averages that only read sensibly as whole numbers. */
const wholeNumberStats = ["minutes", "plusMinus"] as const;

/** Every stat accumulated across the series before averaging. */
const summedStats = [...perGameStats, ...wholeNumberStats, "mvpScore"] as const satisfies readonly (keyof PlayerBoxScore)[];

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

export function simulateSeries({
  teamA,
  teamB,
  ruleset,
  seed,
}: {
  teamA: Team;
  teamB: Team;
  ruleset: Ruleset;
  seed: string;
}): SimulatedSeries {
  let teamAWins = 0;
  let teamBWins = 0;
  const games: SeriesGame[] = [];
  let decidingGame!: SimulatedGame; // assigned on the first (always-run) loop iteration

  for (let gameNumber = 1; gameNumber <= 7; gameNumber += 1) {
    const game = simulateGame({ teamA, teamB, ruleset, seed: `${seed}-g${gameNumber}` });
    decidingGame = game;

    if (game.winnerTeamId === teamA.id) {
      teamAWins += 1;
    } else {
      teamBWins += 1;
    }

    games.push({ ...game, gameNumber });

    if (teamAWins === 4 || teamBWins === 4) {
      break;
    }
  }

  const winnerTeamId = teamAWins > teamBWins ? teamA.id : teamB.id;

  // Average the winning team's box scores across every game in the series so the
  // MVP card shows per-game averages rather than a running total.
  const totals = new Map<string, { player: PlayerBoxScore; appearances: number }>();
  for (const game of games) {
    const boxScore = winnerTeamId === teamA.id ? game.teamABoxScore : game.teamBBoxScore;
    for (const player of boxScore) {
      const existing = totals.get(player.playerId);
      if (!existing) {
        totals.set(player.playerId, { player: { ...player }, appearances: 1 });
        continue;
      }
      existing.appearances += 1;
      for (const key of summedStats) {
        existing.player[key] += player[key];
      }
    }
  }

  const averages = [...totals.values()].map(({ player, appearances }) => {
    const averaged = { ...player, mvpScore: player.mvpScore / appearances };
    for (const key of perGameStats) {
      averaged[key] = round1(player[key] / appearances);
    }
    for (const key of wholeNumberStats) {
      averaged[key] = Math.round(player[key] / appearances);
    }
    return averaged;
  });

  const mvp = averages.reduce((best, player) => (player.mvpScore > best.mvpScore ? player : best), averages[0]);

  return {
    type: "best_of_7",
    seed,
    teamA,
    teamB,
    ruleset,
    winnerTeamId,
    teamAWins,
    teamBWins,
    games,
    decidingGame,
    mvp,
    explanation: decidingGame.explanation,
    matchupFactors: decidingGame.matchupFactors,
  };
}
