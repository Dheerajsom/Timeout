"use client";

import Link from "next/link";
import { ArrowRight, Loader2, RotateCcw, Repeat2, Trophy } from "lucide-react";
import { getTeamColors } from "@/lib/teamColors";
import { getTeamInitials, type RoundTeam } from "@/lib/round";
import { ShareButton } from "@/components/ShareButton";
import type { SimulatedGame } from "@/types/simulation";

/**
 * Inline final: winner first, then the story of the game (quarters, deciding
 * factors, MVP) fades in underneath. Full box scores live on the result page.
 */
export function ResultPanel({
  user,
  opponent,
  result,
  simulationId,
  runningBack,
  onRunItBack,
  onNewRound,
}: {
  user: RoundTeam;
  opponent: RoundTeam;
  result: SimulatedGame;
  simulationId: string;
  runningBack: boolean;
  onRunItBack: () => void;
  onNewRound: () => void;
}) {
  const userIsTeamA = result.teamA.id === user.id;
  const userScore = userIsTeamA ? result.teamAScore : result.teamBScore;
  const opponentScore = userIsTeamA ? result.teamBScore : result.teamAScore;
  const userWon = result.winnerTeamId === user.id;
  const winner = userWon ? user : opponent;

  const quarters = [result.quarters.q1, result.quarters.q2, result.quarters.q3, result.quarters.q4];
  const regulationA = quarters.reduce((sum, quarter) => sum + quarter.teamA, 0);
  const regulationB = quarters.reduce((sum, quarter) => sum + quarter.teamB, 0);
  const overtimeA = result.teamAScore - regulationA;
  const overtimeB = result.teamBScore - regulationB;
  const hasOvertime = overtimeA > 0 || overtimeB > 0;

  const mvpOnTeamA = result.teamABoxScore.some((line) => line.playerId === result.mvp.playerId);
  const mvpTeam = mvpOnTeamA ? result.teamA : result.teamB;

  return (
    <div>
      <div className="winner-pop text-center">
        <span className="eyebrow justify-center text-orange-300">Final</span>
        <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-9 text-white sm:text-4xl sm:leading-10">
          {winner.season} {winner.franchise} win it
        </h2>
        <span
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${
            userWon ? "bg-win/15 text-win" : "bg-loss/15 text-loss"
          }`}
        >
          <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
          {userWon ? "You called it" : "Upset — your squad falls"}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-white/12 bg-ink/70">
        <ScoreRow team={user} score={userScore} winner={userWon} label="Your call" />
        <div className="h-px bg-white/10" aria-hidden="true" />
        <ScoreRow team={opponent} score={opponentScore} winner={!userWon} label="Opponent" />

        <div className="border-t border-white/10 bg-black/25 px-4 py-2.5">
          <table className="w-full text-center text-sm tabular-nums">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">
                <th scope="col" className="w-16 text-left font-black">Score</th>
                {quarters.map((_, index) => (
                  <th key={index} scope="col" className="font-black">Q{index + 1}</th>
                ))}
                {hasOvertime ? <th scope="col" className="font-black">OT</th> : null}
              </tr>
            </thead>
            <tbody className="font-display font-bold text-white/85">
              <tr>
                <th scope="row" className="text-left text-[11px] font-black uppercase tracking-[0.14em] text-muted">
                  {getTeamInitials(user.franchise)}
                </th>
                {quarters.map((quarter, index) => (
                  <td key={index}>{userIsTeamA ? quarter.teamA : quarter.teamB}</td>
                ))}
                {hasOvertime ? <td>{userIsTeamA ? overtimeA : overtimeB}</td> : null}
              </tr>
              <tr>
                <th scope="row" className="text-left text-[11px] font-black uppercase tracking-[0.14em] text-muted">
                  {getTeamInitials(opponent.franchise)}
                </th>
                {quarters.map((quarter, index) => (
                  <td key={index}>{userIsTeamA ? quarter.teamB : quarter.teamA}</td>
                ))}
                {hasOvertime ? <td>{userIsTeamA ? overtimeB : overtimeA}</td> : null}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="fade-up mt-4 space-y-4" style={{ animationDelay: "550ms" }}>
        <p className="rounded-lg border border-white/10 bg-panel px-4 py-3 text-sm font-semibold leading-6 text-white/90">
          {result.explanation}
        </p>

        {result.matchupFactors.length ? (
          <div>
            <span className="eyebrow text-white/80">Deciding factors</span>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {result.matchupFactors.slice(0, 6).map((factor) => {
                const factorTeam = factor.teamId === user.id ? user : opponent;
                return (
                  <div
                    key={`${factor.label}-${factor.teamId}`}
                    className="rounded-md border border-white/10 bg-panel px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-white/80">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full"
                        style={{ background: getTeamColors(factorTeam).primary, boxShadow: "0 0 0 2px rgba(255,255,255,0.15)" }}
                      />
                      {factor.label}
                      <span className="ml-auto font-display text-sm tabular-nums text-orange-300">
                        {factor.value > 0 ? `+${factor.value}` : factor.value}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-semibold leading-5 text-muted">{factor.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between rounded-md border border-gold/25 bg-gold/8 px-4 py-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-gold">Player of the game</div>
            <div className="mt-0.5 font-display text-lg font-bold uppercase text-white">
              {result.mvp.name}
              <span className="ml-2 text-sm font-bold normal-case text-muted">
                {mvpTeam.season} {mvpTeam.franchise}
              </span>
            </div>
          </div>
          <div className="text-right font-display text-base font-bold tabular-nums text-white/90">
            {result.mvp.points} <span className="text-xs text-muted">PTS</span>{" "}
            {result.mvp.rebounds} <span className="text-xs text-muted">REB</span>{" "}
            {result.mvp.assists} <span className="text-xs text-muted">AST</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={onRunItBack}
            disabled={runningBack}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-6 text-sm font-black uppercase tracking-wide text-white shadow-cta transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {runningBack ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Repeat2 className="h-4 w-4" aria-hidden="true" />
            )}
            Run it back
          </button>
          <button
            type="button"
            onClick={onNewRound}
            disabled={runningBack}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 text-sm font-black uppercase tracking-wide text-white transition hover:border-orange-400/60 hover:bg-white/10 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            New round
          </button>
          <ShareButton
            simulationId={simulationId}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 text-sm font-black uppercase tracking-wide text-white transition hover:border-orange-400/60 hover:bg-white/10 disabled:opacity-50"
          />
          <Link
            href={`/result/${simulationId}`}
            className="inline-flex h-11 items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-muted transition hover:text-white"
          >
            Full box score
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({
  team,
  score,
  winner,
  label,
}: {
  team: RoundTeam;
  score: number;
  winner: boolean;
  label: string;
}) {
  const colors = getTeamColors(team);

  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${winner ? "bg-white/4" : ""}`}>
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-black text-white"
        style={{ background: colors.primary, boxShadow: `inset 0 0 0 2px ${colors.secondary}` }}
      >
        {getTeamInitials(team.franchise)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">
          {label} &middot; {team.season}
        </div>
        <div className="truncate font-display text-xl font-bold uppercase leading-6 text-white">
          {team.franchise}
        </div>
      </div>
      {winner ? (
        <span className="hidden rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-gold sm:inline">
          Winner
        </span>
      ) : null}
      <span
        className={`font-display text-4xl font-bold tabular-nums ${winner ? "text-white" : "text-white/45"}`}
      >
        {score}
      </span>
    </div>
  );
}
