import type { PlayerBoxScore, Ruleset, Team } from "@/types/simulation";
import { rulesetModifiers } from "./constants";
import { SeededRng } from "./rng";
import { calculateMvpScore, clamp } from "./utils";

export function generateBoxScore({
  team,
  opponent,
  teamScore,
  opponentScore,
  ruleset,
  rng,
}: {
  team: Team;
  opponent: Team;
  teamScore: number;
  opponentScore: number;
  ruleset: Ruleset;
  rng: SeededRng;
}) {
  const rules = rulesetModifiers[ruleset];
  const totalShotWeight = team.players.reduce(
    (acc, player) => acc + player.minutes * (player.usage / 100) * (player.scoring / 100),
    0,
  );
  let remainingPoints = teamScore;

  const initial = team.players.map((player, index) => {
    const shotWeight = player.minutes * (player.usage / 100) * (player.scoring / 100);
    const pointShare = shotWeight / totalShotWeight;
    const points =
      index === team.players.length - 1
        ? remainingPoints
        : Math.max(0, Math.round(teamScore * pointShare + rng.normal(0, 2.8)));
    remainingPoints -= points;

    const roleReboundBoost = player.position === "C" || player.position === "PF" ? 1.25 : player.position === "PG" ? 0.74 : 1;
    const roleAssistBoost = player.position === "PG" || player.position === "G" ? 1.25 : player.position === "C" ? 0.68 : 1;
    const rebounds = Math.max(0, Math.round((player.minutes / 36) * (player.rebounding / 10) * roleReboundBoost + rng.normal(0, 1.2)));
    const assists = Math.max(0, Math.round((player.minutes / 36) * (player.playmaking / 11) * roleAssistBoost + rng.normal(0, 1.1)));
    const steals = Math.max(0, Math.round((player.minutes / 36) * (player.defense / 38) + rng.normal(0, 0.45)));
    const blocks = Math.max(0, Math.round((player.minutes / 36) * (player.rimProtection / 34) + rng.normal(0, 0.5)));
    const turnovers = Math.max(0, Math.round((player.minutes / 36) * (player.usage / 26) + rng.normal(0, 0.7)));
    const threesMade = Math.max(0, Math.round((points / 9) * (player.threePoint / 100) * rules.threePointMultiplier + rng.normal(0, 0.9)));
    const fieldGoalsMade = Math.max(threesMade, Math.round((points - threesMade * 3) / 2 + threesMade));
    const efficiencyPenalty = clamp((100 - player.efficiency + opponent.defense * 0.12) / 100, 0.08, 0.38);
    const fieldGoalsAttempted = Math.max(fieldGoalsMade, Math.round(fieldGoalsMade * (1 + efficiencyPenalty) + rng.between(0, 3)));
    const plusMinus = Math.round((teamScore - opponentScore) * (player.minutes / 240) + rng.normal(0, 5));

    const box = {
      playerId: player.id,
      name: player.name,
      position: player.position,
      minutes: player.minutes,
      points,
      rebounds,
      assists,
      steals,
      blocks,
      turnovers,
      threesMade,
      fieldGoalsMade,
      fieldGoalsAttempted,
      plusMinus,
    };

    return {
      ...box,
      mvpScore: calculateMvpScore(box),
    };
  });

  const pointDelta = teamScore - initial.reduce((acc, player) => acc + player.points, 0);
  if (pointDelta !== 0) {
    const leadScorer = initial.reduce((best, player) => (player.points > best.points ? player : best), initial[0]);
    leadScorer.points += pointDelta;
    leadScorer.mvpScore = calculateMvpScore(leadScorer);
  }

  return initial.sort((a, b) => b.minutes - a.minutes) satisfies PlayerBoxScore[];
}
