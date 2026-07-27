"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Search, Swords, X } from "lucide-react";
import { getTeamColors } from "@/lib/teamColors";
import { modeOptions } from "@/lib/simulation/constants";
import { saveRoundHistory, type SimulationPayload } from "@/lib/roundHistory";
import type { TeamSummary } from "@/lib/teamSummary";
import type { SimulationMode } from "@/types/simulation";

const activeRuleset = "modern";
/** The full pool is ~1,300 teams; cap the rendered list and nudge users to filter. */
const visibleLimit = 150;

export function CustomMatchup({ teams }: { teams: TeamSummary[] }) {
  const router = useRouter();
  const [teamAId, setTeamAId] = useState("");
  const [teamBId, setTeamBId] = useState("");
  const [mode, setMode] = useState<SimulationMode>("single_game");
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState("");
  const [activePicker, setActivePicker] = useState<"home" | "away">("home");

  const teamA = teams.find((team) => team.id === teamAId) ?? null;
  const teamB = teams.find((team) => team.id === teamBId) ?? null;
  const sameTeam = Boolean(teamA && teamB && teamA.id === teamB.id);
  const ready = Boolean(teamA && teamB && !sameTeam);

  useEffect(() => {
    document.body.classList.add("has-mobile-action-bar");
    return () => document.body.classList.remove("has-mobile-action-bar");
  }, []);

  async function simulateMatchup() {
    if (!teamA || !teamB) {
      setError("Pick both squads first.");
      return;
    }

    if (teamA.id === teamB.id) {
      setError("Pick two different squads.");
      return;
    }

    setError("");
    setIsSimulating(true);

    let payload: SimulationPayload & { error?: string };
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamAId: teamA.id,
          teamBId: teamB.id,
          mode,
          ruleset: activeRuleset,
        }),
      });
      payload = (await response.json()) as SimulationPayload & { error?: string };

      if (!response.ok) {
        setIsSimulating(false);
        setError(payload.error ?? "Simulation failed.");
        return;
      }
    } catch {
      setIsSimulating(false);
      setError("Simulation failed. Check your connection and try again.");
      return;
    }

    setIsSimulating(false);
    saveRoundHistory(teamA, teamB, payload);
    router.push(`/result/${payload.simulationId}`);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-28 pt-1 sm:px-6 sm:pb-10 sm:pt-4 lg:px-8">
      <section className="relative mx-auto max-w-5xl text-center">
        <h1 className="hero-title text-[2rem] font-black leading-tight tracking-normal sm:text-4xl">
          Build your own matchup.
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-base font-semibold leading-7 text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.55)] sm:mt-3">
          No wheels, no luck. Pick any two squads from any era and settle the debate.
        </p>
      </section>

      {/* Face-off marquee */}
      <section className="relative mx-auto mt-5 max-w-7xl rounded-lg border border-white/18 bg-neutral-950/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:mt-7 sm:p-6">
        <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-5">
          <FaceoffCard
            team={teamA}
            side="home"
            placeholder="Your squad"
            onClear={() => setTeamAId("")}
          />
          <div className="relative flex items-center justify-center py-1 sm:py-0">
            <span className="vs-badge relative z-10 grid h-14 w-14 place-items-center rounded-full bg-orange-500 text-lg font-black italic text-white shadow-[0_0_30px_rgba(249,115,22,0.45)] sm:h-16 sm:w-16 sm:text-xl">
              VS
            </span>
          </div>
          <FaceoffCard
            team={teamB}
            side="away"
            placeholder="Opponent squad"
            onClear={() => setTeamBId("")}
          />
        </div>

        <div className="mt-4 hidden items-end justify-center gap-3 sm:flex">
          <label className="block">
            <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Mode</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as SimulationMode)}
              className="h-12 w-44 rounded-md border border-white/15 bg-neutral-900 px-3 text-sm font-semibold text-white outline-none transition focus:border-orange-300"
            >
              {modeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={simulateMatchup}
            disabled={!ready || isSimulating}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-orange-500 px-8 text-sm font-black uppercase text-white shadow-[0_10px_30px_rgba(255,107,0,0.3)] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500 disabled:shadow-none"
          >
            {isSimulating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Swords className="h-4 w-4" aria-hidden="true" />}
            Simulate matchup
          </button>
        </div>
        {error ? <p className="mt-3 text-center text-sm font-semibold text-orange-300">{error}</p> : null}
      </section>

      {/* Mobile picker switch — one box at a time so each gets the full width */}
      <div className="mx-auto mt-5 flex max-w-7xl items-center gap-1 rounded-md border border-white/18 bg-neutral-950/95 p-1 sm:mt-6 lg:hidden">
        <PickerTab
          accent="home"
          label="Your squad"
          active={activePicker === "home"}
          filled={Boolean(teamA)}
          onClick={() => setActivePicker("home")}
        />
        <PickerTab
          accent="away"
          label="Opponent"
          active={activePicker === "away"}
          filled={Boolean(teamB)}
          onClick={() => setActivePicker("away")}
        />
      </div>

      <section className="relative mx-auto mt-3 max-w-7xl lg:mt-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-5">
        <SquadPicker
          title="Your squad"
          accent="home"
          teams={teams}
          selectedId={teamAId}
          excludedId={teamBId}
          className={activePicker === "home" ? "" : "hidden lg:block"}
          onSelect={(id) => {
            setTeamAId(id);
            setError("");
            setActivePicker("away");
          }}
        />
        <SquadPicker
          title="Opponent squad"
          accent="away"
          teams={teams}
          selectedId={teamBId}
          excludedId={teamAId}
          className={activePicker === "away" ? "" : "hidden lg:block"}
          onSelect={(id) => {
            setTeamBId(id);
            setError("");
          }}
        />
      </section>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-neutral-950/95 px-4 py-3 shadow-[0_-12px_40px_rgba(0,0,0,0.5)] backdrop-blur sm:hidden">
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as SimulationMode)}
            aria-label="Mode"
            className="h-12 min-w-0 flex-1 rounded-md border border-white/15 bg-neutral-900 px-3 text-sm font-semibold text-white outline-none transition focus:border-orange-300"
          >
            {modeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={simulateMatchup}
            disabled={!ready || isSimulating}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-black uppercase text-white shadow-[0_10px_30px_rgba(255,107,0,0.3)] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500 disabled:shadow-none"
          >
            {isSimulating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Swords className="h-4 w-4" aria-hidden="true" />}
            Simulate
          </button>
        </div>
      </div>
    </main>
  );
}

function PickerTab({
  accent,
  label,
  active,
  filled,
  onClick,
}: {
  accent: "home" | "away";
  label: string;
  active: boolean;
  filled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded text-xs font-black uppercase tracking-[0.1em] transition ${
        active
          ? "bg-orange-500 text-white shadow-[0_8px_22px_rgba(255,107,0,0.3)]"
          : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 rounded-full ${accent === "home" ? "bg-orange-400" : "bg-sky-400"} ${
          active ? "ring-2 ring-white/70" : ""
        }`}
      />
      {label}
      {filled ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
    </button>
  );
}

function FaceoffCard({
  team,
  side,
  placeholder,
  onClear,
}: {
  team: TeamSummary | null;
  side: "home" | "away";
  placeholder: string;
  onClear: () => void;
}) {
  if (!team) {
    return (
      <div className="slot-idle flex min-h-[110px] flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-neutral-900 px-4 py-5 text-center sm:min-h-[150px]">
        <Swords className="h-5 w-5 text-neutral-500" aria-hidden="true" />
        <span className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-neutral-400">{placeholder}</span>
        <span className="mt-1 text-[11px] font-semibold text-neutral-500">Pick from the list below</span>
      </div>
    );
  }

  const colors = getTeamColors(team);
  const style = {
    "--team-primary": colors.primary,
    "--team-secondary": colors.secondary,
    "--team-accent": colors.accent,
  } as CSSProperties;

  return (
    <div
      style={style}
      className="team-card relative min-h-[110px] rounded-md border border-white/25 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.4)] sm:min-h-[150px]"
    >
      <button
        type="button"
        onClick={onClear}
        aria-label={`Clear ${placeholder.toLowerCase()}`}
        className={`!absolute bottom-2.5 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/45 text-white/70 transition hover:bg-black/70 hover:text-white ${
          side === "away" ? "left-2.5" : "right-2.5"
        }`}
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <div className={`flex h-full min-h-[78px] flex-col justify-between sm:min-h-[118px] ${side === "away" ? "items-end text-right" : ""}`}>
        <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/90">
          {side === "home" ? "Your squad" : "Opponent"}
        </span>
        <div>
          <div className="text-xs font-black uppercase tracking-[0.16em] text-white/90 drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]">{team.season}</div>
          <div className="mt-1 text-xl font-black leading-6 text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.5)] sm:text-2xl sm:leading-7">{team.franchise}</div>
          <div className="mt-1 text-[11px] font-bold text-white/80 drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]">
            {team.wins}-{team.losses}
          </div>
        </div>
      </div>
    </div>
  );
}

function decadeOf(team: TeamSummary) {
  const year = Number.parseInt(team.season, 10);
  if (Number.isNaN(year)) return null;
  return `${Math.floor(year / 10) * 10}s`;
}

function SquadPicker({
  title,
  accent,
  teams,
  selectedId,
  excludedId,
  onSelect,
  className = "",
}: {
  title: string;
  accent: "home" | "away";
  teams: TeamSummary[];
  selectedId: string;
  excludedId: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const [search, setSearch] = useState("");
  const [decade, setDecade] = useState("all");

  const decades = useMemo(() => {
    const set = new Set<string>();
    for (const team of teams) {
      const value = decadeOf(team);
      if (value) set.add(value);
    }
    return Array.from(set).sort();
  }, [teams]);

  const query = search.trim().toLowerCase();
  // Re-filtering ~1,300 teams on every keystroke is the one hot path here, so
  // keep it off unrelated re-renders.
  const matches = useMemo(
    () =>
      teams.filter((team) => {
        if (decade !== "all" && decadeOf(team) !== decade) return false;
        if (query && !`${team.season} ${team.franchise}`.toLowerCase().includes(query)) return false;
        return true;
      }),
    [teams, decade, query],
  );
  const results = matches.slice(0, visibleLimit);
  const hiddenCount = matches.length - results.length;

  return (
    <div className={`min-w-0 rounded-lg border border-white/18 bg-neutral-950/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-center gap-2 text-center">
        <span
          className={`h-2.5 w-2.5 rounded-full ${accent === "home" ? "bg-orange-400" : "bg-sky-400"}`}
          aria-hidden="true"
        />
        <h2 className="panel-title text-2xl font-black text-white sm:text-3xl">{title}</h2>
      </div>

      <label className="relative block">
        <span className="sr-only">Search teams</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search every team"
          className="h-12 w-full rounded-md border border-white/15 bg-neutral-900 pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-neutral-500 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20"
        />
      </label>

      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
        {["all", ...decades].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setDecade(value)}
            className={`min-h-11 shrink-0 rounded-full border px-3 py-2 text-[11px] font-black uppercase tracking-[0.1em] transition ${
              decade === value
                ? "border-orange-300 bg-orange-500 text-white"
                : "border-white/15 bg-neutral-900 text-neutral-300 hover:border-orange-300/60 hover:text-white"
            }`}
          >
            {value === "all" ? "All eras" : value}
          </button>
        ))}
      </div>

      <div className="mt-3 grid max-h-[340px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {results.length ? (
          results.map((team) => {
            const isSelected = selectedId === team.id;
            const isTaken = excludedId === team.id;
            const colors = getTeamColors(team);

            return (
              <button
                key={team.id}
                type="button"
                aria-pressed={isSelected}
                disabled={isTaken}
                onClick={() => onSelect(team.id)}
                className={`group relative overflow-hidden rounded-md border px-4 py-3 text-left transition ${
                  isSelected
                    ? "border-orange-300 bg-neutral-900 text-white shadow-[0_0_0_2px_rgba(251,146,60,0.35),0_10px_28px_rgba(249,115,22,0.18)]"
                    : isTaken
                      ? "cursor-not-allowed border-white/5 bg-neutral-900 text-neutral-600"
                      : "border-white/10 bg-neutral-900 text-white hover:border-orange-300/70 hover:bg-neutral-800"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-1.5 transition-all group-hover:w-2 ${isTaken ? "opacity-30" : ""}`}
                  style={{ background: `linear-gradient(180deg, ${colors.primary} 0 55%, ${colors.secondary} 55% 100%)` }}
                />
                <span className="block pl-2 text-xs font-black uppercase tracking-[0.14em] text-current/75">{team.season}</span>
                <span className="mt-1 block pl-2 text-sm font-black leading-5">{team.franchise}</span>
                {isTaken ? (
                  <span className="mt-1 block pl-2 text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500">
                    Picked on the other side
                  </span>
                ) : isSelected ? (
                  <span className="mt-1 block pl-2 text-[10px] font-black uppercase tracking-[0.14em] text-orange-300">
                    In the matchup
                  </span>
                ) : null}
              </button>
            );
          })
        ) : (
          <div className="rounded-md border border-dashed border-white/15 bg-neutral-900 p-6 text-center text-sm font-semibold text-neutral-300 sm:col-span-2">
            No teams found.
          </div>
        )}
        {hiddenCount > 0 ? (
          <div className="rounded-md border border-dashed border-white/15 bg-neutral-900 p-3 text-center text-xs font-semibold text-neutral-400 sm:col-span-2">
            +{hiddenCount} more — search a team or pick an era to narrow it down.
          </div>
        ) : null}
      </div>
    </div>
  );
}
