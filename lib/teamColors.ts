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

export function getTeamColors(team: Team): TeamColors {
  return colorsById[team.id] ?? defaultTeamColors;
}
