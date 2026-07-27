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

function rejectRequest(status: number, error: string) {
  return { ok: false as const, response: NextResponse.json({ error }, { status }) };
}

const tooLarge = () => rejectRequest(413, "Simulation request is too large.");
const malformed = () => rejectRequest(400, "Invalid simulation request.");

async function readRequestJson(request: Request) {
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();

  if (mediaType !== "application/json") {
    return rejectRequest(415, "Content-Type must be application/json.");
  }

  // Check the advertised length first so an oversized body can be turned away
  // before it is read into memory.
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_SIMULATION_REQUEST_BYTES) {
    return tooLarge();
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return malformed();
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_SIMULATION_REQUEST_BYTES) {
    return tooLarge();
  }

  try {
    return { ok: true as const, value: JSON.parse(rawBody) as unknown };
  } catch {
    return malformed();
  }
}
