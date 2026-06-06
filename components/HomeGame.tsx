"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Dices, History, Loader2, X } from "lucide-react";
import { getTeamColors } from "@/lib/teamColors";
import type { SimulatedGame, SimulatedSeries, Team } from "@/types/simulation";

const activeRuleset = "modern";
const spinDuration = 5000;
const itemPitch = 94;
const targetOffset = 62;
const historyStorageKey = "timeout-round-history";
const historyLimit = 30;

type WheelState = {
  teams: Team[];
  targetIndex: number;
};

type RoundHistoryEntry = {
  id: string;
  playedAt: string;
  userTeam: string;
  opponentTeam: string;
  userScore: number;
  opponentScore: number;
  userWon: boolean;
  resultUrl: string;
};

type SimulationPayload = {
  simulationId: string;
  result: SimulatedGame | SimulatedSeries;
};

export function HomeGame({ teams }: { teams: Team[] }) {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [choices, setChoices] = useState<Team[]>([]);
  const [wheels, setWheels] = useState<WheelState[]>([]);
  const [enemy, setEnemy] = useState<Team | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<RoundHistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const selected = choices.find((team) => team.id === selectedId) ?? null;
  const fallbackWheels = useMemo(
    () => [buildPreviewWheel(teams), buildPreviewWheel(teams), buildPreviewWheel(teams)],
    [teams],
  );

  useEffect(() => {
    setHistory(readRoundHistory());
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startNewRound() {
    setError("");
    setIsSpinning(false);
    setSelectedId("");
    setChoices([]);
    setWheels([buildPreviewWheel(teams), buildPreviewWheel(teams), buildPreviewWheel(teams)]);
    setEnemy(drawTeams(teams, 1)[0]);
  }

  function spinWheels() {
    const pool = enemy ? teams.filter((team) => team.id !== enemy.id) : teams;
    const nextChoices = drawTeams(pool, 3);
    const nextWheels = nextChoices.map((choice, index) => buildWheelForTarget(pool, choice, index));

    setError("");
    setSelectedId("");
    setChoices([]);
    setWheels(nextWheels);
    setIsSpinning(true);

    window.setTimeout(() => {
      setChoices(nextChoices);
      setIsSpinning(false);
    }, spinDuration + 140);
  }

  async function simulateRound() {
    if (!selected || !enemy) {
      setError("Pick one of your three teams first.");
      return;
    }

    setIsSimulating(true);
    setError("");
    const response = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamAId: selected.id,
        teamBId: enemy.id,
        mode: "single_game",
        ruleset: activeRuleset,
      }),
    });
    const payload = (await response.json()) as SimulationPayload & { error?: string };
    setIsSimulating(false);

    if (!response.ok) {
      setError(payload.error ?? "Round failed.");
      return;
    }

    const nextHistory = saveRoundHistory(selected, enemy, payload);
    setHistory(nextHistory);
    router.push(`/result/${payload.simulationId}`);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-8 pt-2 sm:px-6 sm:pt-4 lg:px-8">
      <div className="absolute inset-0 halftone opacity-[0.045]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-black/26 via-black/8 to-transparent"
        aria-hidden="true"
      />

      <section className="relative mx-auto max-w-5xl text-center">
        <h1 className="hero-title text-3xl font-black tracking-normal sm:text-4xl">
          Matchups time never gave us.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base font-semibold leading-7 text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
          A challenger appears. Spin three mystery squads and pick the one built to win.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={startNewRound}
            disabled={isSpinning || isSimulating}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-8 text-sm font-black uppercase text-white shadow-[0_10px_30px_rgba(255,107,0,0.28)] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <BasketballIcon className="h-6 w-6" />
            New Round
          </button>
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/20 bg-neutral-950 px-5 text-sm font-black uppercase text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition hover:border-orange-300 hover:bg-neutral-900"
          >
            <History className="h-4 w-4" aria-hidden="true" />
            History
          </button>
        </div>
      </section>

      <section className="relative mx-auto mt-7 grid max-w-7xl items-stretch gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="h-full rounded-md border border-white/18 bg-neutral-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <div className="mb-5 text-center">
            <h2 className="panel-title text-3xl font-black text-white">Pick your squad</h2>
          </div>

          {isSpinning ? (
            <div className="grid gap-3 md:grid-cols-3">
              {(wheels.length ? wheels : fallbackWheels).map((wheel, index) => (
                <ReelColumn key={index} wheel={wheel} index={index} />
              ))}
            </div>
          ) : choices.length ? (
            <div className="grid gap-3 md:grid-cols-3">
              {choices.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => setSelectedId(team.id)}
                  className={`text-left transition ${selectedId === team.id ? "scale-[1.01]" : "hover:-translate-y-1"}`}
                >
                  <TeamCard team={team} selected={selectedId === team.id} />
                </button>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {(wheels.length ? wheels : fallbackWheels).map((_wheel, index) => (
                <IdleSlot key={index} index={index} />
              ))}
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={spinWheels}
              disabled={!enemy || isSpinning || isSimulating}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-black uppercase text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSpinning ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Dices className="h-4 w-4" aria-hidden="true" />}
              Spin
            </button>
            <button
              type="button"
              onClick={simulateRound}
              disabled={!selected || !enemy || isSimulating || isSpinning}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-black uppercase text-white shadow-[0_10px_30px_rgba(255,107,0,0.2)] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-950 disabled:shadow-none"
            >
              {isSimulating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
              Simulate
            </button>
          </div>
        </div>

        <aside className="h-full rounded-md border border-white/18 bg-neutral-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          {enemy ? <OpponentHeader team={enemy} /> : null}
          {enemy ? <TeamCard team={enemy} opponent /> : <EmptyPanel label="New Round sets the matchup." />}
          {error ? <p className="mt-3 text-sm text-orange-300">{error}</p> : null}
        </aside>
      </section>
      <HistoryDialog
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </main>
  );
}

function BasketballIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <clipPath id="newRoundBallClip">
        <circle cx="50" cy="50" r="42" />
      </clipPath>
      <circle cx="50" cy="50" r="42" fill="white" />
      <g clipPath="url(#newRoundBallClip)">
        <path
          d="M15 19L81 85M85 18L19 84"
          stroke="#111827"
          strokeLinecap="square"
          strokeWidth="8.5"
        />
        <path
          d="M2 51c20 3 38-2 51-15 10-10 15-25 13-42"
          fill="none"
          stroke="#111827"
          strokeLinecap="round"
          strokeWidth="8.5"
        />
        <path
          d="M49 106c-2-23 4-40 17-50 10-8 24-10 42-6"
          fill="none"
          stroke="#111827"
          strokeLinecap="round"
          strokeWidth="8.5"
        />
      </g>
      <path
        d="M50 8a42 42 0 1 1 0 84 42 42 0 0 1 0-84Z"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function HistoryDialog({
  history,
  isOpen,
  onClose,
}: {
  history: RoundHistoryEntry[];
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/72 px-4 py-5 sm:items-center"
    >
      <div className="w-full max-w-2xl rounded-md border border-white/15 bg-neutral-950 text-left shadow-[0_28px_90px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 id="history-title" className="panel-title text-lg font-black uppercase tracking-normal text-white">
              History
            </h2>
            <p className="mt-1 text-sm text-neutral-300">Your past rounds on this browser.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close history"
            className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-white transition hover:border-orange-300 hover:bg-white/10"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[64vh] overflow-y-auto p-3 sm:p-4">
          {history.length ? (
            <div className="space-y-3">
              {history.map((round) => (
                <Link
                  key={round.id}
                  href={round.resultUrl}
                  onClick={onClose}
                  className="grid gap-3 rounded-md border border-white/10 bg-neutral-900 p-4 transition hover:border-orange-300 hover:bg-neutral-800 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                >
                  <span
                    className={`inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-black uppercase ${
                      round.userWon ? "bg-emerald-400 text-emerald-950" : "bg-rose-400 text-rose-950"
                    }`}
                  >
                    {round.userWon ? "Win" : "Loss"}
                  </span>
                  <span>
                    <span className="block text-sm font-black text-white">
                      {round.userTeam} vs {round.opponentTeam}
                    </span>
                    <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-300">
                      {formatHistoryDate(round.playedAt)}
                    </span>
                  </span>
                  <span className="text-right text-lg font-black text-white">
                    {round.userScore}-{round.opponentScore}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid min-h-[180px] place-items-center rounded-md border border-dashed border-white/15 bg-neutral-900 p-6 text-center">
              <div>
                <div className="text-base font-black text-white">No rounds yet</div>
                <p className="mt-2 text-sm leading-6 text-neutral-300">Spin, pick a squad, and simulate to start building your History.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TeamCard({
  team,
  selected,
  opponent,
}: {
  team: Team;
  selected?: boolean;
  opponent?: boolean;
}) {
  const colors = getTeamColors(team);
  const style = {
    "--team-primary": colors.primary,
    "--team-secondary": colors.secondary,
    "--team-accent": colors.accent,
  } as CSSProperties;

  return (
    <div
      style={style}
      className={`team-card ${opponent ? "min-h-[220px]" : "h-full"} rounded-md border p-4 ${
        selected
          ? "border-orange-300 shadow-[0_0_0_2px_rgba(251,146,60,0.38),0_18px_40px_rgba(0,0,0,0.28)]"
          : opponent
            ? "border-white/20"
            : "border-slate-700"
      }`}
    >
      <div className="flex min-h-[170px] flex-col justify-between">
        <TeamMark team={team} />
        <div>
          <div className="text-xs font-black uppercase tracking-[0.16em] text-white/85">{team.season}</div>
          <div className="mt-2 text-2xl font-black leading-7 text-white">{team.franchise}</div>
        </div>
      </div>
    </div>
  );
}

function ReelColumn({ wheel, index }: { wheel: WheelState; index: number }) {
  return (
    <div className="relative h-[230px] overflow-hidden rounded-md border border-slate-700 bg-neutral-950">
      <div className="wheel-arrow" aria-hidden="true">
        <span />
      </div>
      <div className="pointer-events-none absolute inset-x-3 top-1/2 z-10 h-[86px] -translate-y-1/2 rounded-md ring-2 ring-white/20 shadow-[0_0_26px_rgba(255,255,255,0.08)]" />
      <div
        className="wheel-spin reel-window space-y-3 p-3"
        style={
          {
            "--wheel-distance": `${Math.max(wheel.targetIndex * itemPitch - targetOffset, 0)}px`,
            "--wheel-duration": `${4.8 + index * 0.16}s`,
          } as CSSProperties
        }
      >
        {wheel.teams.map((team, teamIndex) => (
          <WheelTeam key={`${team.id}-${teamIndex}`} team={team} />
        ))}
      </div>
    </div>
  );
}

function WheelTeam({ team }: { team: Team }) {
  const colors = getTeamColors(team);
  return (
    <div
      className="flex h-[82px] items-center rounded-md border border-white/15 px-3 shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0 52%, ${colors.secondary} 52% 100%)`,
        boxShadow: `inset 5px 0 0 ${colors.accent}, 0 10px 24px rgba(0,0,0,0.18)`,
      }}
    >
      <div>
        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white/85">{team.season}</div>
        <div className="mt-1 text-base font-black leading-5 text-white">{team.franchise}</div>
      </div>
    </div>
  );
}

function OpponentHeader({ team }: { team: Team }) {
  return (
    <div className="mb-5 text-center">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">Can you beat the...</div>
      <h2 className="panel-title mt-2 text-3xl font-black leading-8 text-white">{team.franchise}</h2>
    </div>
  );
}

function TeamMark({ team }: { team: Team }) {
  const initials = getTeamInitials(team.franchise);

  return (
    <div className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-white/20 text-sm font-black tracking-normal text-white shadow-[0_12px_28px_rgba(0,0,0,0.24)]">
      {initials}
    </div>
  );
}

function IdleSlot({ index }: { index: number }) {
  return (
    <div className="slot-idle grid h-[230px] place-items-center rounded-md border border-slate-700 bg-slate-950 p-5 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/8 text-2xl font-black text-white/85">
          {index + 1}
        </div>
        <div className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-neutral-300">Spin to reveal</div>
      </div>
    </div>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return (
    <div className="grid min-h-[260px] place-items-center rounded-md border border-dashed border-slate-700 bg-neutral-900 p-6 text-center text-sm text-neutral-300">
      {label}
    </div>
  );
}

function drawTeams(pool: Team[], count: number) {
  const copy = [...pool];
  const drawn: Team[] = [];

  while (drawn.length < count && copy.length) {
    const index = Math.floor(Math.random() * copy.length);
    const [team] = copy.splice(index, 1);
    drawn.push(team);
  }

  return drawn;
}

function buildPreviewWheel(teams: Team[]): WheelState {
  return {
    teams: Array.from({ length: 18 }, (_item, index) => teams[index % teams.length]),
    targetIndex: 2,
  };
}

function getTeamInitials(franchise: string) {
  const stopWords = new Set(["Los", "Angeles", "Golden", "State", "Oklahoma", "City", "San"]);
  const words = franchise.split(" ").filter((word) => !stopWords.has(word));
  const source = words.length ? words : franchise.split(" ");
  return source
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function buildWheelForTarget(pool: Team[], target: Team, wheelIndex: number): WheelState {
  const targetIndex = 17 + wheelIndex;
  const wheel = Array.from({ length: targetIndex + 5 }, () => pool[Math.floor(Math.random() * pool.length)]);
  wheel[targetIndex] = target;

  return {
    teams: wheel,
    targetIndex,
  };
}

function readRoundHistory() {
  try {
    const raw = window.localStorage.getItem(historyStorageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isRoundHistoryEntry).slice(0, historyLimit);
  } catch {
    return [];
  }
}

function saveRoundHistory(userTeam: Team, opponentTeam: Team, payload: SimulationPayload) {
  const result = payload.result;
  const game = result.type === "single_game" ? result : result.decidingGame;
  const userIsTeamA = result.teamA.id === userTeam.id;
  const entry: RoundHistoryEntry = {
    id: payload.simulationId,
    playedAt: new Date().toISOString(),
    userTeam: `${userTeam.season} ${userTeam.franchise}`,
    opponentTeam: `${opponentTeam.season} ${opponentTeam.franchise}`,
    userScore: userIsTeamA ? game.teamAScore : game.teamBScore,
    opponentScore: userIsTeamA ? game.teamBScore : game.teamAScore,
    userWon: result.winnerTeamId === userTeam.id,
    resultUrl: `/result/${payload.simulationId}`,
  };
  const nextHistory = [entry, ...readRoundHistory().filter((round) => round.id !== entry.id)].slice(0, historyLimit);

  try {
    window.localStorage.setItem(historyStorageKey, JSON.stringify(nextHistory));
  } catch {
    return nextHistory;
  }

  return nextHistory;
}

function isRoundHistoryEntry(value: unknown): value is RoundHistoryEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<RoundHistoryEntry>;
  return (
    typeof entry.id === "string" &&
    typeof entry.playedAt === "string" &&
    typeof entry.userTeam === "string" &&
    typeof entry.opponentTeam === "string" &&
    typeof entry.userScore === "number" &&
    typeof entry.opponentScore === "number" &&
    typeof entry.userWon === "boolean" &&
    typeof entry.resultUrl === "string"
  );
}

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
