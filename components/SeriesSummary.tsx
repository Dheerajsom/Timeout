import type { CSSProperties } from "react";
import { getTeamColors } from "@/lib/teamColors";
import type { SimulatedSeries } from "@/types/simulation";

export function SeriesSummary({ series }: { series: SimulatedSeries }) {
  const teamAWon = series.winnerTeamId === series.teamA.id;
  const winner = teamAWon ? series.teamA : series.teamB;
  const loser = teamAWon ? series.teamB : series.teamA;
  const winnerWins = teamAWon ? series.teamAWins : series.teamBWins;
  const loserWins = teamAWon ? series.teamBWins : series.teamAWins;

  const winnerColors = getTeamColors(winner);
  const loserColors = getTeamColors(loser);

  const headerStyle = {
    "--winner": winnerColors.primary,
    "--loser": loserColors.primary,
  } as CSSProperties;

  return (
    <div className="overflow-hidden rounded-xl border border-white/12 bg-neutral-950 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
      <div
        style={headerStyle}
        className="relative border-b border-white/12 bg-[radial-gradient(circle_at_15%_30%,rgba(255,255,255,0.06),transparent_45%)] px-5 py-5"
      >
        <div className="h-1 w-full rounded-full bg-[linear-gradient(90deg,var(--winner),var(--loser))]" aria-hidden="true" />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-400">Best of 7 · Series Winner</span>
            <div className="mt-1 text-2xl font-black leading-7 text-white sm:text-3xl">
              {winner.season} {winner.franchise}
            </div>
            <div className="mt-1 text-sm font-semibold text-neutral-400">over {loser.franchise}</div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-white/12 bg-neutral-900 px-5 py-3">
            <span className="text-4xl font-black text-white tabular-nums sm:text-5xl">{winnerWins}</span>
            <span className="text-lg font-black text-neutral-500">–</span>
            <span className="text-4xl font-black text-neutral-500 tabular-nums sm:text-5xl">{loserWins}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-white/8 sm:grid-cols-2">
        {series.games.map((game) => {
          const gameWinner = game.winnerTeamId === series.teamA.id ? series.teamA : series.teamB;
          const winnerIsA = game.winnerTeamId === series.teamA.id;
          return (
            <div key={game.gameNumber} className="flex items-center gap-4 bg-neutral-950 px-5 py-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/12 bg-neutral-900 text-sm font-black text-white">
                G{game.gameNumber}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className={`truncate ${winnerIsA ? "font-black text-white" : "font-semibold text-neutral-400"}`}>
                    {series.teamA.franchise}
                  </span>
                  <span className={`font-black tabular-nums ${winnerIsA ? "text-white" : "text-neutral-400"}`}>
                    {game.teamAScore}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 text-sm">
                  <span className={`truncate ${!winnerIsA ? "font-black text-white" : "font-semibold text-neutral-400"}`}>
                    {series.teamB.franchise}
                  </span>
                  <span className={`font-black tabular-nums ${!winnerIsA ? "text-white" : "text-neutral-400"}`}>
                    {game.teamBScore}
                  </span>
                </div>
                <div className="mt-1.5 truncate text-[11px] font-bold uppercase tracking-[0.12em] text-teal">
                  {gameWinner.franchise} · MVP {game.mvp.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
