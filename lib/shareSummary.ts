import type { SimulatedGame, SimulatedSeries } from "@/types/simulation";

export type ShareSummary = {
  pickedTeamLabel: string;
  opponentTeamLabel: string;
  pickedWon: boolean;
  resultLabel: string;
  scoreLabel: string;
  mvpLine: string;
  copyText: string;
  title: string;
  description: string;
};

export function buildShareSummary(result: SimulatedGame | SimulatedSeries, url?: string): ShareSummary {
  const game = result.type === "single_game" ? result : result.decidingGame;
  const pickedTeamLabel = formatTeam(result.teamA);
  const opponentTeamLabel = formatTeam(result.teamB);
  const pickedWon = result.winnerTeamId === result.teamA.id;
  const resultLabel = pickedWon ? "Won" : "Lost";
  const scoreLabel =
    result.type === "single_game"
      ? `${game.teamAScore}-${game.teamBScore}`
      : `${result.teamAWins}-${result.teamBWins} series, deciding game ${game.teamAScore}-${game.teamBScore}`;
  const mvpLine = `${result.mvp.name} - ${result.mvp.points} PTS, ${result.mvp.rebounds} REB, ${result.mvp.assists} AST`;
  const title = `Timeout: ${pickedTeamLabel} ${pickedWon ? "beat" : "lost to"} ${opponentTeamLabel}`;
  const description = `${resultLabel} with ${pickedTeamLabel} vs ${opponentTeamLabel}, ${scoreLabel}. MVP ${mvpLine}.`;

  return {
    pickedTeamLabel,
    opponentTeamLabel,
    pickedWon,
    resultLabel,
    scoreLabel,
    mvpLine,
    title,
    description,
    copyText: [
      "Timeout result",
      `I ${pickedWon ? "won" : "lost"} with ${pickedTeamLabel} vs ${opponentTeamLabel}, ${scoreLabel}.`,
      `MVP: ${mvpLine}.`,
      url ?? "",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

function formatTeam(team: SimulatedGame["teamA"]) {
  return `${team.season} ${team.franchise}`;
}
