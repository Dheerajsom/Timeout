import type { Team } from "@/types/simulation";
import { teams } from "./teams";

/**
 * Everything a client-side team picker renders, minus the rosters. Handing a
 * client component the full `Team[]` serializes ~1,300 rosters (13 ratings per
 * player) into the RSC payload — several megabytes per page — so the pickers
 * take this shape instead and simulate by id via POST /api/simulate.
 */
export type TeamSummary = Pick<
  Team,
  "id" | "name" | "season" | "franchise" | "wins" | "losses" | "styleSummary"
>;

export function toTeamSummary(team: Team): TeamSummary {
  return {
    id: team.id,
    name: team.name,
    season: team.season,
    franchise: team.franchise,
    wins: team.wins,
    losses: team.losses,
    styleSummary: team.styleSummary,
  };
}

/** Built once per process — the team pool is static. */
export const teamSummaries: TeamSummary[] = teams.map(toTeamSummary);
