import type { Player, PlayerBoxScore, Ruleset, Team } from "@/types/simulation";
import { rulesetModifiers } from "./constants";
import { SeededRng } from "./rng";
import { calculateMvpScore, clamp } from "./utils";

/** A player plus the shot share they drew for this particular game. */
type GameProfile = {
  player: Player;
  index: number;
  shotWeight: number;
};

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
  const gameProfiles: GameProfile[] = team.players.map((player, index) => {
    const baseShotWeight = player.minutes * (player.usage / 100) * (player.scoring / 100);
    const roleVolatility = index < 2 ? 0.28 : index < 5 ? 0.42 : 0.32;
    const coldNight = index < 2 && rng.next() < 0.24 ? rng.between(0.62, 0.88) : 1;
    const popNight = index > 0 && index < 5 && rng.next() < 0.3 ? rng.between(1.16, 1.62) : 1;
    const benchSpark = index >= 5 && rng.next() < 0.18 ? rng.between(1.12, 1.42) : 1;
    const rhythm = Math.exp(rng.normal(0, roleVolatility));
    const shotWeight = Math.max(0.1, baseShotWeight * coldNight * popNight * benchSpark * rhythm);

    return { player, index, shotWeight };
  });

  const totalShotWeight = gameProfiles.reduce((acc, profile) => acc + profile.shotWeight, 0);
  const playerPoints = gameProfiles.map(({ index, shotWeight }) => {
    const noise = rng.normal(0, index < 5 ? 2.4 : 1.3);
    return Math.max(0, Math.round((teamScore * shotWeight) / totalShotWeight + noise));
  });

  // Nudge individual scoring lines one point at a time until they add up to the
  // team total. The deficit only ever shrinks toward zero, so its sign — and with
  // it the rotation filter and the weighting mode — is fixed for the whole loop.
  let pointDelta = teamScore - playerPoints.reduce((acc, points) => acc + points, 0);
  if (pointDelta !== 0) {
    const adding = pointDelta > 0;
    const step = adding ? 1 : -1;
    const rotation = gameProfiles.filter(({ player }) => player.minutes >= 12);

    while (pointDelta !== 0) {
      // When taking points away, only players who still have some are eligible,
      // so that shortlist has to be rebuilt as the lines change.
      const eligible = adding ? rotation : rotation.filter((profile) => playerPoints[profile.index] > 0);
      const fallback = adding ? gameProfiles : gameProfiles.filter((profile) => playerPoints[profile.index] > 0);
      const candidates = eligible.length > 0 ? eligible : fallback;

      // Nothing left to take points from — bail rather than push a line negative.
      if (candidates.length === 0) {
        break;
      }

      const selected = pickWeightedProfile(candidates, playerPoints, rng, adding);
      playerPoints[selected.index] += step;
      pointDelta -= step;
    }
  }

  const initial = gameProfiles.map(({ player }, index) => {
    const points = playerPoints[index];
    const roleReboundBoost = player.position === "C" || player.position === "PF" ? 1.25 : player.position === "PG" ? 0.74 : 1;
    const roleAssistBoost = player.position === "PG" || player.position === "G" ? 1.25 : player.position === "C" ? 0.68 : 1;
    const rebounds = Math.max(0, Math.round((player.minutes / 36) * (player.rebounding / 10) * roleReboundBoost + rng.normal(0, 1.2)));
    const assists = Math.max(0, Math.round((player.minutes / 36) * (player.playmaking / 11) * roleAssistBoost + rng.normal(0, 1.1)));
    const steals = Math.max(0, Math.round((player.minutes / 36) * (player.defense / 38) + rng.normal(0, 0.45)));
    const blocks = Math.max(0, Math.round((player.minutes / 36) * (player.rimProtection / 34) + rng.normal(0, 0.5)));
    const turnovers = Math.max(0, Math.round((player.minutes / 36) * (player.usage / 26) + rng.normal(0, 0.7)));
    const shootingLine = buildShootingLine({ points, player, opponent, rulesThreeMultiplier: rules.threePointMultiplier, rng });
    const { threesMade, fieldGoalsMade, fieldGoalsAttempted } = shootingLine;
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

  return initial.sort((a, b) => b.minutes - a.minutes) satisfies PlayerBoxScore[];
}

/**
 * Weighted draw over a shortlist of players: by shot share when handing points
 * out, by points already scored when taking them back.
 */
function pickWeightedProfile(profiles: GameProfile[], playerPoints: number[], rng: SeededRng, byShotWeight: boolean) {
  const weightOf = byShotWeight
    ? (profile: GameProfile) => profile.shotWeight
    : (profile: GameProfile) => Math.max(1, playerPoints[profile.index]);

  let total = 0;
  for (const profile of profiles) {
    total += weightOf(profile);
  }

  let cursor = rng.between(0, total);

  for (const profile of profiles) {
    cursor -= weightOf(profile);
    if (cursor <= 0) {
      return profile;
    }
  }

  return profiles[profiles.length - 1];
}

function buildShootingLine({
  points,
  player,
  opponent,
  rulesThreeMultiplier,
  rng,
}: {
  points: number;
  player: Player;
  opponent: Team;
  rulesThreeMultiplier: number;
  rng: SeededRng;
}) {
  if (points === 0) {
    const attempts = rng.next() < 0.35 ? rng.int(1, 3) : 0;
    return { threesMade: 0, fieldGoalsMade: 0, fieldGoalsAttempted: attempts };
  }

  const threePointProfile = clamp(0.1 + (player.threePoint - 62) / 155, 0.05, 0.48) * rulesThreeMultiplier;
  let threesMade = Math.max(0, Math.min(Math.floor(points / 3), Math.round((points / 3) * threePointProfile + rng.normal(0, 0.95))));
  let freeThrowPoints = Math.round(
    points * clamp(0.08 + player.usage / 260 + player.physicality / 520 + rng.normal(0, 0.045), 0.05, 0.34),
  );
  freeThrowPoints = Math.max(0, Math.min(freeThrowPoints, points - threesMade * 3));

  let twoPointBudget = points - freeThrowPoints - threesMade * 3;
  if (twoPointBudget % 2 !== 0) {
    if (freeThrowPoints < points - threesMade * 3) {
      freeThrowPoints += 1;
    } else if (freeThrowPoints > 0) {
      freeThrowPoints -= 1;
    } else if (threesMade > 0) {
      threesMade -= 1;
      freeThrowPoints += 1;
    }
  }

  twoPointBudget = Math.max(0, points - freeThrowPoints - threesMade * 3);
  const twoPointMakes = Math.round(twoPointBudget / 2);
  const fieldGoalsMade = threesMade + twoPointMakes;
  const heavyUsagePenalty = clamp((points / Math.max(1, player.minutes) - 0.42) * 0.18, 0, 0.08);
  const opponentPressure = clamp((opponent.defense - 82) / 260, -0.03, 0.05);
  const shootingLuck = rng.normal(0, 0.055);
  const fieldGoalPercentage = clamp(
    0.45 + (player.efficiency - 82) * 0.0032 - heavyUsagePenalty - opponentPressure + shootingLuck,
    0.34,
    0.64,
  );
  const rawAttempts = Math.round(fieldGoalsMade / fieldGoalPercentage + rng.between(0, 2.4));
  const volumeCap = Math.round(player.minutes * rng.between(0.62, 0.92) + player.usage * 0.18 + points * 0.09);
  const fieldGoalsAttempted = Math.max(fieldGoalsMade, Math.min(rawAttempts, volumeCap));

  return { threesMade, fieldGoalsMade, fieldGoalsAttempted };
}
