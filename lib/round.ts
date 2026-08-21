import type { Team } from "@/types/simulation";

/**
 * Slimmed team shape shipped to the round client. The full `Team` (with
 * complete rosters) stays on the server; the simulation runs by id via
 * POST /api/simulate.
 */
export type RoundTeam = {
  id: string;
  franchise: string;
  season: string;
  wins: number;
  losses: number;
  offense: number;
  defense: number;
  pace: number;
  rebounding: number;
  benchDepth: number;
  starPower: number;
  stars: string[];
  identity: string;
  overall: number;
};

export function toRoundTeam(team: Team): RoundTeam {
  return {
    id: team.id,
    franchise: team.franchise,
    season: team.season,
    wins: team.wins,
    losses: team.losses,
    offense: team.offense,
    defense: team.defense,
    pace: team.pace,
    rebounding: team.rebounding,
    benchDepth: team.benchDepth,
    starPower: team.starPower,
    stars: topStars(team),
    identity: identityTag(team),
    overall: overallRating(team),
  };
}

function topStars(team: Team, count = 3) {
  return [...team.players]
    .sort((a, b) => b.scoring * 0.7 + b.usage * 0.3 - (a.scoring * 0.7 + a.usage * 0.3))
    .slice(0, count)
    .map((player) => player.name);
}

export function overallRating(team: Pick<Team, "offense" | "defense" | "starPower" | "benchDepth">) {
  const composite =
    team.offense * 0.34 + team.defense * 0.34 + team.starPower * 0.2 + team.benchDepth * 0.12;
  return Math.min(99, Math.round(composite));
}

export function winPct(team: Pick<Team, "wins" | "losses">) {
  const games = team.wins + team.losses;
  return games > 0 ? team.wins / games : 0.5;
}

/** Win rate for broadcast display, e.g. ".723". */
export function formatWinPct(team: Pick<Team, "wins" | "losses">) {
  return winPct(team).toFixed(3).replace(/^0/, "");
}

/** Short broadcast-style identity tag derived from the rating profile. */
export function identityTag(team: Team) {
  const pct = winPct(team);

  if (team.starPower >= 94 && pct >= 0.72) return "Dynasty core";
  if (team.defense >= 92) return "Elite defense";
  if (team.spacing >= 90 && team.pace >= 88) return "Pace and space";
  if (team.rimPressure >= 92) return "Downhill attack";
  if (team.physicality >= 92) return "Smashmouth ball";
  if (team.playmaking >= 92) return "Ball movement";
  if (team.starPower >= 92) return "Star-driven contender";
  if (team.benchDepth >= 90) return "Ten deep";
  if (team.clutch >= 92) return "Built for close games";
  if (team.pace >= 92) return "Run and gun";
  if (team.offense >= 92) return "Offensive juggernaut";
  if (pct >= 0.7) return "Proven winner";
  return "Balanced squad";
}

// With ~1,300 teams in the pool, a flat random draw almost always surfaces obscure
// also-rans. Weight the draw toward stronger, star-driven squads (more fun matchups)
// while keeping every team reachable via the floor.
function teamWeight(team: RoundTeam) {
  return Math.max(0.15, winPct(team) ** 1.5 * (team.starPower / 100));
}

export function drawTeams(pool: RoundTeam[], count: number) {
  const copy = [...pool];
  const weights = copy.map(teamWeight);
  const drawn: RoundTeam[] = [];

  while (drawn.length < count && copy.length) {
    let total = 0;
    for (const weight of weights) total += weight;

    let threshold = Math.random() * total;
    let index = 0;
    while (index < copy.length - 1 && (threshold -= weights[index]) > 0) index += 1;

    drawn.push(copy[index]);
    copy.splice(index, 1);
    weights.splice(index, 1);
  }

  return drawn;
}

const teamInitialsByFranchise: Record<string, string> = {
  "Atlanta Hawks": "ATL",
  "Boston Celtics": "BOS",
  "Brooklyn Nets": "BKN",
  "Charlotte Hornets": "CHA",
  "Chicago Bulls": "CHI",
  "Cleveland Cavaliers": "CLE",
  "Dallas Mavericks": "DAL",
  "Denver Nuggets": "DEN",
  "Detroit Pistons": "DET",
  "Golden State Warriors": "GSW",
  "Houston Rockets": "HOU",
  "Indiana Pacers": "IND",
  "LA Clippers": "LAC",
  "Los Angeles Lakers": "LAL",
  "Memphis Grizzlies": "MEM",
  "Miami Heat": "MIA",
  "Milwaukee Bucks": "MIL",
  "Minnesota Timberwolves": "MIN",
  "New Orleans Pelicans": "NOP",
  "New York Knicks": "NYK",
  "Oklahoma City Thunder": "OKC",
  "Orlando Magic": "ORL",
  "Philadelphia 76ers": "PHI",
  "Phoenix Suns": "PHX",
  "Portland Trail Blazers": "POR",
  "Sacramento Kings": "SAC",
  "San Antonio Spurs": "SAS",
  "Seattle SuperSonics": "SEA",
  "Toronto Raptors": "TOR",
  "Utah Jazz": "UTA",
  "Washington Wizards": "WAS",
  "Washington Bullets": "WSB",
  "New Jersey Nets": "NJN",
  "San Diego Clippers": "SDC",
  "Kansas City Kings": "KCK",
  "Vancouver Grizzlies": "VAN",
  "Charlotte Bobcats": "CHA",
  "New Orleans Hornets": "NOH",
  "New Orleans/Oklahoma City Hornets": "NOK",
};

export function getTeamInitials(franchise: string) {
  return (
    teamInitialsByFranchise[franchise] ??
    franchise
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase()
  );
}
