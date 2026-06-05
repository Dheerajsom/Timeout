import type { SimulatedGame } from "@/types/simulation";

export function QuarterTable({ game }: { game: SimulatedGame }) {
  const quarters = [game.quarters.q1, game.quarters.q2, game.quarters.q3, game.quarters.q4];

  return (
    <div className="overflow-hidden rounded-md border border-white/10">
      <table className="w-full min-w-[420px] border-collapse text-sm">
        <thead className="bg-white/[0.04] text-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Team</th>
            {["Q1", "Q2", "Q3", "Q4", "Final"].map((label) => (
              <th key={label} className="px-3 py-3 text-right font-medium">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <QuarterRow name={game.teamA.franchise} scores={quarters.map((q) => q.teamA)} total={game.teamAScore} />
          <QuarterRow name={game.teamB.franchise} scores={quarters.map((q) => q.teamB)} total={game.teamBScore} />
        </tbody>
      </table>
    </div>
  );
}

function QuarterRow({ name, scores, total }: { name: string; scores: number[]; total: number }) {
  return (
    <tr className="border-t border-white/10">
      <td className="px-4 py-3 font-medium text-white">{name}</td>
      {scores.map((score, index) => (
        <td key={index} className="px-3 py-3 text-right text-muted">
          {score}
        </td>
      ))}
      <td className="px-3 py-3 text-right font-semibold text-white">{total}</td>
    </tr>
  );
}
