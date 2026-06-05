import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SimulationForm } from "@/components/SimulationForm";
import { getTeamById, teams } from "@/lib/teams";

const ratingKeys = [
  "offense",
  "defense",
  "spacing",
  "rimPressure",
  "rebounding",
  "playmaking",
  "starPower",
  "benchDepth",
  "clutch",
  "physicality",
] as const;

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = getTeamById(id);

  if (!team) {
    notFound();
  }

  const opponent = teams.find((item) => item.id !== team.id) ?? teams[0];

  return (
    <main>
      <section className="border-b border-white/10 bg-panel">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/teams" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Teams
          </Link>
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-teal">{team.season}</div>
              <h1 className="mt-2 text-4xl font-black tracking-normal text-white sm:text-5xl">{team.franchise}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">{team.styleSummary}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <HeaderStat label="Record" value={`${team.wins}-${team.losses}`} />
              <HeaderStat label="Offense" value={team.offense} />
              <HeaderStat label="Defense" value={team.defense} />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="space-y-6">
          <div className="rounded-md border border-white/10 bg-panel p-5">
            <h2 className="text-lg font-semibold text-white">Team Ratings</h2>
            <div className="mt-5 space-y-3">
              {ratingKeys.map((key) => (
                <RatingBar key={key} label={labelize(key)} value={team[key]} />
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-white/10">
            <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
              <h2 className="text-sm font-semibold text-white">Rotation</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="text-muted">
                  <tr>
                    {["Player", "MIN", "USG", "SCOR", "3PT", "PLAY", "REB", "DEF"].map((label) => (
                      <th key={label} className="px-3 py-3 text-right font-medium first:text-left">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {team.players.map((player) => (
                    <tr key={player.id} className="border-t border-white/10">
                      <td className="px-3 py-3 text-left">
                        <span className="font-medium text-white">{player.name}</span>
                        <span className="ml-2 text-xs text-muted">{player.position}</span>
                      </td>
                      <td className="px-3 py-3 text-right text-muted">{player.minutes}</td>
                      <td className="px-3 py-3 text-right text-muted">{player.usage}</td>
                      <td className="px-3 py-3 text-right text-muted">{player.scoring}</td>
                      <td className="px-3 py-3 text-right text-muted">{player.threePoint}</td>
                      <td className="px-3 py-3 text-right text-muted">{player.playmaking}</td>
                      <td className="px-3 py-3 text-right text-muted">{player.rebounding}</td>
                      <td className="px-3 py-3 text-right text-muted">{player.defense}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <aside>
          <SimulationForm teams={teams} initialTeamAId={team.id} initialTeamBId={opponent.id} />
        </aside>
      </section>
    </main>
  );
}

function HeaderStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-white/10 bg-ink/45 p-3">
      <div className="text-xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">{label}</div>
    </div>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-white">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-teal" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function labelize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
}
