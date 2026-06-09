import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BoxScoreTable } from "@/components/BoxScoreTable";
import { MatchupFactors } from "@/components/MatchupFactors";
import { MvpCard } from "@/components/MvpCard";
import { Scoreboard } from "@/components/Scoreboard";
import { SeriesSummary } from "@/components/SeriesSummary";
import { TeamRadarChart } from "@/components/TeamRadarChart";
import { buildShareSummary } from "@/lib/shareSummary";
import { getSimulation } from "@/lib/simulationStore";

type ResultPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { id } = await params;
  const simulation = await getSimulation(id);

  if (!simulation) {
    return {
      title: "Timeout Result",
      description: "Simulate the NBA matchups time never gave us.",
    };
  }

  const summary = buildShareSummary(simulation.result);

  return {
    title: summary.title,
    description: summary.description,
    openGraph: {
      title: summary.title,
      description: summary.description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: summary.title,
      description: summary.description,
    },
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  const simulation = await getSimulation(id);

  if (!simulation) {
    notFound();
  }

  const result = simulation.result;
  const game = result.type === "single_game" ? result : result.decidingGame;

  return (
    <main>
      <Scoreboard result={result} simulationId={id} />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[340px_1fr] lg:items-stretch">
          <div className="flex h-full flex-col justify-between gap-5">
            <MvpCard mvp={result.mvp} />
            <MatchupFactors factors={result.matchupFactors} teams={[result.teamA, result.teamB]} />
          </div>
          <div className="space-y-5">
            <BoxScoreTable team={result.teamA} players={game.teamABoxScore} />
            <BoxScoreTable team={result.teamB} players={game.teamBBoxScore} />
          </div>
        </div>

        <div className="mt-3 space-y-5">
          {result.type === "best_of_7" ? <SeriesSummary series={result} /> : null}
          <TeamRadarChart teamA={result.teamA} teamB={result.teamB} />
        </div>
      </section>
    </main>
  );
}
