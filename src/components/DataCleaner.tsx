"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Database,
  Download,
  FileJson,
  Sheet,
} from "lucide-react";
import {
  cleanCSV,
  cleanJSON,
  COLUMN_KIND_LABEL,
  type ColumnPlan,
  detectFormat,
  planCSV,
} from "@/lib/dataCleaner";
import { events } from "@/lib/analytics";

const SAMPLE_CSV = `user_id,name,email,phone,city,signup_date,api_key,notes
1001,Ananya Sharma,ananya@example.com,+91 98765 43210,Mumbai,2025-09-12,sk-proj-aBcDe123FgHi456,Renewal upsell
1002,Rahul Mehta,rahul.mehta@acme.co,+91-99887-11234,Bangalore,2025-09-14,sk-live-9zXcDfGh,Churn risk
1003,Priya Iyer,priya@startup.io,+91 91234 56789,Chennai,2025-10-02,,Active
1004,Arjun Patel,arjun.p@example.com,+91 90123 45678,Pune,2025-10-08,,Trial`;

const SAMPLE_JSON = `[
  {
    "id": "u_4821",
    "email": "priya.iyer@acme.co",
    "phone": "+91 98765 43210",
    "ssn": "458-29-1234",
    "card_number": "4111 1111 1111 1111",
    "metadata": { "ip": "49.207.181.22", "country": "IN" }
  },
  {
    "id": "u_4822",
    "email": "arjun@startup.io",
    "phone": "+91 99887 12345",
    "auth": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1NDgyMSJ9.aBcDeFgHiJkLmNoPqRsTu",
      "api_key": "sk-proj-9xYzAbCdEf1234"
    }
  }
]`;

type Tab = "csv" | "json";

export function DataCleaner() {
  const [tab, setTab] = useState<Tab>("csv");
  const [text, setText] = useState<string>("");
  const [columns, setColumns] = useState<ColumnPlan[] | null>(null);
  const [output, setOutput] = useState<string>("");
  const [stats, setStats] = useState<{ masked: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const detectedFormat = useMemo(() => detectFormat(text), [text]);

  function loadCsv() {
    setTab("csv");
    setText(SAMPLE_CSV);
    setOutput("");
    setColumns(null);
    setStats(null);
    events.dataCleanerSampleLoaded({ sample: "csv" });
  }
  function loadJson() {
    setTab("json");
    setText(SAMPLE_JSON);
    setOutput("");
    setColumns(null);
    setStats(null);
    events.dataCleanerSampleLoaded({ sample: "json" });
  }
  function reset() {
    setText("");
    setOutput("");
    setColumns(null);
    setStats(null);
  }

  function analyse() {
    if (!text.trim()) return;
    if (tab === "csv") {
      const plan = planCSV(text);
      setColumns(plan.columns);
      const r = cleanCSV(plan.headers, plan.rows, plan.columns);
      setOutput(r.output);
      setStats({ masked: r.maskedCells });
      events.dataCleanerAnalysed({
        format: "csv",
        masked_cells: r.maskedCells,
        column_count: plan.columns.length,
      });
    } else {
      const r = cleanJSON(text);
      setOutput(r.output);
      setStats({ masked: r.maskedFields });
      setColumns(null);
      events.dataCleanerAnalysed({ format: "json", masked_cells: r.maskedFields });
    }
    events.dataCleanerInput({ format: tab, chars: text.length });
  }

  function toggleColumn(i: number) {
    if (!columns || tab !== "csv") return;
    const next = columns.map((c) => (c.index === i ? { ...c, mask: !c.mask } : c));
    setColumns(next);
    const plan = planCSV(text);
    const r = cleanCSV(plan.headers, plan.rows, next);
    setOutput(r.output);
    setStats({ masked: r.maskedCells });
    const toggled = next.find((c) => c.index === i);
    if (toggled) events.dataCleanerColumnToggled({ kind: toggled.kind, on: toggled.mask });
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function downloadOutput() {
    if (!output) return;
    const blob = new Blob([output], {
      type: tab === "csv" ? "text/csv;charset=utf-8" : "application/json;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = tab === "csv" ? "cleaned.csv" : "cleaned.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }, 100);
    events.dataCleanerDownloaded({ format: tab });
  }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          { v: "csv" as const, icon: Sheet, label: "CSV", blurb: "Column-aware PII redaction" },
          { v: "json" as const, icon: FileJson, label: "JSON", blurb: "Tree walk + key + value masking" },
        ].map((t) => {
          const active = tab === t.v;
          const Icon = t.icon;
          return (
            <button
              key={t.v}
              onClick={() => setTab(t.v)}
              className={`card flex items-start gap-3 p-4 text-left transition ${
                active ? "border-accent/40 bg-accent/5 ring-1 ring-accent/30" : "hover:border-white/15"
              }`}
            >
              <div
                className={`grid h-9 w-9 flex-none place-items-center rounded-lg ring-1 ${
                  active ? "bg-accent/20 ring-accent/40 text-accent-glow" : "bg-white/5 ring-white/10 text-ink-dim"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className={`text-sm font-semibold ${active ? "text-accent-glow" : "text-ink"}`}>{t.label}</div>
                <div className="mt-0.5 text-xs text-ink-dim">{t.blurb}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div className="card p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-dim">
            Paste {tab === "csv" ? "a CSV" : "a JSON document"}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={loadCsv} className="text-xs text-accent-glow transition hover:text-accent">
              Try CSV sample
            </button>
            <span className="text-xs text-ink-fade">·</span>
            <button onClick={loadJson} className="text-xs text-accent-glow transition hover:text-accent">
              Try JSON sample
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            tab === "csv"
              ? "user_id,name,email,phone\n1,Ananya,ananya@example.com,+91..."
              : '{ "user": { "email": "...", "ssn": "..." } }'
          }
          className="input-base min-h-[220px] font-mono text-sm leading-relaxed"
          spellCheck={false}
          data-testid="data-input"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-fade">
          <span>
            {text.length.toLocaleString()} chars
            {detectedFormat !== "unknown" && (
              <>
                {" "}·{" "}
                <span className={detectedFormat === tab ? "text-emerald-300" : "text-amber-300"}>
                  Detected: {detectedFormat.toUpperCase()}
                </span>
              </>
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={analyse}
              disabled={!text.trim()}
              className="btn-primary"
              data-testid="analyse-btn"
            >
              <Database className="h-4 w-4" />
              Analyse &amp; clean
            </button>
            <button onClick={reset} disabled={!text} className="btn-ghost disabled:opacity-40">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* CSV column toggles */}
      {tab === "csv" && columns && columns.length > 0 && (
        <div className="card p-5 sm:p-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-dim">
            Columns detected — toggle to mask
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map((c) => (
              <label
                key={c.index}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                  c.mask
                    ? "border-rose-400/30 bg-rose-400/5"
                    : "border-white/5 bg-white/[0.02] hover:border-white/15"
                }`}
              >
                <input
                  type="checkbox"
                  checked={c.mask}
                  onChange={() => toggleColumn(c.index)}
                  className="h-4 w-4 flex-none rounded border-white/20 bg-bg-soft"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink">{c.name || "(unnamed)"}</div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-ink-fade">
                    <span className={c.kind === "other" ? "text-ink-fade" : "text-rose-300"}>
                      {COLUMN_KIND_LABEL[c.kind]}
                    </span>
                    {c.sample && (
                      <>
                        <span>·</span>
                        <span className="truncate font-mono">{c.sample.slice(0, 40)}</span>
                      </>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Output */}
      {output && stats && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Cleaned {tab === "csv" ? "CSV" : "JSON"} · {stats.masked} value{stats.masked === 1 ? "" : "s"} masked
            </span>
            <div className="flex items-center gap-2">
              <button onClick={copyOutput} className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink">
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
              <button onClick={downloadOutput} className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/15 px-2 py-1 text-xs font-medium text-accent-glow transition hover:bg-accent/25">
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
          <pre className="max-h-[520px] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
            {output}
          </pre>
        </div>
      )}

      {output && stats && stats.masked === 0 && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-200">
          <AlertTriangle className="mr-2 inline h-4 w-4 align-text-bottom" />
          Zero values masked. Either your data really is clean — or no
          column-name matched a PII heuristic. Toggle columns above to force-mask them.
        </div>
      )}
    </div>
  );
}
