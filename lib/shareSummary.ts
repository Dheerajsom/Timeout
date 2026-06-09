import type { SimulatedGame, SimulatedSeries } from "@/types/simulation";

export type ShareSummary = {
  teamALabel: string;
  teamBLabel: string;
  winnerTeamLabel: string;
  loserTeamLabel: string;
  winnerScore: number;
  loserScore: number;
  scoreLabel: string;
  mvpLine: string;
  title: string;
  description: string;
};

export function buildShareSummary(result: SimulatedGame | SimulatedSeries): ShareSummary {
  const game = result.type === "single_game" ? result : result.decidingGame;
  const teamALabel = formatTeam(result.teamA);
  const teamBLabel = formatTeam(result.teamB);
  const teamAWon = result.winnerTeamId === result.teamA.id;
  const winnerTeamLabel = teamAWon ? teamALabel : teamBLabel;
  const loserTeamLabel = teamAWon ? teamBLabel : teamALabel;
  const winnerScore = teamAWon ? game.teamAScore : game.teamBScore;
  const loserScore = teamAWon ? game.teamBScore : game.teamAScore;
  const scoreLabel =
    result.type === "single_game"
      ? `${winnerScore}-${loserScore}`
      : `${teamAWon ? result.teamAWins : result.teamBWins}-${teamAWon ? result.teamBWins : result.teamAWins} series`;
  const mvpLine = `${result.mvp.name} - ${result.mvp.points} PTS, ${result.mvp.rebounds} REB, ${result.mvp.assists} AST`;
  const title = `Timeout: ${winnerTeamLabel} beat ${loserTeamLabel}`;
  const description =
    result.type === "single_game"
      ? `${winnerTeamLabel} beat ${loserTeamLabel}, ${scoreLabel}. MVP: ${mvpLine}.`
      : `${winnerTeamLabel} beat ${loserTeamLabel}, ${scoreLabel}. MVP: ${mvpLine}. Deciding game: ${winnerScore}-${loserScore}.`;

  return {
    teamALabel,
    teamBLabel,
    winnerTeamLabel,
    loserTeamLabel,
    winnerScore,
    loserScore,
    scoreLabel,
    mvpLine,
    title,
    description,
  };
}

function formatTeam(team: SimulatedGame["teamA"]) {
  return `${team.season} ${team.franchise}`;
}
