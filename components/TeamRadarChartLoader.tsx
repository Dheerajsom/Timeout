"use client";

import dynamic from "next/dynamic";
import type { Team } from "@/types/simulation";

const LazyTeamRadarChart = dynamic<{ teamA: Team; teamB: Team }>(
  () => import("./TeamRadarChart").then((module) => module.TeamRadarChart),
  {
    ssr: false,
    loading: () => <TeamRadarChartSkeleton />,
  },
);

export function TeamRadarChartLoader({ teamA, teamB }: { teamA: Team; teamB: Team }) {
  return <LazyTeamRadarChart teamA={teamA} teamB={teamB} />;
}

function TeamRadarChartSkeleton() {
  return (
    <div className="min-w-0 overflow-hidden rounded-md border border-white/12 bg-neutral-950 px-4 py-3">
      <div className="mx-auto h-[320px] w-[640px] max-w-full animate-pulse rounded-md bg-white/[0.06]" />
    </div>
  );
}
