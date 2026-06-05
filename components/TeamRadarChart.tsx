"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
} from "recharts";
import type { Team } from "@/types/simulation";

export function TeamRadarChart({ teamA, teamB }: { teamA: Team; teamB: Team }) {
  const data = [
    "offense",
    "defense",
    "spacing",
    "rimPressure",
    "rebounding",
    "playmaking",
    "starPower",
    "physicality",
  ].map((key) => ({
    metric: labelize(key),
    [teamA.franchise]: Number(teamA[key as keyof Team]),
    [teamB.franchise]: Number(teamB[key as keyof Team]),
  }));

  return (
    <div className="overflow-x-auto rounded-md border border-white/10 bg-white/[0.03] p-4">
      <div className="mx-auto w-[640px] max-w-full">
        <RadarChart width={640} height={320} data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.14)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#8f98a8", fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: "#101318", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6 }}
            labelStyle={{ color: "#f6f7fb" }}
          />
          <Radar name={teamA.franchise} dataKey={teamA.franchise} stroke="#26d0b8" fill="#26d0b8" fillOpacity={0.18} />
          <Radar name={teamB.franchise} dataKey={teamB.franchise} stroke="#ff4f5a" fill="#ff4f5a" fillOpacity={0.12} />
        </RadarChart>
      </div>
    </div>
  );
}

function labelize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
}
