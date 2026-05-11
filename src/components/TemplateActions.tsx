"use client";

import { useState } from "react";
import { CheckCircle2, Copy } from "lucide-react";

export function TemplateActions({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button onClick={copy} className="btn-primary">
        {copied ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copy better prompt
          </>
        )}
      </button>
      <span className="text-xs text-ink-fade">
        Tip: paste into the Prompt Fixer to tailor it for a specific model.
      </span>
    </div>
  );
}
