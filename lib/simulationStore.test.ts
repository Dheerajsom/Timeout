import { describe, expect, it } from "vitest";
import { getSimulation, MAX_SIMULATION_ID_LENGTH } from "./simulationStore";

describe("getSimulation", () => {
  it("rejects oversized route ids before attempting to decode or load them", async () => {
    await expect(getSimulation("x".repeat(MAX_SIMULATION_ID_LENGTH + 1))).resolves.toBeNull();
  });
});
