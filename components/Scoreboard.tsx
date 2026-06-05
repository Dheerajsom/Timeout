import type { SimulatedGame, SimulatedSeries, Team } from "@/types/simulation";
import { RulesetBadge } from "./RulesetBadge";

export function Scoreboard({ result }: { result: SimulatedGame | SimulatedSeries }) {
  const game = result.type === "single_game" ? result : result.decidingGame;
  const winnerId = result.winnerTeamId;

  return (
    <section className="border-b border-white/10 bg-panel">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <RulesetBadge ruleset={result.ruleset} />
          <span className="rounded border border-white/10 px-2 py-1 text-xs text-muted">
            Seed {result.seed}
          </span>
          <span className="rounded border border-white/10 px-2 py-1 text-xs text-muted">
            {result.type === "best_of_7" ? "Best-of-7" : "Single game"}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <ScoreTeam team={result.teamA} score={game.teamAScore} isWinner={winnerId === result.teamA.id} align="left" />
          <div className="hidden text-sm font-semibold uppercase tracking-[0.28em] text-muted md:block">
            Final
          </div>
          <ScoreTeam team={result.teamB} score={game.teamBScore} isWinner={winnerId === result.teamB.id} align="right" />
        </div>
        {result.type === "best_of_7" ? (
          <p className="mt-4 text-sm text-muted">
            {result.teamA.name} {result.teamAWins}, {result.teamB.name} {result.teamBWins}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function ScoreTeam({
  team,
  score,
  isWinner,
  align,
}: {
  team: Team;
  score: number;
  isWinner: boolean;
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-left md:text-right" : "text-left"}>
      <div className="text-sm uppercase tracking-[0.18em] text-muted">{team.season}</div>
      <div className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{team.franchise}</div>
      <div className={`mt-3 text-6xl font-black tracking-normal sm:text-7xl ${isWinner ? "text-teal" : "text-white"}`}>
        {score}
      </div>
    </div>
  );
}
