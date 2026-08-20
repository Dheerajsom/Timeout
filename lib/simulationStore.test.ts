import { describe, expect, it } from "vitest";
import { getSimulation, MAX_SIMULATION_ID_LENGTH, saveSimulation } from "./simulationStore";
import type { SavedSimulation } from "@/types/simulation";
import { getTeamPair } from "./teams";
import { simulateGame } from "./simulation/simulateGame";

const baseSimulation: Omit<SavedSimulation, "result"> = {
  id: "ignored-at-encode-time",
  teamAId: "1996-bulls",
  teamBId: "2017-warriors",
  mode: "single_game",
  ruleset: "modern",
  seed: "replay-seed",
  createdAt: new Date(0).toISOString(),
};

function buildSimulation(overrides: Partial<SavedSimulation> = {}): SavedSimulation {
  const merged = { ...baseSimulation, ...overrides };
  const pair = getTeamPair(merged.teamAId, merged.teamBId)!;
  return {
    ...merged,
    result: simulateGame({ ...pair, ruleset: merged.ruleset, seed: merged.seed }),
  };
}

describe("getSimulation", () => {
  it("rejects oversized route ids before attempting to decode or load them", async () => {
    await expect(getSimulation("x".repeat(MAX_SIMULATION_ID_LENGTH + 1))).resolves.toBeNull();
  });

  it("reproduces the exact result from a readable id", async () => {
    const simulation = buildSimulation();
    const { id } = await saveSimulation(simulation);

    expect(id).toBe("1996-bulls-vs-2017-warriors__game__modern__replay-seed");
    await expect(getSimulation(id)).resolves.toMatchObject({
      teamAId: simulation.teamAId,
      teamBId: simulation.teamBId,
      mode: "single_game",
      ruleset: "modern",
      seed: "replay-seed",
      result: simulation.result,
    });
  });

  it("reproduces the exact result from a base64url fallback id", async () => {
    // An uppercase seed cannot go in a readable slug, so encoding falls back.
    const simulation = buildSimulation({ seed: "Replay-Seed" });
    const { id } = await saveSimulation(simulation);

    expect(id.startsWith("sim_")).toBe(true);
    await expect(getSimulation(id)).resolves.toMatchObject({ result: simulation.result });
  });

  it("round-trips a best-of-7 series id", async () => {
    const { id } = await saveSimulation(buildSimulation({ mode: "best_of_7" }));

    expect(id).toBe("1996-bulls-vs-2017-warriors__series__modern__replay-seed");
    await expect(getSimulation(id)).resolves.toMatchObject({ mode: "best_of_7" });
  });

  it.each([
    ["an unknown team", "no-such-team-vs-2017-warriors__game__modern__seed"],
    ["a repeated team", "1996-bulls-vs-1996-bulls__game__modern__seed"],
    ["an unknown ruleset", "1996-bulls-vs-2017-warriors__game__space-jam__seed"],
    ["an unknown mode", "1996-bulls-vs-2017-warriors__scrimmage__modern__seed"],
    ["a missing seed", "1996-bulls-vs-2017-warriors__game__modern__"],
    ["extra id segments", "1996-bulls-vs-2017-warriors__game__modern__seed__extra"],
    ["undecodable base64", "sim_!!!!"],
    ["an id that matches nothing", "not-an-id"],
  ])("returns null for %s", async (_label, id) => {
    await expect(getSimulation(id)).resolves.toBeNull();
  });
});
