import type { MatchupFactor, Ruleset, Team } from "@/types/simulation";
import { rulesetModifiers } from "./constants";

/** Numeric fields on `Team` only — an edge compares two of them directly. */
type NumericStat = { [K in keyof Team]: Team[K] extends number ? K : never }[keyof Team];

type Edge = {
  label: string;
  stat: NumericStat;
  copy: string;
};

const edges: Edge[] = [
  { label: "Spacing", stat: "spacing", copy: "created cleaner perimeter looks and pulled help defenders away from the paint." },
  { label: "Rim pressure", stat: "rimPressure", copy: "generated pressure at the basket and forced rotations into uncomfortable spots." },
  { label: "Defense", stat: "defense", copy: "shrunk high-value looks with stronger coverage discipline." },
  { label: "Rebounding", stat: "rebounding", copy: "finished more possessions and limited second-chance swings." },
  { label: "Star power", stat: "starPower", copy: "had more late-clock answers when the game tightened." },
  { label: "Bench depth", stat: "benchDepth", copy: "kept its quality of play higher when the rotations stretched." },
  { label: "Physicality", stat: "physicality", copy: "handled contact better and changed the terms of the matchup." },
];

export function buildMatchupFactors(teamA: Team, teamB: Team, ruleset: Ruleset): MatchupFactor[] {
  const factors = edges
    .map((edge) => {
      const value = teamA[edge.stat] - teamB[edge.stat];
      const leader = value >= 0 ? teamA : teamB;
      return {
        label: edge.label,
        teamId: leader.id,
        value: Math.abs(value),
        summary: `${leader.name} ${edge.copy}`,
      };
    })
    .filter((factor) => factor.value >= 4)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const rules = rulesetModifiers[ruleset];
  const rulesLeader =
    teamA.physicality * rules.physicalityMultiplier + teamA.spacing * rules.spacingMultiplier >
    teamB.physicality * rules.physicalityMultiplier + teamB.spacing * rules.spacingMultiplier
      ? teamA
      : teamB;

  return [
    ...factors,
    {
      label: "Ruleset",
      teamId: rulesLeader.id,
      value: 5,
      summary: `${rules.label} rules nudged the environment toward ${rulesLeader.franchise}'s strengths.`,
    },
  ].slice(0, 5);
}

export function explainMatchup(winner: Team, loser: Team, factors: MatchupFactor[]) {
  const winnerFactors = factors.filter((factor) => factor.teamId === winner.id);
  const opening =
    winnerFactors.length > 0
      ? `${winner.name} controlled the matchup through ${winnerFactors
          .slice(0, 2)
          .map((factor) => factor.label.toLowerCase())
          .join(" and ")}.`
      : `${winner.name} found enough margins to survive a balanced matchup.`;

  const counter = factors.find((factor) => factor.teamId === loser.id);
  const closing = counter
    ? `${loser.franchise} kept pressure on the result because ${counter.summary.charAt(0).toLowerCase()}${counter.summary.slice(1)}`
    : `${loser.franchise} stayed competitive, but did not create a big enough structural edge.`;

  return `${opening} ${winnerFactors[0]?.summary ?? winner.styleSummary} ${closing}`;
}
