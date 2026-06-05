import { readFile } from "node:fs/promises";
import path from "node:path";
import type { SavedSimulation } from "@/types/simulation";
import { simulateGame } from "./simulation/simulateGame";
import { simulateSeries } from "./simulation/simulateSeries";
import { getTeamPair } from "./teams";
import { simulateRequestSchema } from "./validators/simulateRequest";

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "simulations.json");

export async function saveSimulation(simulation: SavedSimulation) {
  return {
    ...simulation,
    id: encodeSimulationId(simulation),
  };
}

export async function getSimulation(id: string) {
  const decoded = decodeSimulationId(id);
  if (decoded) {
    return decoded;
  }

  const simulations = await readSimulations();
  return simulations.find((simulation) => simulation.id === id) ?? null;
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
  if (!id.startsWith("sim_")) {
    return null;
  }

  try {
    const raw = Buffer.from(id.slice(4), "base64url").toString("utf8");
    const parsed = simulateRequestSchema.safeParse(JSON.parse(raw));

    if (!parsed.success || parsed.data.teamAId === parsed.data.teamBId || !parsed.data.seed) {
      return null;
    }

    const pair = getTeamPair(parsed.data.teamAId, parsed.data.teamBId);
    if (!pair) {
      return null;
    }

    const result =
      parsed.data.mode === "single_game"
        ? simulateGame({ ...pair, ruleset: parsed.data.ruleset, seed: parsed.data.seed })
        : simulateSeries({ ...pair, ruleset: parsed.data.ruleset, seed: parsed.data.seed });

    return {
      id,
      teamAId: parsed.data.teamAId,
      teamBId: parsed.data.teamBId,
      mode: parsed.data.mode,
      ruleset: parsed.data.ruleset,
      seed: parsed.data.seed,
      result,
      createdAt: new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
}
