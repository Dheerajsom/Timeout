import type { Ruleset, SimulatedSeries, Team } from "@/types/simulation";
import { simulateGame } from "./simulateGame";

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
  const games = [];
  let decidingGame = simulateGame({ teamA, teamB, ruleset, seed: `${seed}-g1` });

  for (let gameNumber = 1; gameNumber <= 7; gameNumber += 1) {
    const game = simulateGame({ teamA, teamB, ruleset, seed: `${seed}-g${gameNumber}` });
    decidingGame = game;

    if (game.winnerTeamId === teamA.id) {
      teamAWins += 1;
    } else {
      teamBWins += 1;
    }

    games.push({
      gameNumber,
      seed: game.seed,
      winnerTeamId: game.winnerTeamId,
      teamAScore: game.teamAScore,
      teamBScore: game.teamBScore,
      mvpName: game.mvp.name,
    });

    if (teamAWins === 4 || teamBWins === 4) {
      break;
    }
  }

  const winnerTeamId = teamAWins > teamBWins ? teamA.id : teamB.id;
  const winnerBoxScores = games
    .map((game) => simulateGame({ teamA, teamB, ruleset, seed: game.seed }))
    .filter((game) => game.winnerTeamId === winnerTeamId)
    .flatMap((game) => (winnerTeamId === teamA.id ? game.teamABoxScore : game.teamBBoxScore));

  const totals = new Map<string, (typeof winnerBoxScores)[number]>();
  winnerBoxScores.forEach((player) => {
    const existing = totals.get(player.playerId);
    if (!existing) {
      totals.set(player.playerId, { ...player });
      return;
    }
    existing.mvpScore += player.mvpScore;
    existing.points += player.points;
    existing.rebounds += player.rebounds;
    existing.assists += player.assists;
  });

  const mvp = [...totals.values()].reduce((best, player) => (player.mvpScore > best.mvpScore ? player : best), [...totals.values()][0]);

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
