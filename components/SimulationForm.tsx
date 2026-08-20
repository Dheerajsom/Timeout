"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dices, Loader2, RotateCcw } from "lucide-react";
import type { SimulationMode } from "@/types/simulation";
import { modeOptions } from "@/lib/simulation/constants";
import type { TeamSummary } from "@/lib/teamSummary";
import { TeamSelect } from "./TeamSelect";

export function SimulationForm({
  teams,
  initialTeamAId,
  initialTeamBId,
}: {
  teams: TeamSummary[];
  initialTeamAId?: string;
  initialTeamBId?: string;
}) {
  const router = useRouter();
  const [teamAId, setTeamAId] = useState(initialTeamAId ?? teams[0]?.id ?? "");
  const [teamBId, setTeamBId] = useState(initialTeamBId ?? teams[1]?.id ?? "");
  const [mode, setMode] = useState<SimulationMode>("single_game");
  const [seed, setSeed] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sameTeam = teamAId === teamBId;
  const selectedTeams = useMemo(
    () => ({
      teamA: teams.find((team) => team.id === teamAId),
      teamB: teams.find((team) => team.id === teamBId),
    }),
    [teamAId, teamBId, teams],
  );

  async function runSimulation() {
    setError("");
    if (sameTeam) {
      setError("Pick two different teams.");
      return;
    }

    setIsLoading(true);

    let payload: { simulationId?: string; error?: string };
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamAId,
          teamBId,
          mode,
          ruleset: "modern",
          seed: seed.trim() || undefined,
        }),
      });
      payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Simulation failed.");
        return;
      }
    } catch {
      // Without this the request rejects unhandled and the spinner never stops.
      setError("Simulation failed. Check your connection and try again.");
      return;
    } finally {
      setIsLoading(false);
    }

    router.push(`/result/${payload.simulationId}`);
  }

  return (
    <div className="rounded-md border border-white/10 bg-panel/95 p-4 shadow-glow sm:p-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <TeamSelect label="Team A" teams={teams} value={teamAId} onChange={setTeamAId} />
        <TeamSelect label="Team B" teams={teams} value={teamBId} onChange={setTeamBId} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Mode
          </span>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as SimulationMode)}
            className="h-11 w-full rounded-md border border-white/10 bg-ink px-3 text-sm outline-none focus:border-teal"
          >
            {modeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Seed
          </span>
          <input
            value={seed}
            onChange={(event) => setSeed(event.target.value)}
            placeholder="Optional replay seed"
            className="h-11 w-full rounded-md border border-white/10 bg-ink px-3 text-sm outline-none placeholder:text-muted/60 focus:border-teal"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-6 text-sm text-muted">
          {selectedTeams.teamA && selectedTeams.teamB ? (
            <span>
              {selectedTeams.teamA.season} vs {selectedTeams.teamB.season}
            </span>
          ) : null}
          {error ? <span className="ml-0 block text-signal sm:ml-3 sm:inline">{error}</span> : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSeed("")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 text-muted transition hover:border-white/25 hover:text-white"
            title="Clear seed"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={runSimulation}
            disabled={isLoading || sameTeam}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-ink transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Dices className="h-4 w-4" aria-hidden="true" />}
            Run Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
