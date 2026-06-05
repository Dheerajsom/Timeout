import { HomeGame } from "@/components/HomeGame";
import { teams } from "@/lib/teams";

export default function Home() {
  return <HomeGame teams={teams} />;
}
