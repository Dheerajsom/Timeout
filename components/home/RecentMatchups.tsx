"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { historyUpdatedEvent } from "@/components/round/RoundStage";
import {
  formatHistoryDate,
  readRoundHistory,
  type RoundHistoryEntry,
} from "@/lib/roundHistory";

const sampleMatchups = [
  {
    userTeam: "1995-96 Chicago Bulls",
    opponentTeam: "2016-17 Golden State Warriors",
    userScore: 108,
    opponentScore: 112,
    userWon: false,
  },
  {
    userTeam: "2012-13 Miami Heat",
    opponentTeam: "1986-87 Los Angeles Lakers",
    userScore: 104,
    opponentScore: 101,
    userWon: true,
  },
  {
    userTeam: "2022-23 Denver Nuggets",
    opponentTeam: "2003-04 Detroit Pistons",
    userScore: 97,
    opponentScore: 92,
    userWon: true,
  },
];

/**
 * Your last rounds, straight from local history. First-time visitors see
 * sample finals so the section still reads.
 */
export function RecentMatchups() {
  const [history, setHistory] = useState<RoundHistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const refresh = () => setHistory(readRoundHistory());
    refresh();
    setLoaded(true);
    window.addEventListener(historyUpdatedEvent, refresh);
    return () => window.removeEventListener(historyUpdatedEvent, refresh);
  }, []);

  const showSamples = loaded && history.length === 0;
  const entries = history.slice(0, 6);

  return (
    <section aria-labelledby="recent-matchups-title" className="mx-auto mt-14 w-full max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow text-orange-300">Recent matchups</span>
          <h2 id="recent-matchups-title" className="mt-2 font-display text-2xl font-bold uppercase leading-8 text-white sm:text-3xl">
            {showSamples ? "Finals waiting to happen" : "Your recent finals"}
          </h2>
        </div>
        {showSamples ? (
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
            Sample results — play a round to fill this in
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {showSamples
          ? sampleMatchups.map((game) => (
              <MatchupCard
                key={`${game.userTeam}-${game.opponentTeam}`}
                userTeam={game.userTeam}
                opponentTeam={game.opponentTeam}
                userScore={game.userScore}
                opponentScore={game.opponentScore}
                userWon={game.userWon}
                meta="Sample"
              />
            ))
          : entries.map((round) => (
              <MatchupCard
                key={round.id}
                href={round.resultUrl}
                userTeam={round.userTeam}
                opponentTeam={round.opponentTeam}
                userScore={round.userScore}
                opponentScore={round.opponentScore}
                userWon={round.userWon}
                meta={formatHistoryDate(round.playedAt)}
              />
            ))}
        {!showSamples && entries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/15 bg-panel/60 p-6 text-sm font-semibold text-muted sm:col-span-2 lg:col-span-3">
            Loading your history&hellip;
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MatchupCard({
  href,
  userTeam,
  opponentTeam,
  userScore,
  opponentScore,
  userWon,
  meta,
}: {
  href?: string;
  userTeam: string;
  opponentTeam: string;
  userScore: number;
  opponentScore: number;
  userWon: boolean;
  meta: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] ${
            userWon ? "bg-win/15 text-win" : "bg-loss/15 text-loss"
          }`}
        >
          {userWon ? "Win" : "Loss"}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">{meta}</span>
      </div>
      <div className="mt-3 space-y-1.5">
        <ScoreLine name={userTeam} score={userScore} winner={userWon} />
        <ScoreLine name={opponentTeam} score={opponentScore} winner={!userWon} />
      </div>
    </>
  );

  const className =
    "block rounded-lg border border-white/10 bg-panel/80 p-4 transition hover:border-orange-400/50 hover:bg-raised";

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

function ScoreLine({ name, score, winner }: { name: string; score: number; winner: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={`truncate text-sm font-bold ${winner ? "text-white" : "text-white/55"}`}>{name}</span>
      <span className={`font-display text-lg font-bold tabular-nums ${winner ? "text-white" : "text-white/45"}`}>
        {score}
      </span>
    </div>
  );
}
