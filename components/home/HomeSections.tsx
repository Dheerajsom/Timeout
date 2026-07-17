import Link from "next/link";
import { ArrowRight, Dices, Play, ShieldCheck, Swords } from "lucide-react";

const steps = [
  {
    icon: Dices,
    title: "Spin",
    copy: "Three squads are pulled from 45 years of NBA seasons — with the opponent already on the board.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    copy: "No ratings, no rosters. Back the squad your basketball knowledge says beats them.",
  },
  {
    icon: Swords,
    title: "With Stats",
    copy: "Want the scouting files? Flip the mode for records, stars and a sealed opponent.",
  },
  {
    icon: Play,
    title: "Simulate",
    copy: "A full game plays out possession by possession. Did you call it?",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="mx-auto mt-14 w-full max-w-6xl scroll-mt-24">
      <span className="eyebrow text-orange-300">How Timeout works</span>
      <h2 id="how-it-works-title" className="mt-2 font-display text-2xl font-bold uppercase leading-8 text-white sm:text-3xl">
        Four calls to a final score
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="rounded-lg border border-white/10 bg-panel/80 p-4">
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-orange-500/15 text-orange-300">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="font-display text-lg font-bold tabular-nums text-white/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold uppercase text-white">{step.title}</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-muted">{step.copy}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function CrossEraBand({ teamCount, seasonSpan }: { teamCount: number; seasonSpan: string }) {
  return (
    <section aria-labelledby="cross-era-title" className="mx-auto mt-14 w-full max-w-6xl">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-panel via-raised to-panel px-5 py-8 text-center sm:px-10">
        <span className="eyebrow justify-center text-orange-300">Built for cross-era debates</span>
        <h2 id="cross-era-title" className="mx-auto mt-2 max-w-2xl font-display text-2xl font-bold uppercase leading-8 text-white sm:text-3xl sm:leading-9">
          Showtime vs. pace-and-space. The 90s Bulls vs. anyone.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-muted sm:text-base">
          Every squad is rated on the same scale — offense, defense, spacing, physicality, star
          power — so a {seasonSpan} matchup is an argument you can actually settle. Want to pick
          both sides yourself?
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/matchup"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 text-sm font-black uppercase tracking-wide text-white transition hover:border-orange-400/60 hover:bg-white/10"
          >
            <Swords className="h-4 w-4" aria-hidden="true" />
            Build a custom matchup
          </Link>
          <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">
            {teamCount.toLocaleString()} team-seasons in the archive
          </span>
        </div>
      </div>
    </section>
  );
}

export type EraSummary = {
  label: string;
  teamCount: number;
  marquee: string[];
};

export function EraArchive({ eras }: { eras: EraSummary[] }) {
  return (
    <section aria-labelledby="era-archive-title" className="mx-auto mt-14 w-full max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow text-orange-300">Era archive</span>
          <h2 id="era-archive-title" className="mt-2 font-display text-2xl font-bold uppercase leading-8 text-white sm:text-3xl">
            Five decades on file
          </h2>
        </div>
        <Link
          href="/teams"
          className="inline-flex min-h-11 items-center gap-1.5 px-2 text-xs font-black uppercase tracking-[0.14em] text-muted transition hover:text-white"
        >
          Browse all teams
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {eras.map((era) => (
          <Link
            key={era.label}
            href="/teams"
            className="group rounded-lg border border-white/10 bg-panel/80 p-4 transition hover:border-orange-400/50 hover:bg-raised"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-display text-xl font-bold uppercase text-white">{era.label}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40 transition group-hover:text-orange-300">
                {era.teamCount} squads
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-xs font-semibold leading-5 text-muted">
              {era.marquee.map((team) => (
                <li key={team} className="truncate">{team}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </section>
  );
}
