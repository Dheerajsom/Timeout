import type { PlayerBoxScore, QuarterLine } from "@/types/simulation";
import { SeededRng } from "./rng";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function splitIntoQuarters(total: number, rng: SeededRng) {
  const weights = [
    0.25 + rng.normal(0, 0.025),
    0.25 + rng.normal(0, 0.025),
    0.25 + rng.normal(0, 0.025),
    0.25 + rng.normal(0, 0.025),
  ];
  const sum = weights.reduce((acc, value) => acc + value, 0);
  const firstThree = weights.slice(0, 3).map((weight) => Math.max(14, Math.round((weight / sum) * total)));
  const last = total - firstThree.reduce((acc, value) => acc + value, 0);
  return [...firstThree, last];
}

export function buildQuarterLines(teamA: number[], teamB: number[]) {
  return {
    q1: { teamA: teamA[0], teamB: teamB[0] },
    q2: { teamA: teamA[1], teamB: teamB[1] },
    q3: { teamA: teamA[2], teamB: teamB[2] },
    q4: { teamA: teamA[3], teamB: teamB[3] },
  } satisfies Record<string, QuarterLine>;
}

export function calculateMvpScore(box: Omit<PlayerBoxScore, "mvpScore">) {
  return (
    box.points * 1 +
    box.rebounds * 0.7 +
    box.assists * 0.8 +
    box.steals * 1.8 +
    box.blocks * 1.8 -
    box.turnovers * 1.2
  );
}
