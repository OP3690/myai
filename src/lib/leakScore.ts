import { severityRank, type Detection, type Severity } from "./detector";

export type LeakBand = "safe" | "warning" | "danger";

export type LeakScore = {
  score: number;
  band: LeakBand;
  headline: string;
  message: string;
  breakdown: Array<{
    severity: Severity;
    count: number;
    weight: number;
    deduction: number;
  }>;
  detectionCount: number;
};

const WEIGHTS: Record<Severity, number> = {
  critical: 30,
  high: 15,
  medium: 7,
  low: 2,
};

export function computeLeakScore(detections: Detection[]): LeakScore {
  if (!detections.length) {
    return {
      score: 100,
      band: "safe",
      headline: "Safe to paste",
      message: "No secrets, credentials, or PII detected.",
      breakdown: [],
      detectionCount: 0,
    };
  }

  const counts: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  for (const d of detections) counts[d.severity]++;

  const breakdown = (["critical", "high", "medium", "low"] as Severity[])
    .filter((s) => counts[s] > 0)
    .map((s) => ({
      severity: s,
      count: counts[s],
      weight: WEIGHTS[s],
      deduction: counts[s] * WEIGHTS[s],
    }));

  const totalDeduction = breakdown.reduce((a, b) => a + b.deduction, 0);
  const score = Math.max(0, 100 - totalDeduction);

  const worst = detections.reduce<Severity>(
    (acc, d) => (severityRank(d.severity) > severityRank(acc) ? d.severity : acc),
    "low"
  );

  let band: LeakBand;
  let headline: string;
  let message: string;

  if (score >= 80) {
    band = "safe";
    headline = "Mostly safe";
    message = `${detections.length} low-risk item${detections.length === 1 ? "" : "s"} detected. Review before pasting.`;
  } else if (score >= 50) {
    band = "warning";
    headline = "Risky — review before sending";
    message = `${detections.length} item${detections.length === 1 ? "" : "s"} detected, worst severity: ${worst}. Use the masked version below.`;
  } else {
    band = "danger";
    headline = "Do not paste this into AI";
    message = `${detections.length} sensitive item${detections.length === 1 ? "" : "s"} detected, including ${worst}-severity findings. Strongly recommend pasting the masked version instead.`;
  }

  return {
    score,
    band,
    headline,
    message,
    breakdown,
    detectionCount: detections.length,
  };
}

export function bandColor(band: LeakBand): string {
  if (band === "safe")
    return "from-emerald-500/20 to-emerald-400/5 border-emerald-400/30 text-emerald-300";
  if (band === "warning")
    return "from-amber-500/20 to-amber-400/5 border-amber-400/30 text-amber-300";
  return "from-rose-500/20 to-rose-400/5 border-rose-400/30 text-rose-300";
}

export function bandText(band: LeakBand): string {
  if (band === "safe") return "text-emerald-300";
  if (band === "warning") return "text-amber-300";
  return "text-rose-300";
}

export function bandRing(band: LeakBand): string {
  if (band === "safe") return "ring-emerald-400/30";
  if (band === "warning") return "ring-amber-400/30";
  return "ring-rose-400/30";
}
