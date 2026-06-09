"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { buildShareSummary } from "@/lib/shareSummary";
import type { SimulatedGame, SimulatedSeries } from "@/types/simulation";

export function ShareResult({ result }: { result: SimulatedGame | SimulatedSeries }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const shareTextRef = useRef<HTMLTextAreaElement>(null);
  const summary = useMemo(() => buildShareSummary(result, shareUrl), [result, shareUrl]);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  async function copyShareLink() {
    setCopyFailed(false);

    try {
      await navigator.clipboard.writeText(summary.copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      return;
    } catch {
      const fallback = shareTextRef.current;
      fallback?.focus();
      fallback?.select();

      if (fallback && document.execCommand("copy")) {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
        return;
      }

      setCopyFailed(true);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-md border border-orange-100/18 bg-[#15100b] p-4 shadow-[0_18px_48px_rgba(36,20,8,0.34)] sm:p-5">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#fb923c,#facc15,#14b8a6)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(249,115,22,0.18),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_48%)]" aria-hidden="true" />
      <div className="relative grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-black/22 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-orange-100">
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share Result
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md px-3 py-1.5 text-sm font-black uppercase ${
                summary.pickedWon ? "bg-emerald-300 text-emerald-950" : "bg-rose-300 text-rose-950"
              }`}
            >
              {summary.resultLabel}
            </span>
            <span className="text-lg font-black text-white">
              {summary.pickedTeamLabel} vs {summary.opponentTeamLabel}
            </span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <ShareStat label={result.type === "single_game" ? "Final" : "Series"} value={summary.scoreLabel} />
            <ShareStat label="MVP" value={summary.mvpLine} />
          </div>
        </div>

        <div className="grid gap-2 lg:min-w-[380px]">
          <textarea
            ref={shareTextRef}
            readOnly
            aria-label="Share message"
            value={summary.copyText}
            rows={4}
            onFocus={(event) => event.currentTarget.select()}
            className="min-h-[116px] resize-none rounded-md border border-white/12 bg-black/26 px-3 py-3 text-sm font-semibold leading-5 text-orange-50/86 outline-none transition placeholder:text-orange-50/40 focus:border-orange-300"
          />
          <button
            type="button"
            onClick={copyShareLink}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-black uppercase text-white shadow-[0_0_24px_rgba(249,115,22,0.38),0_12px_28px_rgba(255,107,0,0.24)] transition hover:bg-orange-400"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? "Copied" : "Copy Share Link"}
          </button>
          {copyFailed ? (
            <div className="text-xs font-bold text-orange-100/78">
              Clipboard blocked; share message selected.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ShareStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-orange-100/12 bg-white/[0.06] px-3 py-2.5">
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-orange-100/68">{label}</div>
      <div className="mt-1 text-sm font-black leading-5 text-white">{value}</div>
    </div>
  );
}
