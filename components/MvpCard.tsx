import { Award } from "lucide-react";
import type { PlayerBoxScore } from "@/types/simulation";

export function MvpCard({ mvp }: { mvp: PlayerBoxScore }) {
  const scoringImpact = clampMetric((mvp.points / 45) * 100);
  const floorImpact = clampMetric(((mvp.assists * 4 + mvp.rebounds * 2.2) / 78) * 100);
  const disruptionImpact = clampMetric((((mvp.steals + mvp.blocks) * 11 + Math.max(mvp.plusMinus, 0) * 1.4) / 72) * 100);
  const fieldGoalLabel = `${mvp.fieldGoalsMade}-${mvp.fieldGoalsAttempted}`;
  const plusMinusLabel = mvp.plusMinus > 0 ? `+${mvp.plusMinus}` : `${mvp.plusMinus}`;

  return (
    <div className="relative flex min-h-[330px] flex-1 overflow-hidden rounded-[1.45rem] border border-amber-200/34 bg-[#100c14] p-5 shadow-[0_24px_60px_rgba(32,16,9,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,115,22,0.34),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(20,184,166,0.22),transparent_30%),linear-gradient(135deg,#171022_0%,#160d0a_52%,#2a1608_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-5 top-0 h-1 rounded-b-full bg-[linear-gradient(90deg,#fb923c,#facc15,#14b8a6)]" aria-hidden="true" />
      <div className="relative flex w-full flex-col justify-between gap-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-100/24 bg-black/22 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-amber-100">
              <Award className="h-4 w-4" aria-hidden="true" />
              MVP
            </div>
            <div className="rounded-full border border-teal-200/20 bg-teal-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-teal-200">
              Impact
            </div>
          </div>
          <div className="mt-5 text-3xl font-black leading-9 text-white">{mvp.name}</div>
          <div className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-amber-100/72">
            {fieldGoalLabel} FG · {plusMinusLabel} +/-
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="PTS" value={mvp.points} />
          <Stat label="REB" value={mvp.rebounds} />
          <Stat label="AST" value={mvp.assists} />
        </div>

        <div className="space-y-3 rounded-[1.05rem] border border-white/10 bg-black/24 p-3">
          <ImpactBar label="Scoring burst" value={scoringImpact} />
          <ImpactBar label="Floor control" value={floorImpact} />
          <ImpactBar label="Two-way edge" value={disruptionImpact} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-amber-100/18 bg-white/[0.07] px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs font-bold text-amber-100/78">{label}</div>
    </div>
  );
}

function ImpactBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.14em] text-amber-50/78">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#fb923c,#facc15,#14b8a6)] shadow-[0_0_18px_rgba(251,146,60,0.32)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function clampMetric(value: number) {
  return Math.max(8, Math.min(100, Math.round(value)));
}
