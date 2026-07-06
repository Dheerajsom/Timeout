"use client";

import { Loader2, Play, RotateCcw, Undo2 } from "lucide-react";
import { getTeamColors } from "@/lib/teamColors";
import { getTeamInitials, type RoundTeam } from "@/lib/round";
import { formatWinPct } from "@/components/round/SquadCard";

const comparedStats = [
  { key: "offense", label: "Offense" },
  { key: "defense", label: "Defense" },
  { key: "rebounding", label: "Rebounding" },
  { key: "pace", label: "Pace" },
  { key: "benchDepth", label: "Bench" },
] as const;

/**
 * Broadcast-style matchup screen: your squad vs the revealed opponent, with a
 * head-to-head rating strip and the simulation trigger.
 */
export function VersusPanel({
  user,
  opponent,
  simulating,
  error,
  onSimulate,
  onChangePick,
  onNewRound,
}: {
  user: RoundTeam;
  opponent: RoundTeam;
  simulating: boolean;
  error: string;
  onSimulate: () => void;
  onChangePick: () => void;
  onNewRound: () => void;
}) {
  const userColors = getTeamColors(user);
  const opponentColors = getTeamColors(opponent);

  return (
    <div>
      <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4">
        <TeamSide team={user} role="Your call" enter="left" />
        <div className="flex items-center justify-center py-1">
          <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-orange-400/80 bg-ink font-display text-xl font-bold text-orange-300 shadow-[0_0_28px_rgba(249,115,22,0.35)]">
            VS
          </span>
        </div>
        <TeamSide team={opponent} role="The opponent" enter="right" />
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-ink/60 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.16em]">
          <span className="text-white/80">{getTeamInitials(user.franchise)} &middot; {user.season}</span>
          <span className="text-muted">Head to head</span>
          <span className="text-white/80">{opponent.season} &middot; {getTeamInitials(opponent.franchise)}</span>
        </div>
        <div className="space-y-2.5">
          {comparedStats.map((stat, index) => (
            <CompareRow
              key={stat.key}
              label={stat.label}
              a={user[stat.key]}
              b={opponent[stat.key]}
              colorA={userColors.primary}
              colorB={opponentColors.primary}
              delay={index * 70}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onSimulate}
          disabled={simulating}
          className="inline-flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-md bg-orange-500 px-8 text-sm font-black uppercase tracking-wide text-white shadow-cta transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {simulating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Calling the game&hellip;
            </>
          ) : (
            <>
              <Play className="h-4 w-4" aria-hidden="true" />
              Run Simulation
            </>
          )}
        </button>
        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.14em] text-muted">
          <button
            type="button"
            onClick={onChangePick}
            disabled={simulating}
            className="inline-flex items-center gap-1.5 transition hover:text-white disabled:opacity-50"
          >
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
            Change pick
          </button>
          <button
            type="button"
            onClick={onNewRound}
            disabled={simulating}
            className="inline-flex items-center gap-1.5 transition hover:text-white disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            New round
          </button>
        </div>
        {error ? (
          <p role="alert" className="text-sm font-semibold text-loss">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function TeamSide({
  team,
  role,
  enter,
}: {
  team: RoundTeam;
  role: string;
  enter: "left" | "right";
}) {
  const colors = getTeamColors(team);
  const alignRight = enter === "right";

  return (
    <div
      className={`${enter === "left" ? "vs-enter-left" : "vs-enter-right"} flex h-full flex-col overflow-hidden rounded-lg border border-white/12 bg-panel`}
    >
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${colors.primary} 0 62%, ${colors.secondary} 62% 100%)` }}
      />
      <div className={`flex flex-1 flex-col p-4 ${alignRight ? "lg:items-end lg:text-right" : ""}`}>
        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
            role === "Your call" ? "bg-orange-500/15 text-orange-300" : "bg-white/8 text-white/70"
          }`}
        >
          {role}
        </span>
        <div className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-muted">
          {team.season} season
        </div>
        <div className="font-display text-3xl font-bold uppercase leading-9 text-white sm:text-4xl sm:leading-10">
          {team.franchise}
        </div>
        <div className="mt-1 font-display text-base font-bold tabular-nums text-white/85">
          {team.wins}&ndash;{team.losses}
          <span className="ml-2 text-sm text-muted">{formatWinPct(team)}</span>
          <span className="ml-3 text-sm text-orange-300">{team.overall} OVR</span>
        </div>
        <div className="mt-2 text-sm font-semibold leading-5 text-white/85">
          {team.stars.join(" · ")}
        </div>
        <div className="mt-auto pt-3">
          <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/75">
            {team.identity}
          </span>
        </div>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  a,
  b,
  colorA,
  colorB,
  delay,
}: {
  label: string;
  a: number;
  b: number;
  colorA: string;
  colorB: string;
  delay: number;
}) {
  const aLeads = a >= b;

  return (
    <div className="grid grid-cols-[2.5rem_1fr_5.5rem_1fr_2.5rem] items-center gap-2 sm:grid-cols-[3rem_1fr_6.5rem_1fr_3rem]">
      <span className={`text-right font-display text-base font-bold tabular-nums ${aLeads ? "text-white" : "text-white/45"}`}>
        {a}
      </span>
      <span className="flex h-2 justify-end overflow-hidden rounded-full bg-white/6">
        <span
          className="bar-grow-left h-full rounded-full"
          style={{ width: `${barWidth(a)}%`, background: colorA, opacity: aLeads ? 1 : 0.45, animationDelay: `${delay}ms` }}
        />
      </span>
      <span className="text-center text-[10px] font-black uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <span className="flex h-2 overflow-hidden rounded-full bg-white/6">
        <span
          className="bar-grow-right h-full rounded-full"
          style={{ width: `${barWidth(b)}%`, background: colorB, opacity: aLeads ? 0.45 : 1, animationDelay: `${delay}ms` }}
        />
      </span>
      <span className={`font-display text-base font-bold tabular-nums ${aLeads ? "text-white/45" : "text-white"}`}>
        {b}
      </span>
    </div>
  );
}

// Ratings cluster between ~55 and 99; stretch that band so the bars actually differ.
function barWidth(value: number) {
  return Math.min(100, Math.max(8, ((value - 50) / 50) * 100));
}
