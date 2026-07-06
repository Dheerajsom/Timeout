import { teams } from "@/lib/teams";
import { toRoundTeam, winPct, type RoundTeam } from "@/lib/round";
import { RoundStage } from "@/components/round/RoundStage";
import { CrossEraBand, EraArchive, HowItWorks, type EraSummary } from "@/components/home/HomeSections";
import { RecentMatchups } from "@/components/home/RecentMatchups";

export default function Home() {
  const roundTeams = teams.map(toRoundTeam);
  const eras = buildEraSummaries(roundTeams);
  const seasons = teams.map((team) => Number.parseInt(team.season, 10)).filter(Number.isFinite);
  const seasonSpan = `${Math.min(...seasons)}–${Math.max(...seasons)}`;

  return (
    <main className="relative px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <RoundStage teams={roundTeams} />
      <HowItWorks />
      <CrossEraBand teamCount={teams.length} seasonSpan={seasonSpan} />
      <RecentMatchups />
      <EraArchive eras={eras} />
    </main>
  );
}

function buildEraSummaries(roundTeams: RoundTeam[]): EraSummary[] {
  const byDecade = new Map<number, RoundTeam[]>();

  for (const team of roundTeams) {
    const year = Number.parseInt(team.season, 10);
    if (!Number.isFinite(year)) continue;
    const decade = Math.floor(year / 10) * 10;
    const bucket = byDecade.get(decade);
    if (bucket) {
      bucket.push(team);
    } else {
      byDecade.set(decade, [team]);
    }
  }

  return [...byDecade.entries()]
    .sort(([a], [b]) => a - b)
    .map(([decade, bucket]) => {
      const marquee = [...bucket]
        .sort((a, b) => b.starPower * winPct(b) - a.starPower * winPct(a))
        .slice(0, 3)
        .map((team) => `${team.season} ${team.franchise}`);

      return {
        label: `${decade}s`,
        teamCount: bucket.length,
        marquee,
      };
    });
}
