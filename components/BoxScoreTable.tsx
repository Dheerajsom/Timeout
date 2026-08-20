import type { CSSProperties } from "react";
import type { PlayerBoxScore, Team } from "@/types/simulation";
import { getTeamColors } from "@/lib/teamColors";

export function BoxScoreTable({ team, players }: { team: Team; players: PlayerBoxScore[] }) {
  const colors = getTeamColors(team);
  const style = {
    "--box-primary": colors.primary,
    "--box-secondary": colors.secondary,
    "--box-accent": colors.accent,
  } as CSSProperties;

  return (
    <div style={style} className="min-w-0 overflow-hidden rounded-md border border-orange-100/18 bg-[#15100b] shadow-[0_18px_48px_rgba(36,20,8,0.34)]">
      <div className="h-1.5 bg-[linear-gradient(90deg,var(--box-primary),var(--box-secondary))]" aria-hidden="true" />
      <div className="border-b border-orange-100/14 bg-[#21170f] px-4 py-3">
        <h3 className="text-sm font-black text-white">
          {team.season} {team.franchise}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="bg-[#21170f] text-orange-100/78">
            <tr>
              {["Player", "MIN", "PTS", "REB", "AST", "STL", "BLK", "TO", "3PM", "FG", "+/-"].map((label) => (
                <th key={label} scope="col" className="px-3 py-3 text-right font-bold first:text-left">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.playerId} className="border-t border-orange-100/10 odd:bg-[#1d150e]">
                <td className="px-3 py-3 text-left">
                  <span className="font-medium text-white">{player.name}</span>
                  <span className="ml-2 text-xs font-semibold text-orange-100/64">{player.position}</span>
                </td>
                <td className="px-3 py-3 text-right text-orange-50/72">{player.minutes}</td>
                <td className="px-3 py-3 text-right font-semibold text-white">{player.points}</td>
                <td className="px-3 py-3 text-right text-orange-50/72">{player.rebounds}</td>
                <td className="px-3 py-3 text-right text-orange-50/72">{player.assists}</td>
                <td className="px-3 py-3 text-right text-orange-50/72">{player.steals}</td>
                <td className="px-3 py-3 text-right text-orange-50/72">{player.blocks}</td>
                <td className="px-3 py-3 text-right text-orange-50/72">{player.turnovers}</td>
                <td className="px-3 py-3 text-right text-orange-50/72">{player.threesMade}</td>
                <td className="px-3 py-3 text-right text-orange-50/72">
                  {player.fieldGoalsMade}-{player.fieldGoalsAttempted}
                </td>
                <td className="px-3 py-3 text-right text-orange-50/72">{player.plusMinus > 0 ? `+${player.plusMinus}` : player.plusMinus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
