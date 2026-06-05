import type { Ruleset } from "@/types/simulation";

export const rulesetModifiers: Record<
  Ruleset,
  {
    label: string;
    spacingMultiplier: number;
    threePointMultiplier: number;
    physicalityMultiplier: number;
    paceMultiplier: number;
  }
> = {
  modern: {
    label: "Modern",
    spacingMultiplier: 1.08,
    threePointMultiplier: 1.1,
    physicalityMultiplier: 0.95,
    paceMultiplier: 1.03,
  },
  physical_90s: {
    label: "Physical 90s",
    spacingMultiplier: 0.95,
    threePointMultiplier: 0.92,
    physicalityMultiplier: 1.1,
    paceMultiplier: 0.96,
  },
  early_2000s: {
    label: "Early 2000s",
    spacingMultiplier: 0.93,
    threePointMultiplier: 0.9,
    physicalityMultiplier: 1.08,
    paceMultiplier: 0.94,
  },
  bubble: {
    label: "Bubble",
    spacingMultiplier: 1.03,
    threePointMultiplier: 1.04,
    physicalityMultiplier: 0.98,
    paceMultiplier: 1.01,
  },
  neutral: {
    label: "Neutral",
    spacingMultiplier: 1,
    threePointMultiplier: 1,
    physicalityMultiplier: 1,
    paceMultiplier: 1,
  },
};

export const rulesetOptions = Object.entries(rulesetModifiers).map(([value, config]) => ({
  value: value as Ruleset,
  label: config.label,
}));

export const modeOptions = [
  { value: "single_game", label: "Single game" },
  { value: "best_of_7", label: "Best-of-7" },
] as const;
