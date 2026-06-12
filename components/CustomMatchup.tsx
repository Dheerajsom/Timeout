"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2, Search, Swords } from "lucide-react";
import { modeOptions } from "@/lib/simulation/constants";
import { saveRoundHistory, type SimulationPayload } from "@/lib/roundHistory";
import type { SimulationMode, Team } from "@/types/simulation";

const activeRuleset = "modern";

export function CustomMatchup({ teams }: { teams: Team[] }) {
  const router = useRouter();
  const [teamAId, setTeamAId] = useState("");
  const [teamBId, setTeamBId] = useState("");
  const [mode, setMode] = useState<SimulationMode>("single_game");
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState("");

  const teamA = teams.find((team) => team.id === teamAId) ?? null;
  const teamB = teams.find((team) => team.id === teamBId) ?? null;
  const sameTeam = Boolean(teamA && teamB && teamA.id === teamB.id);

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
    <main className="relative min-h-screen overflow-hidden px-4 pb-10 pt-1 sm:px-6 sm:pb-8 sm:pt-4 lg:px-8">
      <section className="relative mx-auto max-w-5xl text-center">
        <h1 className="hero-title text-[2rem] font-black leading-tight tracking-normal sm:text-4xl">
          Build your own matchup.
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-base font-semibold leading-7 text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.55)] sm:mt-3">
          No wheels, no luck. Pick any two squads from any era and settle the debate.
        </p>
      </section>

      <section className="relative mx-auto mt-5 grid max-w-7xl items-stretch gap-4 sm:mt-7 sm:gap-5 lg:grid-cols-2">
        <SquadPicker
          title="Your squad"
          teams={teams}
          selectedId={teamAId}
          excludedId={teamBId}
          onSelect={(id) => {
            setTeamAId(id);
            setError("");
          }}
        />
        <SquadPicker
          title="Opponent squad"
          teams={teams}
          selectedId={teamBId}
          excludedId={teamAId}
          onSelect={(id) => {
            setTeamBId(id);
            setError("");
          }}
        />
      </section>

      <section className="relative mx-auto mt-4 max-w-7xl rounded-md border border-white/18 bg-neutral-950 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:mt-5 sm:p-5">
        <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div className="flex min-h-12 items-center justify-center rounded-md border border-white/10 bg-neutral-900 px-4 py-2 text-center sm:justify-start sm:text-left">
            {teamA || teamB ? (
              <span className="text-sm font-black text-white">
                <span className={teamA ? "" : "text-neutral-500"}>
                  {teamA ? `${teamA.season} ${teamA.franchise}` : "Pick your squad"}
                </span>
                <span className="mx-2 text-orange-300">vs</span>
                <span className={teamB ? "" : "text-neutral-500"}>
                  {teamB ? `${teamB.season} ${teamB.franchise}` : "Pick the opponent"}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400">
                <Swords className="h-4 w-4" aria-hidden="true" />
                Pick two squads to set the matchup.
              </span>
            )}
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Mode</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as SimulationMode)}
              className="h-12 w-full rounded-md border border-white/15 bg-neutral-900 px-3 text-sm font-semibold text-white outline-none transition focus:border-orange-300 sm:w-44"
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
            disabled={!teamA || !teamB || sameTeam || isSimulating}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-6 text-sm font-black uppercase text-white shadow-[0_10px_30px_rgba(255,107,0,0.2)] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500 disabled:shadow-none sm:w-auto"
          >
            {isSimulating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
            Simulate
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-orange-300">{error}</p> : null}
      </section>
    </main>
  );
}

function SquadPicker({
  title,
  teams,
  selectedId,
  excludedId,
  onSelect,
}: {
  title: string;
  teams: Team[];
  selectedId: string;
  excludedId: string;
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const results = query
    ? teams.filter((team) => `${team.season} ${team.franchise}`.toLowerCase().includes(query))
    : teams;

  return (
    <div className="rounded-md border border-white/18 bg-neutral-950 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:p-5">
      <div className="mb-4 text-center">
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

      <div className="mt-4 grid max-h-[360px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {results.length ? (
          results.map((team) => {
            const isSelected = selectedId === team.id;
            const isTaken = excludedId === team.id;

            return (
              <button
                key={team.id}
                type="button"
                aria-pressed={isSelected}
                disabled={isTaken}
                onClick={() => onSelect(team.id)}
                className={`rounded-md border px-4 py-3 text-left transition ${
                  isSelected
                    ? "border-orange-300 bg-orange-500 text-white shadow-[0_10px_28px_rgba(249,115,22,0.18)]"
                    : isTaken
                      ? "cursor-not-allowed border-white/5 bg-neutral-900 text-neutral-600"
                      : "border-white/10 bg-neutral-900 text-white hover:border-orange-300 hover:bg-neutral-800"
                }`}
              >
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-current/75">{team.season}</span>
                <span className="mt-1 block text-sm font-black leading-5">{team.franchise}</span>
                {isTaken ? (
                  <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500">
                    Picked on the other side
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
      </div>
    </div>
  );
}
