import type { MatchupFactor, Team } from "@/types/simulation";

export function MatchupFactors({ factors, teams }: { factors: MatchupFactor[]; teams: Team[] }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Matchup Factors</h3>
      <div className="mt-4 space-y-3">
        {factors.map((factor) => {
          const team = teams.find((item) => item.id === factor.teamId);
          return (
            <div key={`${factor.label}-${factor.teamId}`} className="rounded border border-white/10 bg-ink/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">{factor.label}</span>
                <span className="text-xs text-teal">{team?.franchise}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{factor.summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
