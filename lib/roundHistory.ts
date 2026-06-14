import type { SimulatedGame, SimulatedSeries, Team } from "@/types/simulation";

const historyStorageKey = "timeout-round-history";
const historyLimit = 30;

export type RoundHistoryEntry = {
  id: string;
  playedAt: string;
  userTeam: string;
  opponentTeam: string;
  userScore: number;
  opponentScore: number;
  userWon: boolean;
  resultUrl: string;
};

export type SimulationPayload = {
  simulationId: string;
  result: SimulatedGame | SimulatedSeries;
};

export function readRoundHistory(): RoundHistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(historyStorageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isRoundHistoryEntry).slice(0, historyLimit);
  } catch {
    return [];
  }
}

export function saveRoundHistory(userTeam: Team, opponentTeam: Team, payload: SimulationPayload) {
  const result = payload.result;
  const userIsTeamA = result.teamA.id === userTeam.id;
  // For a series, show the series record (e.g. 4-2); for a single game, the points.
  let userScore: number;
  let opponentScore: number;
  if (result.type === "best_of_7") {
    userScore = userIsTeamA ? result.teamAWins : result.teamBWins;
    opponentScore = userIsTeamA ? result.teamBWins : result.teamAWins;
  } else {
    userScore = userIsTeamA ? result.teamAScore : result.teamBScore;
    opponentScore = userIsTeamA ? result.teamBScore : result.teamAScore;
  }
  const entry: RoundHistoryEntry = {
    id: payload.simulationId,
    playedAt: new Date().toISOString(),
    userTeam: `${userTeam.season} ${userTeam.franchise}`,
    opponentTeam: `${opponentTeam.season} ${opponentTeam.franchise}`,
    userScore,
    opponentScore,
    userWon: result.winnerTeamId === userTeam.id,
    resultUrl: `/result/${payload.simulationId}`,
  };
  const nextHistory = [entry, ...readRoundHistory().filter((round) => round.id !== entry.id)].slice(0, historyLimit);

  try {
    window.localStorage.setItem(historyStorageKey, JSON.stringify(nextHistory));
  } catch {
    return nextHistory;
  }

  return nextHistory;
}

function isRoundHistoryEntry(value: unknown): value is RoundHistoryEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<RoundHistoryEntry>;
  return (
    typeof entry.id === "string" &&
    typeof entry.playedAt === "string" &&
    typeof entry.userTeam === "string" &&
    typeof entry.opponentTeam === "string" &&
    typeof entry.userScore === "number" &&
    typeof entry.opponentScore === "number" &&
    typeof entry.userWon === "boolean" &&
    typeof entry.resultUrl === "string"
  );
}

export function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
