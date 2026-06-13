import { BoxScoreTable } from "@/components/BoxScoreTable";
import type { SimulatedSeries } from "@/types/simulation";

export function SeriesBoxScores({ series }: { series: SimulatedSeries }) {
  return (
    <div className="space-y-5">
      {series.games.map((game) => {
        const gameWinner = game.winnerTeamId === series.teamA.id ? series.teamA : series.teamB;
        return (
          <div key={game.gameNumber} className="overflow-hidden rounded-xl border border-white/12 bg-neutral-950">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/12 bg-neutral-900 px-5 py-3">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">Game {game.gameNumber}</h3>
              <span className="text-xs font-bold text-neutral-400">
                {series.teamA.franchise} {game.teamAScore} – {game.teamBScore} {series.teamB.franchise}
                <span className="ml-2 font-black text-teal">{gameWinner.franchise} win</span>
              </span>
            </div>
            <div className="space-y-4 p-4">
              <BoxScoreTable team={series.teamA} players={game.teamABoxScore} />
              <BoxScoreTable team={series.teamB} players={game.teamBBoxScore} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
