import Link from "next/link";
import { notFound } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { BoxScoreTable } from "@/components/BoxScoreTable";
import { MatchupFactors } from "@/components/MatchupFactors";
import { MvpCard } from "@/components/MvpCard";
import { QuarterTable } from "@/components/QuarterTable";
import { Scoreboard } from "@/components/Scoreboard";
import { SeriesSummary } from "@/components/SeriesSummary";
import { TeamRadarChart } from "@/components/TeamRadarChart";
import { getSimulation } from "@/lib/simulationStore";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const simulation = await getSimulation(id);

  if (!simulation) {
    notFound();
  }

  const result = simulation.result;
  const game = result.type === "single_game" ? result : result.decidingGame;

  return (
    <main>
      <Scoreboard result={result} />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[340px_1fr] lg:items-start">
          <div className="space-y-5">
            <MvpCard mvp={result.mvp} />
            <Link
              href={`/?teamA=${result.teamA.id}&teamB=${result.teamB.id}`}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-ink transition hover:bg-teal"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Run It Back
            </Link>
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white">Box Score</h2>
            <BoxScoreTable team={result.teamA} players={game.teamABoxScore} />
            <BoxScoreTable team={result.teamB} players={game.teamBBoxScore} />
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-5">
          {result.type === "best_of_7" ? <SeriesSummary series={result} /> : null}
          <QuarterTable game={game} />
          <div className="rounded-md border border-white/12 bg-neutral-950 p-5">
            <h2 className="text-lg font-semibold text-white">Why It Played Out This Way</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-300">{result.explanation}</p>
          </div>
          <TeamRadarChart teamA={result.teamA} teamB={result.teamB} />
          </div>
          <aside className="space-y-5">
          <MatchupFactors factors={result.matchupFactors} teams={[result.teamA, result.teamB]} />
          </aside>
        </div>
      </section>
    </main>
  );
}
