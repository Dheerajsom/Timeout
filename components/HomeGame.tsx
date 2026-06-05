"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Dices, Loader2 } from "lucide-react";
import type { Ruleset, Team } from "@/types/simulation";

const rulesets: Ruleset[] = ["neutral", "modern", "physical_90s", "early_2000s", "bubble"];
const spinDuration = 5000;
const itemPitch = 94;
const targetOffset = 62;

type WheelState = {
  teams: Team[];
  targetIndex: number;
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

  const selected = choices.find((team) => team.id === selectedId) ?? null;
  const fallbackWheels = useMemo(
    () => [buildPreviewWheel(teams), buildPreviewWheel(teams), buildPreviewWheel(teams)],
    [teams],
  );

  useEffect(() => {
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
    const ruleset = rulesets[Math.floor(Math.random() * rulesets.length)];
    const response = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamAId: selected.id,
        teamBId: enemy.id,
        mode: "single_game",
        ruleset,
      }),
    });
    const payload = await response.json();
    setIsSimulating(false);

    if (!response.ok) {
      setError(payload.error ?? "Round failed.");
      return;
    }

    router.push(`/result/${payload.simulationId}`);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-8 pt-36 sm:px-6 lg:px-8">
      <div className="absolute inset-0 halftone opacity-25" aria-hidden="true" />
      <div className="absolute left-1/2 top-28 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" aria-hidden="true" />

      <section className="relative mx-auto max-w-5xl text-center">
        <h1 className="text-3xl font-black tracking-normal text-white sm:text-4xl">
          Matchups time never gave us.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-300">
          A challenger appears. Spin three mystery squads and pick the one built to win.
        </p>
        <button
          type="button"
          onClick={startNewRound}
          disabled={isSpinning || isSimulating}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-8 text-sm font-black uppercase text-white shadow-[0_10px_30px_rgba(255,107,0,0.28)] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Dices className="h-4 w-4" aria-hidden="true" />
          New Round
        </button>
      </section>

      <section className="relative mx-auto mt-7 grid max-w-7xl items-start gap-5 lg:grid-cols-[1fr_400px]">
        <div className="rounded-md border border-slate-700 bg-slate-900 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
          <div className="mb-5 text-center">
            <h2 className="text-3xl font-black text-white">Pick your squad</h2>
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

        <aside className="rounded-md border border-slate-700 bg-slate-900 p-5">
          {enemy ? <OpponentHeader team={enemy} /> : null}
          {enemy ? <TeamCard team={enemy} opponent /> : <EmptyPanel label="New Round sets the matchup." />}
          {error ? <p className="mt-3 text-sm text-orange-300">{error}</p> : null}
        </aside>
      </section>
    </main>
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
      className={`team-card h-full rounded-md border p-4 ${
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
          <div className="text-xs font-black uppercase tracking-[0.16em] text-white/72">{team.season}</div>
          <div className="mt-2 text-2xl font-black leading-7 text-white">{team.franchise}</div>
        </div>
      </div>
    </div>
  );
}

function ReelColumn({ wheel, index }: { wheel: WheelState; index: number }) {
  return (
    <div className="relative h-[230px] overflow-hidden rounded-md border border-slate-700 bg-slate-950/80">
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
        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white/70">{team.season}</div>
        <div className="mt-1 text-base font-black leading-5 text-white">{team.franchise}</div>
      </div>
    </div>
  );
}

function OpponentHeader({ team }: { team: Team }) {
  return (
    <div className="mb-5 text-center">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-white/60">Can you beat the...</div>
      <h2 className="mt-2 text-3xl font-black leading-8 text-white">{team.franchise}</h2>
    </div>
  );
}

function TeamMark({ team }: { team: Team }) {
  const initials = getTeamInitials(team.franchise);

  return (
    <div className="grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-white/18 text-sm font-black tracking-normal text-white shadow-[0_12px_28px_rgba(0,0,0,0.24)]">
      {initials}
    </div>
  );
}

function IdleSlot({ index }: { index: number }) {
  return (
    <div className="slot-idle grid h-[230px] place-items-center rounded-md border border-slate-700 bg-slate-950 p-5 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/8 text-2xl font-black text-white/70">
          {index + 1}
        </div>
        <div className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-white/55">Spin to reveal</div>
      </div>
    </div>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return (
    <div className="grid min-h-[260px] place-items-center rounded-md border border-dashed border-slate-700 bg-slate-950/45 p-6 text-center text-sm text-slate-400">
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
    teams: Array.from({ length: 18 }, () => teams[Math.floor(Math.random() * teams.length)]),
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

function getTeamColors(team: Team) {
  const colorsById: Record<string, { primary: string; secondary: string; accent: string }> = {
    "1967-76ers": { primary: "#ed174c", secondary: "#006bb6", accent: "#ffffff" },
    "1972-lakers": { primary: "#552583", secondary: "#fdb927", accent: "#ffffff" },
    "1983-76ers": { primary: "#ed174c", secondary: "#006bb6", accent: "#ffffff" },
    "1986-celtics": { primary: "#007a33", secondary: "#ba9653", accent: "#ffffff" },
    "1993-suns": { primary: "#1d1160", secondary: "#e56020", accent: "#f9ad1b" },
    "1995-magic": { primary: "#0077c0", secondary: "#c4ced4", accent: "#000000" },
    "1996-bulls": { primary: "#ce1141", secondary: "#111111", accent: "#ffffff" },
    "1996-sonics": { primary: "#00653a", secondary: "#ffc200", accent: "#ffffff" },
    "2001-lakers": { primary: "#552583", secondary: "#fdb927", accent: "#ffffff" },
    "2002-kings": { primary: "#5a2d81", secondary: "#63727a", accent: "#ffffff" },
    "2004-pistons": { primary: "#c8102e", secondary: "#1d42ba", accent: "#bec0c2" },
    "2005-suns": { primary: "#1d1160", secondary: "#e56020", accent: "#f9ad1b" },
    "2008-celtics": { primary: "#007a33", secondary: "#ba9653", accent: "#ffffff" },
    "2011-bulls": { primary: "#ce1141", secondary: "#111111", accent: "#ffffff" },
    "2013-heat": { primary: "#98002e", secondary: "#f9a01b", accent: "#111111" },
    "2014-spurs": { primary: "#c4ced4", secondary: "#111111", accent: "#8a8d8f" },
    "2016-cavaliers": { primary: "#6f263d", secondary: "#ffb81c", accent: "#041e42" },
    "2016-thunder": { primary: "#007ac1", secondary: "#ef3b24", accent: "#fdbb30" },
    "2017-warriors": { primary: "#1d428a", secondary: "#ffc72c", accent: "#ffffff" },
    "2018-rockets": { primary: "#ce1141", secondary: "#111111", accent: "#c4ced4" },
    "2019-raptors": { primary: "#ce1141", secondary: "#111111", accent: "#a1a1a4" },
    "2020-lakers": { primary: "#552583", secondary: "#fdb927", accent: "#ffffff" },
    "2021-nets": { primary: "#111111", secondary: "#f5f5f5", accent: "#777777" },
    "2024-celtics": { primary: "#007a33", secondary: "#ba9653", accent: "#ffffff" },
  };

  return colorsById[team.id] ?? { primary: "#f97316", secondary: "#4f46e5", accent: "#ffffff" };
}
