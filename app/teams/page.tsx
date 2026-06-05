import Link from "next/link";
import { teams } from "@/lib/teams";

export default function TeamsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-normal text-white">Historical Teams</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          The first pool uses hand-tuned ratings instead of live data. Each team has rotation players,
          style notes, and simulation attributes from 0 to 100.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teams.map((team) => (
          <Link key={team.id} href={`/teams/${team.id}`} className="rounded-md border border-white/10 bg-panel p-4 transition hover:border-teal/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-muted">{team.season}</div>
                <h2 className="mt-2 text-xl font-semibold text-white">{team.franchise}</h2>
              </div>
              <div className="rounded border border-white/10 px-2 py-1 text-sm text-teal">
                {team.wins}-{team.losses}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <MiniStat label="OFF" value={team.offense} />
              <MiniStat label="DEF" value={team.defense} />
              <MiniStat label="STAR" value={team.starPower} />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{team.styleSummary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-white/10 bg-ink/45 px-2 py-2">
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="text-[11px] text-muted">{label}</div>
    </div>
  );
}
