import type { SimulatedSeries } from "@/types/simulation";

export function SeriesSummary({ series }: { series: SimulatedSeries }) {
  return (
    <div className="overflow-hidden rounded-md border border-white/10">
      <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Series Summary</h3>
      </div>
      <div className="divide-y divide-white/10">
        {series.games.map((game) => {
          const winner = game.winnerTeamId === series.teamA.id ? series.teamA : series.teamB;
          return (
            <div key={game.gameNumber} className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[90px_1fr_auto] sm:items-center">
              <span className="text-muted">Game {game.gameNumber}</span>
              <span className="font-medium text-white">
                {series.teamA.franchise} {game.teamAScore}, {series.teamB.franchise} {game.teamBScore}
              </span>
              <span className="text-teal">
                {winner.franchise} wins, MVP {game.mvpName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
