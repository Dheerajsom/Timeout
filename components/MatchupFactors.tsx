import type { MatchupFactor, Team } from "@/types/simulation";

export function MatchupFactors({ factors, teams }: { factors: MatchupFactor[]; teams: Team[] }) {
  const visibleFactors = factors.filter((factor) => factor.label !== "Ruleset");

  return (
    <div className="rounded-md border border-orange-200/18 bg-[#17110b] p-4 shadow-[0_16px_36px_rgba(36,20,8,0.26)]">
      <h3 className="text-sm font-black uppercase tracking-[0.16em] text-orange-100">Matchup Factors</h3>
      <div className="mt-4 space-y-3">
        {visibleFactors.map((factor) => {
          const team = teams.find((item) => item.id === factor.teamId);
          return (
            <div key={`${factor.label}-${factor.teamId}`} className="rounded border border-orange-100/14 bg-[#241a11] p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">{factor.label}</span>
                <span className="text-xs font-bold text-teal">{team?.franchise}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-orange-50/76">{factor.summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
