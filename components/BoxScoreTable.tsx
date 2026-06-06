import type { PlayerBoxScore, Team } from "@/types/simulation";

export function BoxScoreTable({ team, players }: { team: Team; players: PlayerBoxScore[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-white/12 bg-neutral-950 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
      <div className="border-b border-white/12 bg-neutral-900 px-4 py-3">
        <h3 className="text-sm font-black text-white">{team.name}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="bg-neutral-900 text-neutral-300">
            <tr>
              {["Player", "MIN", "PTS", "REB", "AST", "STL", "BLK", "TO", "3PM", "FG", "+/-"].map((label) => (
                <th key={label} className="px-3 py-3 text-right font-bold first:text-left">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.playerId} className="border-t border-white/10 odd:bg-neutral-900/80">
                <td className="px-3 py-3 text-left">
                  <span className="font-medium text-white">{player.name}</span>
                  <span className="ml-2 text-xs font-semibold text-neutral-300">{player.position}</span>
                </td>
                <td className="px-3 py-3 text-right text-neutral-300">{player.minutes}</td>
                <td className="px-3 py-3 text-right font-semibold text-white">{player.points}</td>
                <td className="px-3 py-3 text-right text-neutral-300">{player.rebounds}</td>
                <td className="px-3 py-3 text-right text-neutral-300">{player.assists}</td>
                <td className="px-3 py-3 text-right text-neutral-300">{player.steals}</td>
                <td className="px-3 py-3 text-right text-neutral-300">{player.blocks}</td>
                <td className="px-3 py-3 text-right text-neutral-300">{player.turnovers}</td>
                <td className="px-3 py-3 text-right text-neutral-300">{player.threesMade}</td>
                <td className="px-3 py-3 text-right text-neutral-300">
                  {player.fieldGoalsMade}-{player.fieldGoalsAttempted}
                </td>
                <td className="px-3 py-3 text-right text-neutral-300">{player.plusMinus > 0 ? `+${player.plusMinus}` : player.plusMinus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
