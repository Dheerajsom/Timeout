import { Award } from "lucide-react";
import type { PlayerBoxScore } from "@/types/simulation";

export function MvpCard({ mvp }: { mvp: PlayerBoxScore }) {
  return (
    <div className="rounded-md border border-teal/25 bg-teal/10 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-teal">
        <Award className="h-4 w-4" aria-hidden="true" />
        MVP
      </div>
      <div className="mt-3 text-2xl font-semibold text-white">{mvp.name}</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Stat label="PTS" value={mvp.points} />
        <Stat label="REB" value={mvp.rebounds} />
        <Stat label="AST" value={mvp.assists} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-white/10 bg-ink/50 px-2 py-3">
      <div className="text-xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}
