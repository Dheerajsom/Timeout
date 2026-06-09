"use client";

import { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareButton({ simulationId, className }: { simulationId: string; className?: string }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  useEffect(() => {
    const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
    const origin = configuredOrigin || window.location.origin;
    setShareUrl(new URL(`/share/${simulationId}`, origin).toString());
  }, [simulationId]);

  async function copyShareUrl() {
    if (!shareUrl) {
      return;
    }

    setCopyFailed(false);

    try {
      await navigator.clipboard.writeText(shareUrl);
      showCopied();
      return;
    } catch {
      if (copyWithTemporarySelection(shareUrl)) {
        showCopied();
        return;
      }

      setCopyFailed(true);
    }
  }

  function showCopied() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <span className="relative inline-flex flex-col items-stretch gap-1">
      <button
        type="button"
        onClick={copyShareUrl}
        disabled={!shareUrl}
        className={className}
        data-share-url={shareUrl}
        data-testid="share-button"
      >
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
        Share
      </button>
      <span className="min-h-4 text-center text-[11px] font-black uppercase tracking-[0.12em] text-orange-100/78" aria-live="polite">
        {copied ? "Link copied" : copyFailed ? "Copy blocked" : ""}
      </span>
    </span>
  );
}

function copyWithTemporarySelection(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "0";
  textarea.style.top = "0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}
