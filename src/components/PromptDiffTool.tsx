"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  CheckCircle2,
  Copy,
  Crown,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  METRICS,
  METRIC_LABEL,
  lintPrompt,
  metricColor,
  metricTextColor,
  type Metric,
} from "@/lib/linter";
import {
  TASK_TYPE_EMOJI,
  TASK_TYPE_LABEL,
  detectTaskType,
} from "@/lib/autoFix";
import { events } from "@/lib/analytics";

const SAMPLE_A = "write a blog post about AI";
const SAMPLE_B =
  "Act as a senior tech writer who has shipped 100+ blog posts. Write a 600-word blog post about Large Language Models for an intermediate-developer audience. Open with a contrarian claim or specific scene. Use 3 short paragraphs, one concrete example per paragraph, no emojis, no hashtags. End with a question that begs a reply.";

export function PromptDiffTool() {
  const [a, setA] = useState<string>("");
  const [b, setB] = useState<string>("");
  const [copied, setCopied] = useState<"none" | "a" | "b">("none");

  const reportA = useMemo(() => lintPrompt(a), [a]);
  const reportB = useMemo(() => lintPrompt(b), [b]);
  const taskA = useMemo(() => detectTaskType(a), [a]);
  const taskB = useMemo(() => detectTaskType(b), [b]);

  const bothFilled = a.trim().length > 0 && b.trim().length > 0;

  const winner = useMemo(() => {
    if (!bothFilled) return null;
    if (reportA.score === reportB.score) return "tie";
    return reportA.score > reportB.score ? "a" : "b";
  }, [bothFilled, reportA.score, reportB.score]);

  const metricWins = useMemo(() => {
    const out: Record<Metric, "a" | "b" | "tie"> = {} as any;
    if (!bothFilled) return out;
    for (const m of METRICS) {
      if (reportA.metrics[m] === reportB.metrics[m]) out[m] = "tie";
      else out[m] = reportA.metrics[m] > reportB.metrics[m] ? "a" : "b";
    }
    return out;
  }, [bothFilled, reportA.metrics, reportB.metrics]);

  async function copyPrompt(which: "a" | "b") {
    const v = which === "a" ? a : b;
    try {
      await navigator.clipboard.writeText(v);
      setCopied(which);
      setTimeout(() => setCopied("none"), 1500);
      events.promptDiffCopied({ which });
    } catch {}
  }

  function tryFromSamples() {
    setA(SAMPLE_A);
    setB(SAMPLE_B);
    events.promptDiffSampleLoaded();
  }

  // Fire compared event once both prompts are filled and stable for ~1s.
  const comparedRef = useRef<string>("");
  useEffect(() => {
    if (!bothFilled || !winner) return;
    const key = `${a.length}|${b.length}|${winner}`;
    if (comparedRef.current === key) return;
    const t = setTimeout(() => {
      comparedRef.current = key;
      events.promptDiffCompared({
        winner: winner as "a" | "b" | "tie",
        score_a: reportA.score,
        score_b: reportB.score,
        task_a: taskA,
        task_b: taskB,
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [bothFilled, winner, a, b, reportA.score, reportB.score, taskA, taskB]);

  function swap() {
    setA(b);
    setB(a);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <PromptInput
          which="a"
          value={a}
          onChange={setA}
          report={reportA}
          taskType={taskA}
          isWinner={winner === "a"}
          onCopy={() => copyPrompt("a")}
          copied={copied === "a"}
        />
        <PromptInput
          which="b"
          value={b}
          onChange={setB}
          report={reportB}
          taskType={taskB}
          isWinner={winner === "b"}
          onCopy={() => copyPrompt("b")}
          copied={copied === "b"}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={tryFromSamples}
          className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200 transition hover:bg-violet-400/20"
        >
          <Sparkles className="h-3.5 w-3.5" /> Try with samples
        </button>
        <button
          onClick={swap}
          disabled={!a && !b}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink-dim transition hover:bg-white/10 hover:text-ink disabled:opacity-40"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" /> Swap A ↔ B
        </button>
        <button
          onClick={() => {
            setA("");
            setB("");
          }}
          disabled={!a && !b}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink-dim transition hover:bg-white/10 hover:text-ink disabled:opacity-40"
        >
          Clear both
        </button>
      </div>

      {bothFilled && (
        <div className="card relative overflow-hidden p-5 sm:p-6">
          <div
            className={`absolute inset-0 -z-10 bg-gradient-to-br ${
              winner === "a"
                ? "from-emerald-500/15 via-transparent to-accent/10"
                : winner === "b"
                ? "from-accent/15 via-transparent to-cyan-500/10"
                : "from-amber-500/10 via-transparent to-amber-500/5"
            }`}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Trophy className="h-5 w-5 text-amber-300" />
            <h3 className="text-base font-bold text-ink sm:text-lg">
              {winner === "tie" ? "It's a tie." : `Prompt ${winner?.toUpperCase()} wins.`}
            </h3>
            <span className="text-sm text-ink-dim">
              {reportA.score} vs {reportB.score} on overall clarity score
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-5">
            {METRICS.map((m) => (
              <MetricCompare
                key={m}
                metric={m}
                a={reportA.metrics[m]}
                b={reportB.metrics[m]}
                winner={metricWins[m]}
              />
            ))}
          </div>

          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <DiffPoint
              label="Detected task"
              a={`${TASK_TYPE_EMOJI[taskA]} ${TASK_TYPE_LABEL[taskA]}`}
              b={`${TASK_TYPE_EMOJI[taskB]} ${TASK_TYPE_LABEL[taskB]}`}
            />
            <DiffPoint
              label="Words"
              a={String(reportA.stats.words)}
              b={String(reportB.stats.words)}
            />
            <DiffPoint
              label="Issues found"
              a={`${reportA.issues.length} issue${reportA.issues.length === 1 ? "" : "s"}`}
              b={`${reportB.issues.length} issue${reportB.issues.length === 1 ? "" : "s"}`}
            />
            <DiffPoint
              label="Sentences"
              a={String(reportA.stats.sentences)}
              b={String(reportB.stats.sentences)}
            />
          </div>

          {winner !== "tie" && (
            <div className="mt-5 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-sm text-ink-dim">
              <span className="font-semibold text-accent-glow">Why {winner?.toUpperCase()} wins:</span>{" "}
              {explainWin(winner!, reportA, reportB)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function explainWin(
  winner: "a" | "b",
  a: ReturnType<typeof lintPrompt>,
  b: ReturnType<typeof lintPrompt>
): string {
  const won = winner === "a" ? a : b;
  const lost = winner === "a" ? b : a;
  const reasons: string[] = [];
  const lostIssueIds = new Set(lost.issues.map((i) => i.id));
  const wonIssueIds = new Set(won.issues.map((i) => i.id));
  const onlyLost = lost.issues.filter((i) => !wonIssueIds.has(i.id));
  if (onlyLost.length) {
    reasons.push(
      `The losing prompt has ${onlyLost.length} extra issue${
        onlyLost.length === 1 ? "" : "s"
      } the winner avoided (${onlyLost.slice(0, 2).map((i) => `"${i.title}"`).join(", ")}${
        onlyLost.length > 2 ? "…" : ""
      }).`
    );
  }
  const wonMetricCount = METRICS.filter((m) => won.metrics[m] > lost.metrics[m]).length;
  reasons.push(`Wins ${wonMetricCount} of 5 metrics.`);
  return reasons.join(" ");
}

function PromptInput({
  which,
  value,
  onChange,
  report,
  taskType,
  isWinner,
  onCopy,
  copied,
}: {
  which: "a" | "b";
  value: string;
  onChange: (v: string) => void;
  report: ReturnType<typeof lintPrompt>;
  taskType: ReturnType<typeof detectTaskType>;
  isWinner: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  const label = which === "a" ? "Prompt A" : "Prompt B";
  return (
    <div className={`card overflow-hidden ${isWinner ? "ring-2 ring-emerald-400/40" : ""}`}>
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-dim">
          {isWinner && <Crown className="h-3.5 w-3.5 text-amber-300" />}
          {label}
          {value && (
            <>
              <span className="text-ink-fade">·</span>
              <span>{TASK_TYPE_EMOJI[taskType]} {TASK_TYPE_LABEL[taskType]}</span>
            </>
          )}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-bold ${
                report.score >= 80
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : report.score >= 50
                  ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                  : "border-rose-400/30 bg-rose-400/10 text-rose-300"
              }`}
            >
              {report.score}/100
            </span>
          )}
          <button
            type="button"
            onClick={onCopy}
            disabled={!value}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink disabled:opacity-40"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy
              </>
            )}
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Paste prompt ${which.toUpperCase()}...`}
        className="input-base min-h-[220px] rounded-none border-0 bg-transparent font-mono text-sm leading-relaxed focus:ring-0"
        style={{ resize: "vertical" }}
        spellCheck={false}
        data-testid={`prompt-${which}`}
      />
    </div>
  );
}

function MetricCompare({
  metric,
  a,
  b,
  winner,
}: {
  metric: Metric;
  a: number;
  b: number;
  winner: "a" | "b" | "tie";
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-wider text-ink-fade">{METRIC_LABEL[metric]}</div>
      <div className="mt-1 flex items-baseline justify-between">
        <span
          className={`text-base font-bold tabular-nums ${winner === "a" ? metricTextColor(a) : "text-ink-fade"}`}
        >
          {a}
        </span>
        <span className="text-[10px] text-ink-fade">vs</span>
        <span
          className={`text-base font-bold tabular-nums ${winner === "b" ? metricTextColor(b) : "text-ink-fade"}`}
        >
          {b}
        </span>
      </div>
      <div className="mt-1.5 flex h-1 gap-0.5">
        <div className="relative flex-1 overflow-hidden rounded-full bg-white/5">
          <div className={`h-full ${metricColor(a)}`} style={{ width: `${a}%` }} />
        </div>
        <div className="relative flex-1 overflow-hidden rounded-full bg-white/5">
          <div className={`h-full ${metricColor(b)}`} style={{ width: `${b}%` }} />
        </div>
      </div>
    </div>
  );
}

function DiffPoint({ label, a, b }: { label: string; a: string; b: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
      <div className="uppercase tracking-wider text-ink-fade">{label}</div>
      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2 text-ink">
        <span className="truncate"><span className="text-ink-fade">A:</span> {a}</span>
        <span className="truncate"><span className="text-ink-fade">B:</span> {b}</span>
      </div>
    </div>
  );
}
