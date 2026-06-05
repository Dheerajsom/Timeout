import type { Ruleset } from "@/types/simulation";
import { rulesetModifiers } from "@/lib/simulation/constants";

export function RulesetBadge({ ruleset }: { ruleset: Ruleset }) {
  return (
    <span className="inline-flex items-center rounded border border-teal/30 bg-teal/10 px-2 py-1 text-xs font-medium text-teal">
      {rulesetModifiers[ruleset].label}
    </span>
  );
}
