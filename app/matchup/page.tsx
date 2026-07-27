import type { Metadata } from "next";
import { CustomMatchup } from "@/components/CustomMatchup";
import { teamSummaries } from "@/lib/teamSummary";

export const metadata: Metadata = {
  title: "Custom Matchup | Timeout",
  description: "Pick any two squads from any era and simulate the matchup yourself.",
};

export default function MatchupPage() {
  return <CustomMatchup teams={teamSummaries} />;
}
