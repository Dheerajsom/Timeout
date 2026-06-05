import type { Ruleset, SimulatedGame, Team } from "@/types/simulation";
import { calculateTeamStrength } from "./calculateTeamStrength";
import { buildMatchupFactors, explainMatchup } from "./explainMatchup";
import { generateBoxScore } from "./generateBoxScore";
import { SeededRng } from "./rng";
import { buildQuarterLines, clamp, splitIntoQuarters } from "./utils";
import { rulesetModifiers } from "./constants";

export function simulateGame({
  teamA,
  teamB,
  ruleset,
  seed,
}: {
  teamA: Team;
  teamB: Team;
  ruleset: Ruleset;
  seed: string;
}): SimulatedGame {
  const rng = new SeededRng(seed);
  const rules = rulesetModifiers[ruleset];
  const strengthA = calculateTeamStrength(teamA, teamB, ruleset);
  const strengthB = calculateTeamStrength(teamB, teamA, ruleset);
  const averagePace = ((teamA.pace + teamB.pace) / 2 - 84) * 0.42 * rules.paceMultiplier;

  const scoreA = makeScore({ team: teamA, opponent: teamB, strength: strengthA - strengthB, pace: averagePace, rng, ruleset });
  let scoreB = makeScore({ team: teamB, opponent: teamA, strength: strengthB - strengthA, pace: averagePace, rng, ruleset });

  if (scoreA === scoreB) {
    scoreB += rng.next() > 0.5 ? 1 : -1;
  }

  const teamAQuarters = splitIntoQuarters(scoreA, rng);
  const teamBQuarters = splitIntoQuarters(scoreB, rng);
  const teamABoxScore = generateBoxScore({ team: teamA, opponent: teamB, teamScore: scoreA, opponentScore: scoreB, ruleset, rng });
  const teamBBoxScore = generateBoxScore({ team: teamB, opponent: teamA, teamScore: scoreB, opponentScore: scoreA, ruleset, rng });
  const winnerTeamId = scoreA > scoreB ? teamA.id : teamB.id;
  const winner = winnerTeamId === teamA.id ? teamA : teamB;
  const loser = winnerTeamId === teamA.id ? teamB : teamA;
  const winningBoxScore = winnerTeamId === teamA.id ? teamABoxScore : teamBBoxScore;
  const mvp = winningBoxScore.reduce((best, player) => (player.mvpScore > best.mvpScore ? player : best), winningBoxScore[0]);
  const matchupFactors = buildMatchupFactors(teamA, teamB, ruleset);

  return {
    type: "single_game",
    seed,
    teamA,
    teamB,
    ruleset,
    winnerTeamId,
    teamAScore: scoreA,
    teamBScore: scoreB,
    quarters: buildQuarterLines(teamAQuarters, teamBQuarters),
    teamABoxScore,
    teamBBoxScore,
    mvp,
    explanation: explainMatchup(winner, loser, matchupFactors),
    matchupFactors,
  };
}

function makeScore({
  team,
  opponent,
  strength,
  pace,
  rng,
  ruleset,
}: {
  team: Team;
  opponent: Team;
  strength: number;
  pace: number;
  rng: SeededRng;
  ruleset: Ruleset;
}) {
  const rules = rulesetModifiers[ruleset];
  const offenseModifier = (team.offense - opponent.defense) * 0.3;
  const spacingModifier = ((team.spacing * rules.spacingMultiplier - 82) / 100) * 9;
  const rimModifier = (team.rimPressure - opponent.physicality) * 0.08;
  const randomVariance = rng.normal(0, 7.8);

  return Math.round(
    clamp(106 + pace + offenseModifier + spacingModifier + rimModifier + strength * 0.7 + randomVariance, 82, 145),
  );
}
