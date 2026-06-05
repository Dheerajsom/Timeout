import { z } from "zod";

export const simulateRequestSchema = z.object({
  teamAId: z.string().min(1),
  teamBId: z.string().min(1),
  mode: z.enum(["single_game", "best_of_7"]),
  ruleset: z.enum(["modern", "physical_90s", "early_2000s", "bubble", "neutral"]),
  seed: z.string().min(1).optional(),
});

export type SimulateRequest = z.infer<typeof simulateRequestSchema>;
