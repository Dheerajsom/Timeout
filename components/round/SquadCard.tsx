import { Lock, ShieldCheck } from "lucide-react";
import { getTeamColors } from "@/lib/teamColors";
import { formatWinPct, getTeamInitials, type RoundTeam } from "@/lib/round";

/**
 * Revealed squad card. With `showStats` (With Stats mode) it lays out
 * everything needed to compare three teams — era, record, rating, stars,
 * identity. Without it (Normal mode) it shows season + franchise only, so the
 * pick rides on the player's own basketball knowledge.
 */
export function SquadCard({
  team,
  showStats = true,
  selected,
  dimmed,
  disabled,
  revealDelay = 0,
  onTrust,
}: {
  team: RoundTeam;
  showStats?: boolean;
  selected?: boolean;
  dimmed?: boolean;
  disabled?: boolean;
  revealDelay?: number;
  onTrust?: (team: RoundTeam) => void;
}) {
  const colors = getTeamColors(team);

  return (
    <div
      className={`card-reveal relative flex h-full flex-col overflow-hidden rounded-lg border bg-panel transition ${
        selected
          ? "lock-pulse border-orange-400/80 ring-2 ring-orange-400/60"
          : dimmed
            ? "border-white/8 opacity-40"
            : "border-white/12 hover:border-white/25"
      }`}
      style={{ animationDelay: `${revealDelay}ms` }}
    >
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${colors.primary} 0 62%, ${colors.secondary} 62% 100%)` }}
      />

      {selected ? (
        <span className="absolute right-3 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-cta">
          <Lock className="h-3 w-3" aria-hidden="true" />
          Locked in
        </span>
      ) : null}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-black text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
            style={{ background: colors.primary, boxShadow: `inset 0 0 0 2px ${colors.secondary}` }}
          >
            {getTeamInitials(team.franchise)}
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-muted">
              {team.season} season
            </div>
            <div className="truncate font-display text-2xl font-bold uppercase leading-7 text-white">
              {team.franchise}
            </div>
          </div>
        </div>

        {showStats ? (
          <>
            <div className="mt-3 flex items-center justify-between rounded-md border border-white/8 bg-ink/60 px-3 py-2">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Record</div>
                <div className="font-display text-lg font-bold tabular-nums text-white">
                  {team.wins}&ndash;{team.losses}
                  <span className="ml-2 text-sm text-muted">{formatWinPct(team)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Rating</div>
                <div className="font-display text-lg font-bold tabular-nums text-orange-300">{team.overall}</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Core</div>
              <div className="mt-1 space-y-0.5 text-sm font-semibold leading-5 text-white/90">
                {team.stars.map((star) => (
                  <div key={star} className="truncate">{star}</div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex-1">
              <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/75">
                {team.identity}
              </span>
            </div>
          </>
        ) : (
          <div className="mt-3 flex flex-1 items-center rounded-md border border-dashed border-white/10 bg-ink/40 px-3 py-3 text-xs font-semibold leading-5 text-muted">
            No scouting report. What do you remember about this squad?
          </div>
        )}

        {onTrust ? (
          <button
            type="button"
            onClick={() => onTrust(team)}
            disabled={disabled}
            aria-pressed={selected}
            className={`mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-black uppercase tracking-wide transition disabled:cursor-not-allowed ${
              selected
                ? "bg-orange-500 text-white shadow-cta"
                : "border border-white/15 bg-white/5 text-white hover:border-orange-400/70 hover:bg-orange-500/15 disabled:opacity-50"
            }`}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {selected ? "Your call" : "Trust this team"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
