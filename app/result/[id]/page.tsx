import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BoxScoreTable } from "@/components/BoxScoreTable";
import { MatchupFactors } from "@/components/MatchupFactors";
import { MvpCard } from "@/components/MvpCard";
import { Scoreboard } from "@/components/Scoreboard";
import { SeriesSummary } from "@/components/SeriesSummary";
import { SeriesBoxScores } from "@/components/SeriesBoxScores";
import { TeamRadarChart } from "@/components/TeamRadarChart";
import { buildShareSummary } from "@/lib/shareSummary";
import { getSiteOrigin } from "@/lib/siteUrl";
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

  const origin = getSiteOrigin();
  const summary = buildShareSummary(simulation.result);
  const resultUrl = new URL(`/result/${id}`, origin).toString();
  const imageUrl = new URL(`/share/${id}/opengraph-image`, origin).toString();

  return {
    title: summary.title,
    description: summary.description,
    alternates: {
      canonical: resultUrl,
    },
    openGraph: {
      title: summary.title,
      description: summary.description,
      type: "website",
      url: resultUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: summary.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: summary.title,
      description: summary.description,
      images: [imageUrl],
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
  const shareOrigin = getSiteOrigin();
  const isSeries = result.type === "best_of_7";

  return (
    <main>
      <Scoreboard result={result} shareOrigin={shareOrigin} simulationId={id} />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {result.type === "best_of_7" ? <div className="mb-5"><SeriesSummary series={result} /></div> : null}

        <div className="grid min-w-0 gap-5 lg:grid-cols-[340px_1fr] lg:items-start">
          <div className="flex min-w-0 flex-col gap-5">
            <MvpCard mvp={result.mvp} averaged={isSeries} />
            <MatchupFactors factors={result.matchupFactors} teams={[result.teamA, result.teamB]} />
          </div>
          <div className="min-w-0 space-y-5">
            {result.type === "best_of_7" ? (
              <SeriesBoxScores series={result} />
            ) : (
              <>
                <BoxScoreTable team={result.teamA} players={result.teamABoxScore} />
                <BoxScoreTable team={result.teamB} players={result.teamBBoxScore} />
              </>
            )}
          </div>
        </div>

        <div className="mt-3 min-w-0 space-y-5">
          <TeamRadarChart teamA={result.teamA} teamB={result.teamB} />
        </div>
      </section>
    </main>
  );
}
