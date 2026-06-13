export type Position = "PG" | "SG" | "SF" | "PF" | "C" | "G" | "F";

export type Ruleset =
  | "modern"
  | "physical_90s"
  | "early_2000s"
  | "bubble"
  | "neutral";

export type SimulationMode = "single_game" | "best_of_7";

export type Team = {
  id: string;
  name: string;
  franchise: string;
  season: string;
  wins: number;
  losses: number;
  pace: number;
  offense: number;
  defense: number;
  spacing: number;
  rimPressure: number;
  rebounding: number;
  playmaking: number;
  starPower: number;
  benchDepth: number;
  clutch: number;
  physicality: number;
  styleSummary: string;
  players: Player[];
};

export type Player = {
  id: string;
  teamId: string;
  name: string;
  position: Position;
  minutes: number;
  usage: number;
  scoring: number;
  efficiency: number;
  threePoint: number;
  playmaking: number;
  rebounding: number;
  defense: number;
  rimProtection: number;
  physicality: number;
  clutch: number;
};

export type MatchupFactor = {
  label: string;
  teamId: string;
  value: number;
  summary: string;
};

export type PlayerBoxScore = {
  playerId: string;
  name: string;
  position: Position;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  threesMade: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  plusMinus: number;
  mvpScore: number;
};

export type QuarterLine = {
  teamA: number;
  teamB: number;
};

export type SimulatedGame = {
  type: "single_game";
  seed: string;
  teamA: Team;
  teamB: Team;
  ruleset: Ruleset;
  winnerTeamId: string;
  teamAScore: number;
  teamBScore: number;
  quarters: {
    q1: QuarterLine;
    q2: QuarterLine;
    q3: QuarterLine;
    q4: QuarterLine;
  };
  teamABoxScore: PlayerBoxScore[];
  teamBBoxScore: PlayerBoxScore[];
  mvp: PlayerBoxScore;
  explanation: string;
  matchupFactors: MatchupFactor[];
};

export type SeriesGame = SimulatedGame & {
  gameNumber: number;
};

export type SimulatedSeries = {
  type: "best_of_7";
  seed: string;
  teamA: Team;
  teamB: Team;
  ruleset: Ruleset;
  winnerTeamId: string;
  teamAWins: number;
  teamBWins: number;
  games: SeriesGame[];
  decidingGame: SimulatedGame;
  mvp: PlayerBoxScore;
  explanation: string;
  matchupFactors: MatchupFactor[];
};

export type SavedSimulation = {
  id: string;
  teamAId: string;
  teamBId: string;
  mode: SimulationMode;
  ruleset: Ruleset;
  seed: string;
  result: SimulatedGame | SimulatedSeries;
  createdAt: string;
};
