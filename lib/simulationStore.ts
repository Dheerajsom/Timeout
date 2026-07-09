import { readFile } from "node:fs/promises";
import path from "node:path";
import type { SavedSimulation } from "@/types/simulation";
import { simulateGame } from "./simulation/simulateGame";
import { simulateSeries } from "./simulation/simulateSeries";
import { getTeamPair } from "./teams";
import { simulateRequestSchema } from "./validators/simulateRequest";

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "simulations.json");
export const MAX_SIMULATION_ID_LENGTH = 512;

export async function saveSimulation(simulation: SavedSimulation) {
  return {
    ...simulation,
    id: encodeSimulationId(simulation),
  };
}

export async function getSimulation(id: string) {
  if (!isSimulationIdWithinLimit(id)) {
    return null;
  }

  const decoded = decodeSimulationId(id);
  if (decoded) {
    return decoded;
  }

  const simulations = await readSimulations();
  return simulations.find((simulation) => simulation.id === id) ?? null;
}

function isSimulationIdWithinLimit(id: string) {
  return id.length > 0 && id.length <= MAX_SIMULATION_ID_LENGTH;
}

export async function readSimulations(): Promise<SavedSimulation[]> {
  try {
    const raw = await readFile(storePath, "utf8");
    return JSON.parse(raw) as SavedSimulation[];
  } catch {
    return [];
  }
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
    const parsed = simulateRequestSchema.safeParse(JSON.parse(raw));

    if (!parsed.success || parsed.data.teamAId === parsed.data.teamBId || !parsed.data.seed) {
      return null;
    }

    return buildDecodedSimulation(id, { ...parsed.data, seed: parsed.data.seed });
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

  const parsed = simulateRequestSchema.safeParse({
    teamAId,
    teamBId,
    mode: modeSlug === "game" ? "single_game" : modeSlug === "series" ? "best_of_7" : modeSlug,
    ruleset,
    seed,
  });

  if (!parsed.success || parsed.data.teamAId === parsed.data.teamBId || !parsed.data.seed) {
    return null;
  }

  return buildDecodedSimulation(id, { ...parsed.data, seed: parsed.data.seed });
}

function buildDecodedSimulation(
  id: string,
  parsed: {
    teamAId: string;
    teamBId: string;
    mode: "single_game" | "best_of_7";
    ruleset: "modern" | "physical_90s" | "early_2000s" | "bubble" | "neutral";
    seed: string;
  },
) {
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
