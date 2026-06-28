import { NextResponse } from "next/server";
import { getTeamPair } from "@/lib/teams";
import { createSeed } from "@/lib/simulation/rng";
import { simulateGame } from "@/lib/simulation/simulateGame";
import { simulateSeries } from "@/lib/simulation/simulateSeries";
import { saveSimulation } from "@/lib/simulationStore";
import { simulateRequestSchema } from "@/lib/validators/simulateRequest";

const MAX_SIMULATION_REQUEST_BYTES = 2048;

export async function POST(request: Request) {
  const body = await readRequestJson(request);

  if (!body.ok) {
    return body.response;
  }

  const parsed = simulateRequestSchema.safeParse(body.value);

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

async function readRequestJson(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_SIMULATION_REQUEST_BYTES) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Simulation request is too large." }, { status: 413 }),
    };
  }

  const rawBody = await request.text();
  const bodyBytes = new TextEncoder().encode(rawBody).byteLength;

  if (bodyBytes > MAX_SIMULATION_REQUEST_BYTES) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Simulation request is too large." }, { status: 413 }),
    };
  }

  try {
    return { ok: true as const, value: JSON.parse(rawBody) as unknown };
  } catch {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Invalid simulation request." }, { status: 400 }),
    };
  }
}
