import type { Ruleset, Team } from "@/types/simulation";
import { rulesetModifiers } from "./constants";

export function calculateTeamStrength(team: Team, opponent: Team, ruleset: Ruleset) {
  const rules = rulesetModifiers[ruleset];

  const adjustedSpacing = team.spacing * rules.spacingMultiplier;
  const adjustedPhysicality = team.physicality * rules.physicalityMultiplier;

  const base =
    team.offense * 0.26 +
    team.defense * 0.22 +
    team.starPower * 0.14 +
    adjustedSpacing * 0.1 +
    team.playmaking * 0.08 +
    team.rebounding * 0.07 +
    team.rimPressure * 0.06 +
    team.benchDepth * 0.04 +
    team.clutch * 0.03;

  const spacingEdge = (team.spacing - opponent.defense) * 0.05;
  const rimEdge = (team.rimPressure - opponent.defense) * 0.04;
  const physicalityEdge = (adjustedPhysicality - opponent.physicality) * 0.03;
  const reboundingEdge = (team.rebounding - opponent.rebounding) * 0.03;

  return base + spacingEdge + rimEdge + physicalityEdge + reboundingEdge;
}
