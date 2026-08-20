import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { SavedSimulation } from "@/types/simulation";
import { simulateGame } from "./simulation/simulateGame";
import { simulateSeries } from "./simulation/simulateSeries";
import { getTeamPair } from "./teams";
import { simulateRequestSchema, type SimulateRequest } from "./validators/simulateRequest";

const storePath = path.join(process.cwd(), "data", "simulations.json");
export const MAX_SIMULATION_ID_LENGTH = 512;

/** Ids minted before simulations became reproducible from the id itself. */
const legacyIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A decode only counts once it names two different teams and a replayable seed. */
type ReplayableRequest = SimulateRequest & { seed: string };

export async function saveSimulation(simulation: SavedSimulation) {
  return {
    ...simulation,
    id: encodeSimulationId(simulation),
  };
}

/**
 * Decoding an id re-runs the simulation, and every page that renders a result
 * asks for it at least twice (once in `generateMetadata`, once in the page
 * body). `cache` dedupes those calls within a single request so a best-of-7 is
 * replayed once instead of fourteen games twice over.
 */
export const getSimulation = cache(async function getSimulation(id: string) {
  if (!isSimulationIdWithinLimit(id)) {
    return null;
  }

  const decoded = decodeSimulationId(id);
  if (decoded) {
    return decoded;
  }

  // Only a legacy id can be in the file store, and reading it parses the whole
  // JSON — so don't touch disk for ids that could never match.
  if (!legacyIdPattern.test(id)) {
    return null;
  }

  const simulations = await readSimulations();
  return simulations.find((simulation) => simulation.id === id) ?? null;
});

function isSimulationIdWithinLimit(id: string) {
  return id.length > 0 && id.length <= MAX_SIMULATION_ID_LENGTH;
}

/**
 * The legacy file store is immutable at runtime, so parse it once per process.
 * Without this, any request for a UUID-shaped id — which anyone can send to
 * `/result/<uuid>` — re-reads and re-parses the whole file.
 */
let legacySimulations: Promise<SavedSimulation[]> | null = null;

function readSimulations(): Promise<SavedSimulation[]> {
  legacySimulations ??= readFile(storePath, "utf8")
    .then((raw) => JSON.parse(raw) as SavedSimulation[])
    .catch(() => []);

  return legacySimulations;
}

function encodeSimulationId(simulation: SavedSimulation) {
  const cleanId = encodeCleanSimulationId(simulation);

  if (cleanId) {
    return cleanId;
  }

  const payload = JSON.stringify({
    teamAId: simulation.teamAId,
    teamBId: simulation.teamBId,
    mode: simulation.mode,
    ruleset: simulation.ruleset,
    seed: simulation.seed,
  });

  return `sim_${Buffer.from(payload, "utf8").toString("base64url")}`;
}

function decodeSimulationId(id: string): SavedSimulation | null {
  const cleanSimulation = decodeCleanSimulationId(id);

  if (cleanSimulation) {
    return cleanSimulation;
  }

  if (!id.startsWith("sim_")) {
    return null;
  }

  try {
    const raw = Buffer.from(id.slice(4), "base64url").toString("utf8");
    return buildDecodedSimulation(id, JSON.parse(raw));
  } catch {
    return null;
  }
}

function encodeCleanSimulationId(simulation: SavedSimulation) {
  const safeSlug = /^[-a-z0-9]+$/;

  if (
    !safeSlug.test(simulation.teamAId) ||
    !safeSlug.test(simulation.teamBId) ||
    !safeSlug.test(simulation.seed) ||
    simulation.teamAId.includes("-vs-") ||
    simulation.teamBId.includes("-vs-")
  ) {
    return null;
  }

  const modeSlug = simulation.mode === "single_game" ? "game" : "series";
  return `${simulation.teamAId}-vs-${simulation.teamBId}__${modeSlug}__${simulation.ruleset}__${simulation.seed}`;
}

function decodeCleanSimulationId(id: string): SavedSimulation | null {
  const [matchup, modeSlug, ruleset, seed, ...extra] = id.split("__");

  if (!matchup || !modeSlug || !ruleset || !seed || extra.length) {
    return null;
  }

  const [teamAId, teamBId, ...matchupExtra] = matchup.split("-vs-");

  if (!teamAId || !teamBId || matchupExtra.length) {
    return null;
  }

  return buildDecodedSimulation(id, {
    teamAId,
    teamBId,
    mode: modeSlug === "game" ? "single_game" : modeSlug === "series" ? "best_of_7" : modeSlug,
    ruleset,
    seed,
  });
}

function toReplayableRequest(input: unknown): ReplayableRequest | null {
  const parsed = simulateRequestSchema.safeParse(input);

  if (!parsed.success || parsed.data.teamAId === parsed.data.teamBId || !parsed.data.seed) {
    return null;
  }

  return { ...parsed.data, seed: parsed.data.seed };
}

function buildDecodedSimulation(id: string, input: unknown): SavedSimulation | null {
  const parsed = toReplayableRequest(input);
  if (!parsed) {
    return null;
  }

  const pair = getTeamPair(parsed.teamAId, parsed.teamBId);
  if (!pair) {
    return null;
  }

  const result =
    parsed.mode === "single_game"
      ? simulateGame({ ...pair, ruleset: parsed.ruleset, seed: parsed.seed })
      : simulateSeries({ ...pair, ruleset: parsed.ruleset, seed: parsed.seed });

  return {
    id,
    teamAId: parsed.teamAId,
    teamBId: parsed.teamBId,
    mode: parsed.mode,
    ruleset: parsed.ruleset,
    seed: parsed.seed,
    result,
    createdAt: new Date(0).toISOString(),
  };
}
