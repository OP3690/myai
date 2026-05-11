import {
  METRICS,
  METRIC_BLURB,
  METRIC_LABEL,
  metricColor,
  metricTextColor,
  type Metric,
} from "@/lib/linter";

export function MetricBreakdown({
  metrics,
  hidden,
}: {
  metrics: Record<Metric, number>;
  hidden?: boolean;
}) {
  if (hidden) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-xs text-ink-fade">
        Type or paste a prompt to see your score breakdown.
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="grid gap-3 sm:grid-cols-5">
        {METRICS.map((m) => (
          <MetricBar key={m} metric={m} value={metrics[m]} />
        ))}
      </div>
    </div>
  );
}

function MetricBar({ metric, value }: { metric: Metric; value: number }) {
  return (
    <div className="group">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-ink-dim" title={METRIC_BLURB[metric]}>
          {METRIC_LABEL[metric]}
        </span>
        <span className={`text-xs font-semibold tabular-nums ${metricTextColor(value)}`}>
          {value}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all ${metricColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
