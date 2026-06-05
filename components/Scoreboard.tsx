import type { CSSProperties } from "react";
import type { SimulatedGame, SimulatedSeries, Team } from "@/types/simulation";
import { getTeamColors } from "@/lib/teamColors";
import { RulesetBadge } from "./RulesetBadge";

export function Scoreboard({ result }: { result: SimulatedGame | SimulatedSeries }) {
  const game = result.type === "single_game" ? result : result.decidingGame;
  const winnerId = result.winnerTeamId;

  return (
    <section className="border-b border-white/10 bg-neutral-950/88">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-3 text-neutral-200">
          <RulesetBadge ruleset={result.ruleset} />
          <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-neutral-300">
            Seed {result.seed}
          </span>
          <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-neutral-300">
            {result.type === "best_of_7" ? "Best-of-7" : "Single game"}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
          <ScoreTeam team={result.teamA} score={game.teamAScore} isWinner={winnerId === result.teamA.id} align="left" />
          <div className="hidden place-items-center rounded border border-white/10 bg-white/[0.04] px-5 text-sm font-black uppercase tracking-[0.28em] text-neutral-300 md:grid">
            Final
          </div>
          <ScoreTeam team={result.teamB} score={game.teamBScore} isWinner={winnerId === result.teamB.id} align="right" />
        </div>
        {result.type === "best_of_7" ? (
          <p className="mt-4 text-sm text-muted">
            {result.teamA.name} {result.teamAWins}, {result.teamB.name} {result.teamBWins}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function ScoreTeam({
  team,
  score,
  isWinner,
  align,
}: {
  team: Team;
  score: number;
  isWinner: boolean;
  align: "left" | "right";
}) {
  const colors = getTeamColors(team);
  const style = {
    "--score-primary": colors.primary,
    "--score-secondary": colors.secondary,
    "--score-accent": colors.accent,
  } as CSSProperties;

  return (
    <div
      style={style}
      className={`relative overflow-hidden rounded-md border p-5 ${
        isWinner ? "border-white/30 shadow-[0_18px_48px_rgba(0,0,0,0.35)]" : "border-white/10 opacity-[0.88]"
      } ${align === "right" ? "text-left md:text-right" : "text-left"}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--score-primary) 94%, #000 6%) 0 58%, color-mix(in srgb, var(--score-secondary) 88%, #111 12%) 58% 100%)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.26),transparent_54%)]" aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-4 md:block">
        <div>
          <div className="text-sm font-black uppercase tracking-[0.18em] text-white/74">{team.season}</div>
          <div className={`mt-1 text-2xl ${isWinner ? "font-black" : "font-semibold"} text-white sm:text-3xl`}>
            {team.franchise}
          </div>
        </div>
        <div className={`text-6xl font-black tracking-normal text-white sm:text-7xl ${isWinner ? "drop-shadow-[0_3px_0_rgba(0,0,0,0.35)]" : ""}`}>
          {score}
        </div>
      </div>
      {isWinner ? (
        <div className="relative mt-4 inline-flex rounded bg-white px-2 py-1 text-xs font-black uppercase tracking-[0.14em] text-neutral-950">
          Winner
        </div>
      ) : null}
    </div>
  );
}
