import { notFound } from "next/navigation";
import { BoxScoreTable } from "@/components/BoxScoreTable";
import { MatchupFactors } from "@/components/MatchupFactors";
import { MvpCard } from "@/components/MvpCard";
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
          <div className="order-1 lg:col-start-1 lg:row-start-1">
            <MvpCard mvp={result.mvp} />
          </div>
          <div className="order-3 lg:col-start-2 lg:row-start-1">
            <BoxScoreTable team={result.teamA} players={game.teamABoxScore} />
          </div>
          <div className="order-2 lg:col-start-1 lg:row-start-2">
            <MatchupFactors factors={result.matchupFactors} teams={[result.teamA, result.teamB]} />
          </div>
          <div className="order-4 lg:col-start-2 lg:row-start-2">
            <BoxScoreTable team={result.teamB} players={game.teamBBoxScore} />
          </div>
        </div>

        <div className="mt-5 space-y-5">
          {result.type === "best_of_7" ? <SeriesSummary series={result} /> : null}
          <TeamRadarChart teamA={result.teamA} teamB={result.teamB} />
        </div>
      </section>
    </main>
  );
}
