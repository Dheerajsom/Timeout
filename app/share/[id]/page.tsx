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
  const userTeam = result.teamA;
  const opponent = result.teamB;
  const userWon = result.winnerTeamId === userTeam.id;
  const userScore = game.teamAScore;
  const opponentScore = game.teamBScore;
  const winner = result.winnerTeamId === userTeam.id ? userTeam : opponent;
  const colors = getTeamColors(winner);
  const style = {
    "--share-primary": colors.primary,
    "--share-secondary": colors.secondary,
    "--share-accent": colors.accent,
  } as CSSProperties;

  return (
    <main className="relative flex min-h-[calc(100vh-156px)] items-start justify-center px-4 pb-10 pt-3 sm:min-h-[calc(100vh-218px)] sm:items-center sm:px-6 sm:pb-8 sm:pt-2 lg:px-8">
      <section className="flex w-full max-w-4xl justify-center py-2 sm:py-6">
        <div
          style={style}
          className="relative w-full overflow-hidden rounded-md border border-white/18 bg-neutral-950 shadow-[0_28px_90px_rgba(0,0,0,0.48)]"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--share-primary) 82%, #050505 18%) 0 46%, #111 46% 100%)",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.26),transparent_46%,rgba(0,0,0,0.28))]" aria-hidden="true" />

          <div className="relative grid gap-3 p-4 sm:gap-5 sm:p-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
            <div className="flex min-h-[238px] flex-col justify-between rounded-md border border-white/14 bg-black/18 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] sm:min-h-[280px] sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/24 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-orange-100">
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                  Timeout Result
                </div>
              </div>

              <div className="py-5 sm:py-8">
                <div className="text-[4.35rem] font-black leading-none text-white drop-shadow-[0_7px_0_rgba(0,0,0,0.24)] sm:text-[6.25rem]">
                  {userScore}
                  <span className="mx-2 text-white/40">-</span>
                  {opponentScore}
                </div>
                <h1 className="mt-3 text-2xl font-black leading-tight text-white sm:mt-4 sm:text-3xl">
                  {winner.season} {winner.franchise} win
                </h1>
              </div>

              {result.type === "best_of_7" ? (
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-white/72">
                  Series result: {summary.scoreLabel}
                </p>
              ) : (
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-white/72">Final score</p>
              )}
            </div>

            <div className="grid gap-3">
              <div className="rounded-md border border-white/18 bg-white/[0.08] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <div
                  className={`inline-flex rounded-md px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] ${
                    userWon ? "bg-emerald-300 text-emerald-950" : "bg-rose-300 text-rose-950"
                  }`}
                >
                  {userWon ? "I won!" : "I lost!"}
                </div>
                <div className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-orange-100/70">My pick</div>
                <div className="mt-2 text-xl font-black leading-tight text-white sm:text-2xl">{userTeam.season} {userTeam.franchise}</div>
                <div className="mt-1 text-sm font-bold text-white/68">Opponent: {opponent.season} {opponent.franchise}</div>
              </div>

              <div className="rounded-md border border-white/20 bg-black/34 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-orange-100/80">MVP</div>
                <div className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">{result.mvp.name}</div>
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
          </div>

          <div className="relative bg-black/30 px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="flex justify-start">
              <Link
                href={`/result/${id}`}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-black uppercase text-white shadow-[0_0_24px_rgba(249,115,22,0.38)] transition hover:bg-orange-400 sm:w-auto"
              >
                Full Box Score
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
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
