import { Award } from "lucide-react";
import type { PlayerBoxScore } from "@/types/simulation";

export function MvpCard({ mvp }: { mvp: PlayerBoxScore }) {
  return (
    <div className="rounded-md border border-orange-200/22 bg-[#17110b] p-4 shadow-[0_18px_48px_rgba(36,20,8,0.34)]">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-orange-100">
        <Award className="h-4 w-4" aria-hidden="true" />
        MVP
      </div>
      <div className="mt-3 text-2xl font-black text-white">{mvp.name}</div>
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
    <div className="rounded border border-orange-100/18 bg-[#241a11] px-2 py-3">
      <div className="text-xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs font-bold text-orange-100/78">{label}</div>
    </div>
  );
}
