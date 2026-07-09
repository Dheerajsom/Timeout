import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/simulate", () => {
  it("requires a JSON content type before parsing the request body", async () => {
    const response = await POST(
      new Request("http://localhost/api/simulate", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toEqual({ error: "Content-Type must be application/json." });
  });

  it("rejects malformed JSON with a client error", async () => {
    const response = await POST(
      new Request("http://localhost/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: "{",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid simulation request." });
  });

  it("accepts a well-formed simulation request", async () => {
    const response = await POST(
      new Request("http://localhost/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamAId: "1996-bulls",
          teamBId: "2017-warriors",
          mode: "single_game",
          ruleset: "modern",
          seed: "audit-seed",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      simulationId: "1996-bulls-vs-2017-warriors__game__modern__audit-seed",
      result: { type: "single_game" },
    });
  });

  it("enforces the simulation request body limit", async () => {
    const response = await POST(
      new Request("http://localhost/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ padding: "x".repeat(2048) }),
      }),
    );

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({ error: "Simulation request is too large." });
  });
});
