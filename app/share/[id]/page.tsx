import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Trophy } from "lucide-react";
import { buildShareSummary } from "@/lib/shareSummary";
import { getSimulation } from "@/lib/simulationStore";
import { getSiteOrigin } from "@/lib/siteUrl";
import { getTeamColors } from "@/lib/teamColors";

type SharePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
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
  const shareUrl = new URL(`/share/${id}`, origin).toString();
  const imageUrl = new URL(`/share/${id}/opengraph-image`, origin).toString();

  return {
    title: summary.title,
    description: summary.description,
    alternates: {
      canonical: shareUrl,
    },
    openGraph: {
      title: summary.title,
      description: summary.description,
      type: "website",
      url: shareUrl,
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

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const simulation = await getSimulation(id);

  if (!simulation) {
    notFound();
  }

  const result = simulation.result;
  const game = result.type === "single_game" ? result : result.decidingGame;
  const summary = buildShareSummary(result);
  const winner = result.winnerTeamId === result.teamA.id ? result.teamA : result.teamB;
  const loser = result.winnerTeamId === result.teamA.id ? result.teamB : result.teamA;
  const colors = getTeamColors(winner);
  const style = {
    "--share-primary": colors.primary,
    "--share-secondary": colors.secondary,
    "--share-accent": colors.accent,
  } as CSSProperties;

  return (
    <main className="relative px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-210px)] max-w-5xl place-items-center py-6">
        <div
          style={style}
          className="relative w-full overflow-hidden rounded-md border border-white/18 bg-neutral-950 shadow-[0_28px_90px_rgba(0,0,0,0.48)]"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--share-primary) 90%, #000 10%) 0 58%, color-mix(in srgb, var(--share-secondary) 88%, #111 12%) 58% 100%)",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.42),transparent_54%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#fb923c,#facc15,#14b8a6)]" aria-hidden="true" />

          <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/24 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-orange-100">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                Timeout Result
              </div>
              <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-5xl">
                {winner.season} {winner.franchise} win
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-white px-3 py-1.5 text-sm font-black uppercase tracking-[0.14em] text-neutral-950">
                  {summary.scoreLabel}
                </span>
                <span className="text-lg font-black text-white">
                  vs {loser.season} {loser.franchise}
                </span>
              </div>
              {result.type === "best_of_7" ? (
                <p className="mt-3 text-sm font-bold text-white/82">
                  Deciding game: {summary.winnerScore}-{summary.loserScore}
                </p>
              ) : null}
            </div>

            <div className="rounded-md border border-white/20 bg-black/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-orange-100/80">MVP</div>
              <div className="mt-2 text-3xl font-black text-white">{result.mvp.name}</div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <ShareStat label="PTS" value={result.mvp.points} />
                <ShareStat label="REB" value={result.mvp.rebounds} />
                <ShareStat label="AST" value={result.mvp.assists} />
              </div>
              <div className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-orange-100/70">
                {result.mvp.fieldGoalsMade}-{result.mvp.fieldGoalsAttempted} FG
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/12 bg-black/28 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div className="text-sm font-bold text-white/82">
              Final matchup: {summary.teamALabel} {game.teamAScore}, {summary.teamBLabel} {game.teamBScore}
            </div>
            <Link
              href={`/result/${id}`}
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-black uppercase text-white shadow-[0_0_24px_rgba(249,115,22,0.38)] transition hover:bg-orange-400 sm:mt-0 sm:w-auto"
            >
              Full Box Score
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ShareStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/16 bg-white/12 px-2 py-3">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs font-black text-orange-100/78">{label}</div>
    </div>
  );
}
