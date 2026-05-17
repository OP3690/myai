"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Linkedin, Share2, Twitter } from "lucide-react";
import {
  TASK_TYPE_EMOJI,
  TASK_TYPE_LABEL,
  type TaskType,
} from "@/lib/autoFix";
import { events } from "@/lib/analytics";

const SITE = "https://fixaiprompt.com";

export function SharePromptFix({
  scoreBefore,
  scoreAfter,
  taskType,
}: {
  scoreBefore: number;
  scoreAfter: number;
  taskType: TaskType;
}) {
  const [copied, setCopied] = useState(false);
  const delta = Math.max(0, scoreAfter - scoreBefore);
  const pct = scoreBefore > 0 ? Math.round((delta / Math.max(scoreBefore, 1)) * 100) : 0;
  if (delta < 5) return null; // nothing brag-worthy

  const taskLabel = TASK_TYPE_LABEL[taskType];
  const taskEmoji = TASK_TYPE_EMOJI[taskType];

  const shareLine = `I just upgraded my AI prompt with @FixAIPrompt — score went from ${scoreBefore} → ${scoreAfter} (+${delta} pts${pct > 0 ? ", +" + pct + "%" : ""}) for a ${taskLabel} task.${"\n"}${SITE}`;
  const shareLineLong = `I just upgraded my AI prompt with FixAIPrompt — score went from ${scoreBefore} → ${scoreAfter} (+${delta} pts${pct > 0 ? ", +" + pct + "%" : ""}) for a ${taskLabel} task.${"\n\n"}It auto-detected the task type, rewrote with role/format/examples, and rendered Claude- and ChatGPT-ready versions. 100% in-browser, no API keys.${"\n\n"}${SITE}`;

  const tweetUrl =
    "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareLine);
  const linkedInUrl =
    "https://www.linkedin.com/sharing/share-offsite/?url=" +
    encodeURIComponent(SITE) +
    "&summary=" +
    encodeURIComponent(shareLineLong);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareLineLong);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      events.shareCardAction({ action: "copy", delta });
    } catch {}
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/15 via-accent/10 to-accent-cyan/15 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <Share2 className="h-3.5 w-3.5" />
            Brag-worthy fix · share it
          </div>
          <div className="text-sm text-ink">
            <span className="text-2xl">{taskEmoji}</span>{" "}
            <span className="font-mono text-rose-300">{scoreBefore}</span>
            <span className="mx-1 text-ink-fade">→</span>
            <span className="font-mono text-emerald-300">{scoreAfter}</span>
            <span className="ml-2 rounded-full border border-emerald-400/40 bg-emerald-400/20 px-2 py-0.5 text-xs font-bold text-emerald-200">
              +{delta} pts
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-dim">
            People love a score jump. Drop yours.
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={tweetUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => events.shareCardAction({ action: "x", delta })}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-black/60"
        >
          <Twitter className="h-3.5 w-3.5" />
          Share on X
        </a>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => events.shareCardAction({ action: "linkedin", delta })}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0a66c2]/30 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-[#0a66c2]/50"
        >
          <Linkedin className="h-3.5 w-3.5" />
          Share on LinkedIn
        </a>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-white/10"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy brag-text
            </>
          )}
        </button>
      </div>
    </div>
  );
}
