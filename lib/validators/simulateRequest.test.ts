import { describe, expect, it } from "vitest";
import { simulateRequestSchema } from "./simulateRequest";

const validRequest = {
  teamAId: "1996-bulls",
  teamBId: "2017-warriors",
  mode: "single_game",
  ruleset: "modern",
};

describe("simulateRequestSchema", () => {
  it("accepts valid simulation requests", () => {
    expect(simulateRequestSchema.safeParse(validRequest).success).toBe(true);
  });

  it("rejects non-slug team ids", () => {
    const result = simulateRequestSchema.safeParse({
      ...validRequest,
      teamAId: "../1996-bulls",
    });

    expect(result.success).toBe(false);
  });

  it("trims and bounds replay seeds", () => {
    const trimmed = simulateRequestSchema.safeParse({
      ...validRequest,
      seed: " replay-1 ",
    });
    const oversized = simulateRequestSchema.safeParse({
      ...validRequest,
      seed: "x".repeat(81),
    });

    expect(trimmed.success && trimmed.data.seed).toBe("replay-1");
    expect(oversized.success).toBe(false);
  });
});
