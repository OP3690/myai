import { MessageCircle } from "lucide-react";
import type { LintReport } from "@/lib/linter";

// Pre-computed witty one-liners keyed by the lint-issue id that triggered the review.
// We pick whichever fires first based on the worst issue in the report.
const LINES: { id: string; text: string }[] = [
  {
    id: "too-short",
    text: "I've gotten more detail from a fortune cookie. What do you actually want?",
  },
  {
    id: "vague-opener",
    text: "“Can you please help me with...” — sure, with what exactly? Reading minds isn't on my résumé.",
  },
  {
    id: "missing-role",
    text: "No role set, so I'll just guess. Want me to answer as a chef? A neuroscientist? A 19-year-old marketing intern? Pick one.",
  },
  {
    id: "missing-format",
    text: "No format requested, so I'll produce 8 paragraphs. You'll hate them. We both know it.",
  },
  {
    id: "contradiction-0",
    text: "“Short but detailed.” That's like asking for hot ice. Pick a side.",
  },
  {
    id: "contradiction-1",
    text: "“Simple but technical.” I'll just split the difference and confuse everyone equally.",
  },
  {
    id: "weak-language",
    text: "Lots of “maybe” and “try to” in here. Bold of you to assume I have free will.",
  },
  {
    id: "politeness-fluff",
    text: "I appreciate the manners. I'd appreciate a concrete ask more.",
  },
  {
    id: "all-caps",
    text: "Stop yelling. I'm right here.",
  },
  {
    id: "no-clear-ask",
    text: "I read this three times. I'm not sure what you want me to do. Try a verb?",
  },
  {
    id: "missing-audience",
    text: "Should I explain like you're 5 or like you have a PhD? Throwing a dart.",
  },
  {
    id: "missing-length",
    text: "No length spec. I'll write 4,000 words. Just kidding. Maybe.",
  },
  {
    id: "multiple-asks",
    text: "Four asks in one prompt. I'll do the first two well and skim the rest.",
  },
  {
    id: "hallucination-trigger",
    text: "You asked for the “latest” and “everything” — buckle up for some confidently wrong answers.",
  },
  {
    id: "no-punctuation",
    text: "One run-on sentence. I'm parsing this like it's a string with no delimiters.",
  },
  {
    id: "missing-examples",
    text: "No example given. I'll invent one and you'll either love it or hate it.",
  },
];

const FALLBACK_GOOD = "Actually decent. I'll do my best work here.";
const FALLBACK_OK =
  "Workable. Not amazing. I'll produce something acceptable and you'll feel mildly disappointed.";

export function SnarkyReview({ report }: { report: LintReport }) {
  if (report.stats.words === 0) return null;

  // Find the first witty line that matches an issue in the report (priority: error → warning → info)
  const sorted = [...report.issues].sort((a, b) => sevRank(b.severity) - sevRank(a.severity));
  let line: string | null = null;
  for (const issue of sorted) {
    const m = LINES.find((l) => l.id === issue.id || issue.id.startsWith(l.id));
    if (m) {
      line = m.text;
      break;
    }
  }

  if (!line) {
    line = report.score >= 80 ? FALLBACK_GOOD : FALLBACK_OK;
  }

  return (
    <div className="rounded-xl border border-amber-400/20 bg-gradient-to-r from-amber-400/10 via-rose-400/5 to-transparent p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-7 w-7 flex-none place-items-center rounded-full bg-amber-400/20 ring-1 ring-amber-400/30">
          <MessageCircle className="h-3.5 w-3.5 text-amber-300" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            What the AI would say to your face
          </div>
          <p className="mt-1 text-sm leading-relaxed text-ink">&ldquo;{line}&rdquo;</p>
        </div>
      </div>
    </div>
  );
}

function sevRank(s: "error" | "warning" | "info"): number {
  if (s === "error") return 3;
  if (s === "warning") return 2;
  return 1;
}
