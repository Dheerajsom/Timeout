"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
} from "recharts";
import type { Team } from "@/types/simulation";

const radarMetrics = [
  "offense",
  "defense",
  "spacing",
  "rimPressure",
  "rebounding",
  "playmaking",
  "starPower",
  "physicality",
] as const satisfies readonly (keyof Team)[];

export function TeamRadarChart({ teamA, teamB }: { teamA: Team; teamB: Team }) {
  // Two squads can share one franchise name (e.g. the 1991 and 1996 Bulls), so
  // the series keys must be stable — keying off the franchise would collapse
  // both teams into a single series on those matchups.
  const data = radarMetrics.map((key) => ({
    metric: labelize(key),
    teamA: Number(teamA[key]),
    teamB: Number(teamB[key]),
  }));

  return (
    <div className="min-w-0 overflow-x-auto rounded-md border border-white/12 bg-neutral-950 px-4 py-3">
      <div className="mx-auto w-[640px] max-w-full">
        <RadarChart width={640} height={320} data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.14)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#d1d5db", fontSize: 12, fontWeight: 700 }} />
          <Tooltip
            contentStyle={{ background: "#101318", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6 }}
            labelStyle={{ color: "#f6f7fb" }}
          />
          <Radar name={teamA.franchise} dataKey="teamA" stroke="#26d0b8" fill="#26d0b8" fillOpacity={0.18} />
          <Radar name={teamB.franchise} dataKey="teamB" stroke="#ff4f5a" fill="#ff4f5a" fillOpacity={0.12} />
        </RadarChart>
      </div>
    </div>
  );
}

function labelize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
}
