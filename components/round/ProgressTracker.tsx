import { Check } from "lucide-react";

const steps = ["Spin", "Choose", "Reveal", "Simulate", "Result"];

export function ProgressTracker({ current }: { current: number }) {
  return (
    <ol aria-label="Round progress" className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <li key={step} className="flex items-center gap-1.5 sm:gap-2">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className={`h-px w-3 sm:w-6 ${done || active ? "bg-orange-500/70" : "bg-white/12"}`}
              />
            ) : null}
            <span
              aria-current={active ? "step" : undefined}
              className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] transition sm:px-2.5 sm:text-[11px] ${
                active
                  ? "border-orange-400/70 bg-orange-500/15 text-orange-200"
                  : done
                    ? "border-white/15 bg-white/5 text-white/70"
                    : "border-white/10 text-white/35"
              }`}
            >
              {done ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
              <span className={active ? "" : "hidden sm:inline"}>{step}</span>
              {!active && !done ? <span className="sm:hidden">{index + 1}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
