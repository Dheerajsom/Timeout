import { NextResponse } from "next/server";
import { getTeamPair } from "@/lib/teams";
import { createSeed } from "@/lib/simulation/rng";
import { simulateGame } from "@/lib/simulation/simulateGame";
import { simulateSeries } from "@/lib/simulation/simulateSeries";
import { saveSimulation } from "@/lib/simulationStore";
import { simulateRequestSchema } from "@/lib/validators/simulateRequest";

export async function POST(request: Request) {
  const parsed = simulateRequestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid simulation request." }, { status: 400 });
  }

  const { teamAId, teamBId, mode, ruleset } = parsed.data;
  const seed = parsed.data.seed ?? createSeed();

  if (teamAId === teamBId) {
    return NextResponse.json({ error: "Choose two different teams." }, { status: 400 });
  }

  const pair = getTeamPair(teamAId, teamBId);
  if (!pair) {
    return NextResponse.json({ error: "One or both teams could not be found." }, { status: 404 });
  }

  const result =
    mode === "single_game"
      ? simulateGame({ ...pair, ruleset, seed })
      : simulateSeries({ ...pair, ruleset, seed });

  const simulation = await saveSimulation({
    id: crypto.randomUUID(),
    teamAId,
    teamBId,
    mode,
    ruleset,
    seed,
    result,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    simulationId: simulation.id,
    result,
  });
}
