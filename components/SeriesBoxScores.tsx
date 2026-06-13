import { ChevronDown } from "lucide-react";
import { BoxScoreTable } from "@/components/BoxScoreTable";
import type { SimulatedSeries } from "@/types/simulation";

export function SeriesBoxScores({ series }: { series: SimulatedSeries }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-black uppercase tracking-[0.16em] text-neutral-400">Game box scores</h2>
      {series.games.map((game, index) => {
        const gameWinner = game.winnerTeamId === series.teamA.id ? series.teamA : series.teamB;
        return (
          <details
            key={game.gameNumber}
            open={index === 0}
            className="group overflow-hidden rounded-xl border border-white/12 bg-neutral-950"
          >
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 px-5 py-3.5 transition hover:bg-neutral-900 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/12 bg-neutral-900 text-xs font-black text-white">
                  G{game.gameNumber}
                </span>
                <span className="text-sm font-black uppercase tracking-[0.14em] text-white">Game {game.gameNumber}</span>
              </span>
              <span className="flex items-center gap-3 text-xs font-bold text-neutral-400">
                <span>
                  {series.teamA.franchise} {game.teamAScore} – {game.teamBScore} {series.teamB.franchise}
                  <span className="ml-2 font-black text-teal">{gameWinner.franchise} win</span>
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-neutral-500 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </span>
            </summary>
            <div className="space-y-4 border-t border-white/12 p-4">
              <BoxScoreTable team={series.teamA} players={game.teamABoxScore} />
              <BoxScoreTable team={series.teamB} players={game.teamBBoxScore} />
            </div>
          </details>
        );
      })}
    </div>
  );
}
