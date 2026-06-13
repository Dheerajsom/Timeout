import type { PlayerBoxScore, Ruleset, SeriesGame, SimulatedGame, SimulatedSeries, Team } from "@/types/simulation";
import { simulateGame } from "./simulateGame";

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
  const tally = new Map<string, { player: PlayerBoxScore; appearances: number }>();
  games.forEach((game) => {
    const boxScore = winnerTeamId === teamA.id ? game.teamABoxScore : game.teamBBoxScore;
    boxScore.forEach((player) => {
      const existing = tally.get(player.playerId);
      if (!existing) {
        tally.set(player.playerId, { player: { ...player }, appearances: 1 });
        return;
      }
      existing.appearances += 1;
      existing.player.mvpScore += player.mvpScore;
      existing.player.minutes += player.minutes;
      existing.player.points += player.points;
      existing.player.rebounds += player.rebounds;
      existing.player.assists += player.assists;
      existing.player.steals += player.steals;
      existing.player.blocks += player.blocks;
      existing.player.turnovers += player.turnovers;
      existing.player.threesMade += player.threesMade;
      existing.player.fieldGoalsMade += player.fieldGoalsMade;
      existing.player.fieldGoalsAttempted += player.fieldGoalsAttempted;
      existing.player.plusMinus += player.plusMinus;
    });
  });

  const averages = [...tally.values()].map(({ player, appearances }) => ({
    ...player,
    mvpScore: player.mvpScore / appearances,
    minutes: Math.round(player.minutes / appearances),
    points: round1(player.points / appearances),
    rebounds: round1(player.rebounds / appearances),
    assists: round1(player.assists / appearances),
    steals: round1(player.steals / appearances),
    blocks: round1(player.blocks / appearances),
    turnovers: round1(player.turnovers / appearances),
    threesMade: round1(player.threesMade / appearances),
    fieldGoalsMade: round1(player.fieldGoalsMade / appearances),
    fieldGoalsAttempted: round1(player.fieldGoalsAttempted / appearances),
    plusMinus: Math.round(player.plusMinus / appearances),
  }));

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
