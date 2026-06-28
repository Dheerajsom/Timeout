import { z } from "zod";

const teamIdSchema = z.string().min(1).max(80).regex(/^[a-z0-9-]+$/);
const seedSchema = z.string().trim().min(1).max(80);

export const simulateRequestSchema = z.object({
  teamAId: teamIdSchema,
  teamBId: teamIdSchema,
  mode: z.enum(["single_game", "best_of_7"]),
  ruleset: z.enum(["modern", "physical_90s", "early_2000s", "bubble", "neutral"]),
  seed: seedSchema.optional(),
});

export type SimulateRequest = z.infer<typeof simulateRequestSchema>;
