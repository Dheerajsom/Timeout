import type { Team } from "@/types/simulation";

export type TeamColors = {
  primary: string;
  secondary: string;
  accent: string;
};

export const defaultTeamColors: TeamColors = {
  primary: "#111827",
  secondary: "#374151",
  accent: "#f8fafc",
};

const colorsById: Record<string, TeamColors> = {
  "1967-76ers": { primary: "#ed174c", secondary: "#006bb6", accent: "#ffffff" },
  "1972-lakers": { primary: "#552583", secondary: "#fdb927", accent: "#ffffff" },
  "1983-76ers": { primary: "#ed174c", secondary: "#006bb6", accent: "#ffffff" },
  "1986-celtics": { primary: "#007a33", secondary: "#ba9653", accent: "#ffffff" },
  "1987-lakers": { primary: "#552583", secondary: "#fdb927", accent: "#ffffff" },
  "1989-pistons": { primary: "#c8102e", secondary: "#1d42ba", accent: "#bec0c2" },
  "1993-suns": { primary: "#1d1160", secondary: "#e56020", accent: "#f9ad1b" },
  "1995-magic": { primary: "#0077c0", secondary: "#c4ced4", accent: "#000000" },
  "1996-bulls": { primary: "#ce1141", secondary: "#111111", accent: "#ffffff" },
  "1996-sonics": { primary: "#00653a", secondary: "#ffc200", accent: "#ffffff" },
  "1997-jazz": { primary: "#002b5c", secondary: "#f9a01b", accent: "#00471b" },
  "1999-spurs": { primary: "#c4ced4", secondary: "#111111", accent: "#8a8d8f" },
  "2000-blazers": { primary: "#e03a3e", secondary: "#111111", accent: "#ffffff" },
  "2001-lakers": { primary: "#552583", secondary: "#fdb927", accent: "#ffffff" },
  "2002-kings": { primary: "#5a2d81", secondary: "#63727a", accent: "#ffffff" },
  "2003-spurs": { primary: "#c4ced4", secondary: "#111111", accent: "#8a8d8f" },
  "2004-pistons": { primary: "#c8102e", secondary: "#1d42ba", accent: "#bec0c2" },
  "2005-suns": { primary: "#1d1160", secondary: "#e56020", accent: "#f9ad1b" },
  "2006-heat": { primary: "#98002e", secondary: "#f9a01b", accent: "#111111" },
  "2007-mavericks": { primary: "#00538c", secondary: "#002b5e", accent: "#b8c4ca" },
  "2008-celtics": { primary: "#007a33", secondary: "#ba9653", accent: "#ffffff" },
  "2009-magic": { primary: "#0077c0", secondary: "#c4ced4", accent: "#000000" },
  "2010-lakers": { primary: "#552583", secondary: "#fdb927", accent: "#ffffff" },
  "2011-bulls": { primary: "#ce1141", secondary: "#111111", accent: "#ffffff" },
  "2011-mavericks": { primary: "#00538c", secondary: "#002b5e", accent: "#b8c4ca" },
  "2012-thunder": { primary: "#007ac1", secondary: "#ef3b24", accent: "#fdbb30" },
  "2013-heat": { primary: "#98002e", secondary: "#f9a01b", accent: "#111111" },
  "2014-spurs": { primary: "#c4ced4", secondary: "#111111", accent: "#8a8d8f" },
  "2015-warriors": { primary: "#1d428a", secondary: "#ffc72c", accent: "#ffffff" },
  "2016-cavaliers": { primary: "#6f263d", secondary: "#ffb81c", accent: "#041e42" },
  "2016-thunder": { primary: "#007ac1", secondary: "#ef3b24", accent: "#fdbb30" },
  "2017-warriors": { primary: "#1d428a", secondary: "#ffc72c", accent: "#ffffff" },
  "2018-rockets": { primary: "#ce1141", secondary: "#111111", accent: "#c4ced4" },
  "2019-raptors": { primary: "#ce1141", secondary: "#111111", accent: "#a1a1a4" },
  "2020-lakers": { primary: "#552583", secondary: "#fdb927", accent: "#ffffff" },
  "2021-bucks": { primary: "#00471b", secondary: "#eee1c6", accent: "#0077c0" },
  "2021-nets": { primary: "#111111", secondary: "#f5f5f5", accent: "#777777" },
  "2022-warriors": { primary: "#1d428a", secondary: "#ffc72c", accent: "#ffffff" },
  "2023-nuggets": { primary: "#0e2240", secondary: "#fec524", accent: "#8b2131" },
  "2024-celtics": { primary: "#007a33", secondary: "#ba9653", accent: "#ffffff" },
};

const colorsByFranchise: Record<string, TeamColors> = {
  "Atlanta Hawks": { primary: "#e03a3e", secondary: "#c1d32f", accent: "#26282a" },
  "Boston Celtics": { primary: "#007a33", secondary: "#ba9653", accent: "#ffffff" },
  "Brooklyn Nets": { primary: "#111111", secondary: "#f5f5f5", accent: "#777777" },
  "Charlotte Hornets": { primary: "#1d1160", secondary: "#00788c", accent: "#a1a1a4" },
  "Chicago Bulls": { primary: "#ce1141", secondary: "#111111", accent: "#ffffff" },
  "Cleveland Cavaliers": { primary: "#6f263d", secondary: "#ffb81c", accent: "#041e42" },
  "Dallas Mavericks": { primary: "#00538c", secondary: "#002b5e", accent: "#b8c4ca" },
  "Denver Nuggets": { primary: "#0e2240", secondary: "#fec524", accent: "#8b2131" },
  "Detroit Pistons": { primary: "#c8102e", secondary: "#1d42ba", accent: "#bec0c2" },
  "Golden State Warriors": { primary: "#1d428a", secondary: "#ffc72c", accent: "#ffffff" },
  "Houston Rockets": { primary: "#ce1141", secondary: "#111111", accent: "#c4ced4" },
  "Indiana Pacers": { primary: "#002d62", secondary: "#fdbb30", accent: "#bec0c2" },
  "LA Clippers": { primary: "#c8102e", secondary: "#1d428a", accent: "#bec0c2" },
  "Los Angeles Lakers": { primary: "#552583", secondary: "#fdb927", accent: "#ffffff" },
  "Memphis Grizzlies": { primary: "#5d76a9", secondary: "#12173f", accent: "#f5b112" },
  "Miami Heat": { primary: "#98002e", secondary: "#f9a01b", accent: "#111111" },
  "Milwaukee Bucks": { primary: "#00471b", secondary: "#eee1c6", accent: "#0077c0" },
  "Minnesota Timberwolves": { primary: "#0c2340", secondary: "#78be20", accent: "#236192" },
  "New Orleans Pelicans": { primary: "#0c2340", secondary: "#c8102e", accent: "#85714d" },
  "New York Knicks": { primary: "#006bb6", secondary: "#f58426", accent: "#bec0c2" },
  "Oklahoma City Thunder": { primary: "#007ac1", secondary: "#ef3b24", accent: "#fdbb30" },
  "Orlando Magic": { primary: "#0077c0", secondary: "#c4ced4", accent: "#111111" },
  "Philadelphia 76ers": { primary: "#ed174c", secondary: "#006bb6", accent: "#ffffff" },
  "Phoenix Suns": { primary: "#1d1160", secondary: "#e56020", accent: "#f9ad1b" },
  "Portland Trail Blazers": { primary: "#e03a3e", secondary: "#111111", accent: "#ffffff" },
  "Sacramento Kings": { primary: "#5a2d81", secondary: "#63727a", accent: "#ffffff" },
  "San Antonio Spurs": { primary: "#c4ced4", secondary: "#111111", accent: "#8a8d8f" },
  "Toronto Raptors": { primary: "#ce1141", secondary: "#111111", accent: "#a1a1a4" },
  "Utah Jazz": { primary: "#002b5c", secondary: "#f9a01b", accent: "#00471b" },
  "Washington Wizards": { primary: "#002b5c", secondary: "#e31837", accent: "#c4ced4" },
  // Historical franchises (1979-80 → 2013-14 pool)
  "Seattle SuperSonics": { primary: "#00653a", secondary: "#ffc200", accent: "#ffffff" },
  "Washington Bullets": { primary: "#002b5c", secondary: "#e31837", accent: "#c4ced4" },
  "New Jersey Nets": { primary: "#002a60", secondary: "#cd1041", accent: "#bec0c2" },
  "San Diego Clippers": { primary: "#c8102e", secondary: "#1d428a", accent: "#f9a01b" },
  "Kansas City Kings": { primary: "#1d428a", secondary: "#c8102e", accent: "#ffffff" },
  "Vancouver Grizzlies": { primary: "#00778b", secondary: "#1d1160", accent: "#bc7844" },
  "Charlotte Bobcats": { primary: "#f9423a", secondary: "#1d1160", accent: "#bec0c2" },
  "New Orleans Hornets": { primary: "#1d1160", secondary: "#00788c", accent: "#b4975a" },
  "New Orleans/Oklahoma City Hornets": { primary: "#1d1160", secondary: "#00788c", accent: "#b4975a" },
};

export function getTeamColors(team: Pick<Team, "id" | "franchise">): TeamColors {
  return colorsById[team.id] ?? colorsByFranchise[team.franchise] ?? defaultTeamColors;
}
