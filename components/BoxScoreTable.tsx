import type { PlayerBoxScore, Team } from "@/types/simulation";

export function BoxScoreTable({ team, players }: { team: Team; players: PlayerBoxScore[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-white/10">
      <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <h3 className="text-sm font-semibold text-white">{team.name} Box Score</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="text-muted">
            <tr>
              {["Player", "MIN", "PTS", "REB", "AST", "STL", "BLK", "TO", "3PM", "FG", "+/-"].map((label) => (
                <th key={label} className="px-3 py-3 text-right font-medium first:text-left">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.playerId} className="border-t border-white/10">
                <td className="px-3 py-3 text-left">
                  <span className="font-medium text-white">{player.name}</span>
                  <span className="ml-2 text-xs text-muted">{player.position}</span>
                </td>
                <td className="px-3 py-3 text-right text-muted">{player.minutes}</td>
                <td className="px-3 py-3 text-right font-semibold text-white">{player.points}</td>
                <td className="px-3 py-3 text-right text-muted">{player.rebounds}</td>
                <td className="px-3 py-3 text-right text-muted">{player.assists}</td>
                <td className="px-3 py-3 text-right text-muted">{player.steals}</td>
                <td className="px-3 py-3 text-right text-muted">{player.blocks}</td>
                <td className="px-3 py-3 text-right text-muted">{player.turnovers}</td>
                <td className="px-3 py-3 text-right text-muted">{player.threesMade}</td>
                <td className="px-3 py-3 text-right text-muted">
                  {player.fieldGoalsMade}-{player.fieldGoalsAttempted}
                </td>
                <td className="px-3 py-3 text-right text-muted">{player.plusMinus > 0 ? `+${player.plusMinus}` : player.plusMinus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
