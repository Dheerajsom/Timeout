"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleHelp, Play, RotateCcw } from "lucide-react";
import { drawTeams, getTeamInitials, type RoundTeam } from "@/lib/round";
import { getTeamColors } from "@/lib/teamColors";
import { saveRoundHistory, type SimulationPayload } from "@/lib/roundHistory";
import { MysteryCard } from "@/components/round/MysteryCard";
import { ProgressTracker } from "@/components/round/ProgressTracker";
import { ResultPanel } from "@/components/round/ResultPanel";
import { SquadCard } from "@/components/round/SquadCard";
import { VersusPanel } from "@/components/round/VersusPanel";
import type { SimulatedGame } from "@/types/simulation";

type Phase = "ready" | "spinning" | "choose" | "versus" | "result";

/**
 * "normal" is the knowledge game: no ratings, no rosters, and the opponent is
 * on the board from the jump. "stats" is the scouting-file variant with the
 * sealed opponent and full rating strips.
 */
type GameMode = "normal" | "stats";

const activeRuleset = "modern";

/** Fired after a round is saved so the Recent Matchups section can refresh. */
export const historyUpdatedEvent = "timeout:history-updated";

const phaseHeadline: Record<GameMode, Record<Phase, { title: string; sub: string }>> = {
  normal: {
    ready: {
      title: "Beat the team on the board.",
      sub: "Spin three squads and back the one your basketball knowledge says wins. No ratings, no rosters — just names.",
    },
    spinning: {
      title: "Scouting the eras…",
      sub: "Pulling three squads from the archive.",
    },
    choose: {
      title: "Who beats them?",
      sub: "The opponent is waiting below. Trust the squad you believe takes them down.",
    },
    versus: {
      title: "The matchup is set.",
      sub: "No takebacks after the ball goes up.",
    },
    result: {
      title: "",
      sub: "",
    },
  },
  stats: {
    ready: {
      title: "Spin three mystery squads.",
      sub: "Three teams, three eras, one sealed opponent. Trust the squad built to win.",
    },
    spinning: {
      title: "Scouting the eras…",
      sub: "Pulling three squads from the archive.",
    },
    choose: {
      title: "Trust one squad.",
      sub: "One of these three carries your call. The opponent stays sealed until you commit.",
    },
    versus: {
      title: "The matchup is set.",
      sub: "No takebacks after the ball goes up.",
    },
    result: {
      title: "",
      sub: "",
    },
  },
};

export function RoundStage({ teams }: { teams: RoundTeam[] }) {
  const [gameMode, setGameMode] = useState<GameMode>("normal");
  const [phase, setPhase] = useState<Phase>("ready");
  const [slots, setSlots] = useState<RoundTeam[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [shuffleSamples, setShuffleSamples] = useState<string[][]>([]);
  const [opponent, setOpponent] = useState<RoundTeam | null>(null);
  const [chosenId, setChosenId] = useState("");
  const [locking, setLocking] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [runningBack, setRunningBack] = useState(false);
  const [result, setResult] = useState<SimulatedGame | null>(null);
  const [simulationId, setSimulationId] = useState("");
  const [error, setError] = useState("");
  const timers = useRef<number[]>([]);

  const chosen = slots.find((team) => team.id === chosenId) ?? null;

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) window.clearTimeout(timer);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  function schedule(callback: () => void, delay: number) {
    timers.current.push(window.setTimeout(callback, delay));
  }

  function changeMode(nextMode: GameMode) {
    if (nextMode === gameMode || simulating || runningBack) {
      return;
    }

    clearTimers();
    setGameMode(nextMode);
    setPhase("ready");
    setSlots([]);
    setOpponent(null);
    setRevealedCount(0);
    setChosenId("");
    setLocking(false);
    setResult(null);
    setSimulationId("");
    setError("");
  }

  function startRound() {
    clearTimers();
    const [nextOpponent, ...picks] = drawTeams(teams, 4);

    setOpponent(nextOpponent);
    setSlots(picks);
    setRevealedCount(0);
    setChosenId("");
    setLocking(false);
    setResult(null);
    setSimulationId("");
    setError("");
    setShuffleSamples(picks.map(() => buildShuffleSample(teams)));
    setPhase("spinning");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = reduceMotion ? [150, 300, 450] : [1000, 1650, 2300];
    reveals.forEach((delay, index) => {
      schedule(() => setRevealedCount(index + 1), delay);
    });
    schedule(() => setPhase("choose"), reveals[reveals.length - 1] + 350);
  }

  function trustTeam(team: RoundTeam) {
    if (locking || phase !== "choose") {
      return;
    }

    setChosenId(team.id);
    setLocking(true);
    schedule(() => {
      setLocking(false);
      setPhase("versus");
    }, 750);
  }

  async function simulate(asRunItBack: boolean) {
    if (!chosen || !opponent) {
      return;
    }

    setError("");
    if (asRunItBack) {
      setRunningBack(true);
    } else {
      setSimulating(true);
    }

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamAId: chosen.id,
          teamBId: opponent.id,
          mode: "single_game",
          ruleset: activeRuleset,
        }),
      });
      const payload = (await response.json()) as SimulationPayload & { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "The simulation failed. Try again.");
        return;
      }

      setResult(payload.result as SimulatedGame);
      setSimulationId(payload.simulationId);
      setPhase("result");
      saveRoundHistory(chosen, opponent, payload);
      window.dispatchEvent(new CustomEvent(historyUpdatedEvent));
    } catch {
      setError("The simulation failed. Check your connection and try again.");
    } finally {
      setSimulating(false);
      setRunningBack(false);
    }
  }

  const showStats = gameMode === "stats";
  // Normal mode has no reveal step — the opponent is visible from the start.
  const progressSteps = showStats
    ? ["Spin", "Choose", "Reveal", "Simulate", "Result"]
    : ["Spin", "Choose", "Simulate", "Result"];
  const progressIndex =
    phase === "ready" || phase === "spinning"
      ? 0
      : phase === "choose"
        ? 1
        : phase === "versus"
          ? showStats && !simulating
            ? 2
            : progressSteps.length - 2
          : progressSteps.length - 1;

  const headline = phaseHeadline[gameMode][phase];
  const showMobileBar = phase === "versus" || phase === "result";

  // Reserve space at the end of the document (footer included) while the
  // fixed bottom action bar is mounted, so it never covers the footer links.
  useEffect(() => {
    if (!showMobileBar) {
      return;
    }
    document.body.classList.add("has-mobile-action-bar");
    return () => document.body.classList.remove("has-mobile-action-bar");
  }, [showMobileBar]);

  return (
    <section aria-label="Timeout round" className="relative mx-auto w-full max-w-6xl">
      <div className="overflow-hidden rounded-xl border border-white/12 bg-panel/90 shadow-stage backdrop-blur-sm">
        <div aria-hidden="true" className="h-1 w-full bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600" />

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-4 py-3 sm:px-6">
          <ModeToggle mode={gameMode} disabled={simulating || runningBack || locking} onChange={changeMode} />
          <ProgressTracker current={progressIndex} steps={progressSteps} />
          {phase !== "ready" ? (
            <button
              type="button"
              onClick={startRound}
              disabled={simulating || runningBack || phase === "spinning"}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/12 px-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-muted transition hover:border-orange-400/60 hover:text-white disabled:opacity-40"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              New round
            </button>
          ) : (
            <span className="w-[104px]" aria-hidden="true" />
          )}
        </div>

        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <p aria-live="polite" className="sr-only">
            {phase === "spinning"
              ? "Spinning three mystery squads."
              : phase === "choose"
                ? "Three squads revealed. Choose the team you trust."
                : phase === "versus"
                  ? "Opponent revealed. Ready to simulate."
                  : phase === "result"
                    ? "Simulation complete."
                    : ""}
          </p>

          {headline.title ? (
            <div className="mb-5 text-center">
              <h1 className="hero-title font-display text-3xl font-bold uppercase leading-9 sm:text-4xl sm:leading-10">
                {headline.title}
              </h1>
              <p className="mx-auto mt-1.5 max-w-xl text-sm font-semibold leading-6 text-muted sm:text-base">
                {headline.sub}
              </p>
            </div>
          ) : null}

          {phase === "ready" || phase === "spinning" ? (
            <>
              {phase === "ready" ? (
                <div className="mb-6 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={startRound}
                    className="inline-flex h-[52px] w-full max-w-sm items-center justify-center gap-2 rounded-md bg-orange-500 px-10 text-base font-black uppercase tracking-wide text-white shadow-cta transition hover:bg-orange-400"
                  >
                    <Play className="h-5 w-5" aria-hidden="true" />
                    Start Round
                  </button>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-muted transition hover:text-white"
                  >
                    <CircleHelp className="h-3.5 w-3.5" aria-hidden="true" />
                    How it works
                  </a>
                </div>
              ) : null}

              <div className="grid gap-3 md:grid-cols-3">
                {[0, 1, 2].map((index) =>
                  phase === "spinning" && revealedCount > index && slots[index] ? (
                    <SquadCard key={slots[index].id} team={slots[index]} showStats={showStats} />
                  ) : (
                    <MysteryCard
                      key={index}
                      index={index}
                      spinning={phase === "spinning"}
                      sample={shuffleSamples[index] ?? []}
                    />
                  ),
                )}
              </div>

              {phase === "spinning" ? (
                showStats ? (
                  <OpponentTicker state="sealed" />
                ) : opponent ? (
                  <OpponentBoard team={opponent} />
                ) : null
              ) : null}
            </>
          ) : null}

          {phase === "choose" ? (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                {slots.map((team, index) => (
                  <SquadCard
                    key={team.id}
                    team={team}
                    showStats={showStats}
                    revealDelay={index * 90}
                    selected={chosenId === team.id}
                    dimmed={Boolean(chosenId) && chosenId !== team.id}
                    disabled={locking}
                    onTrust={trustTeam}
                  />
                ))}
              </div>
              {showStats ? (
                <OpponentTicker state={locking ? "unsealing" : "sealed"} />
              ) : opponent ? (
                <OpponentBoard team={opponent} />
              ) : null}
            </>
          ) : null}

          {phase === "versus" && chosen && opponent ? (
            <VersusPanel
              user={chosen}
              opponent={opponent}
              showStats={showStats}
              simulating={simulating}
              error={error}
              onSimulate={() => simulate(false)}
              onChangePick={() => {
                setChosenId("");
                setError("");
                setPhase("choose");
              }}
              onNewRound={startRound}
            />
          ) : null}

          {phase === "result" && chosen && opponent && result ? (
            <ResultPanel
              user={chosen}
              opponent={opponent}
              result={result}
              simulationId={simulationId}
              runningBack={runningBack}
              onRunItBack={() => simulate(true)}
              onNewRound={startRound}
            />
          ) : null}
        </div>
      </div>

      {showMobileBar ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/12 bg-ink/92 px-4 py-3 backdrop-blur sm:hidden">
          {phase === "versus" ? (
            <button
              type="button"
              onClick={() => simulate(false)}
              disabled={simulating}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-orange-500 text-sm font-black uppercase tracking-wide text-white shadow-cta transition disabled:opacity-70"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              {simulating ? "Calling the game…" : "Run Simulation"}
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => simulate(true)}
                disabled={runningBack}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-orange-500 text-sm font-black uppercase tracking-wide text-white transition disabled:opacity-70"
              >
                Run it back
              </button>
              <button
                type="button"
                onClick={startRound}
                disabled={runningBack}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 text-sm font-black uppercase tracking-wide text-white transition disabled:opacity-50"
              >
                New round
              </button>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

/** Segmented Normal / With Stats switch shown in the stage header. */
function ModeToggle({
  mode,
  disabled,
  onChange,
}: {
  mode: GameMode;
  disabled: boolean;
  onChange: (mode: GameMode) => void;
}) {
  const options: { value: GameMode; label: string }[] = [
    { value: "normal", label: "Normal" },
    { value: "stats", label: "With Stats" },
  ];

  return (
    <div
      role="group"
      aria-label="Game mode"
      className="inline-flex items-center gap-0.5 rounded-md border border-white/12 bg-ink/60 p-0.5"
    >
      {options.map((option) => {
        const isActive = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            aria-pressed={isActive}
            className={`inline-flex h-7 items-center whitespace-nowrap rounded px-2.5 text-[10px] font-black uppercase tracking-[0.12em] transition disabled:opacity-50 sm:text-[11px] ${
              isActive ? "bg-orange-500 text-white shadow-cta" : "text-muted hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Normal-mode opponent banner: the team to beat, names only — no ratings. */
function OpponentBoard({ team }: { team: RoundTeam }) {
  const colors = getTeamColors(team);

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-orange-400/30 bg-ink/60">
      <div
        aria-hidden="true"
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${colors.primary} 0 62%, ${colors.secondary} 62% 100%)` }}
      />
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-black text-white"
          style={{ background: colors.primary, boxShadow: `inset 0 0 0 2px ${colors.secondary}` }}
        >
          {getTeamInitials(team.franchise)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-300">
            The opponent &middot; {team.season} season
          </div>
          <div className="truncate font-display text-xl font-bold uppercase leading-7 text-white sm:text-2xl">
            {team.franchise}
          </div>
        </div>
        <span className="hidden rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/70 sm:inline-flex">
          Beat this team
        </span>
      </div>
    </div>
  );
}

/** Slim banner that keeps the hidden opponent present in the player's mind. */
function OpponentTicker({ state }: { state: "sealed" | "unsealing" }) {
  return (
    <div className="mt-4 flex items-center justify-center gap-2.5 rounded-md border border-white/10 bg-ink/60 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em]">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${state === "unsealing" ? "animate-ping bg-orange-400" : "bg-orange-400/70 animate-pulse"}`}
      />
      <span className="text-white/70">
        {state === "unsealing" ? "Unsealing opponent…" : "Opponent — sealed until you commit"}
      </span>
    </div>
  );
}

function buildShuffleSample(teams: RoundTeam[], count = 12) {
  const sample: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const team = teams[Math.floor(Math.random() * teams.length)];
    sample.push(`${team.season} ${team.franchise}`);
  }
  return sample;
}
