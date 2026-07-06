"use client";

import { useEffect, useState } from "react";
import { FolderLock } from "lucide-react";

const spinStatuses = ["Searching eras", "Pulling roster", "Locking squad"];

/**
 * Sealed scouting file for one of the three squad slots. In the ready state it
 * sits closed; while spinning it cycles candidate team labels like a scout
 * flipping through film.
 */
export function MysteryCard({
  index,
  spinning,
  sample,
}: {
  index: number;
  spinning: boolean;
  sample: string[];
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!spinning || sample.length === 0) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 95);

    return () => window.clearInterval(interval);
  }, [spinning, sample]);

  const label = sample.length ? sample[tick % sample.length] : "";
  const status = spinStatuses[index % spinStatuses.length];

  return (
    <div className="mystery-stripes relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-lg border border-white/12 p-4 sm:min-h-[248px]">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/45">
          Squad file {String(index + 1).padStart(2, "0")}
        </span>
        <FolderLock className="h-4 w-4 text-orange-400/80" aria-hidden="true" />
      </div>

      <div className="text-center">
        {spinning ? (
          <>
            <div className="shuffle-flicker mx-auto min-h-[3.25rem] max-w-[16rem] font-display text-2xl font-bold uppercase leading-tight text-white/80">
              {label}
            </div>
            <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-orange-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" aria-hidden="true" />
              {status}&hellip;
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 font-display text-xl font-bold text-white/70">
              {index + 1}
            </div>
            <div className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-white/45">
              Sealed
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
        <span>Era unknown</span>
        <span>Timeout scouting</span>
      </div>
    </div>
  );
}
