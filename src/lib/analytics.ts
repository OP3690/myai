// Thin GA4 wrapper. No-op in SSR / when gtag isn't loaded.
// Every helper returns void; safe to call anywhere without a try/catch.

type GtagWindow = Window & {
  gtag?: (...args: any[]) => void;
  dataLayer?: any[];
};

export function track(eventName: string, params?: Record<string, any>): void {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  if (typeof w.gtag !== "function") return;
  try {
    w.gtag("event", eventName, params || {});
  } catch {
    // never let analytics throw into product code
  }
}

// ─── Typed helpers per behavior ────────────────────────────────────────────
// Keeps event names + params consistent across the codebase. If you add a
// new event, add a helper here so it shows up in IDE autocomplete.

export const events = {
  // ── Prompt Fixer ────────────────────────────────────────────────────
  promptScored: (p: {
    task_type: string;
    score_before: number;
    score_after: number;
    words: number;
    surface: "home" | "fix" | string;
  }) => track("prompt_scored", p),

  promptCopied: (p: { surface: string; model?: string }) =>
    track("prompt_copied", p),

  promptModelChanged: (p: { surface: string; model: string }) =>
    track("prompt_model_changed", p),

  promptSampleLoaded: (p: { surface: string; sample: string }) =>
    track("prompt_sample_loaded", p),

  shareCardAction: (p: { action: "x" | "linkedin" | "copy"; delta: number }) =>
    track("share_card_action", p),

  // ── Safe Paste ──────────────────────────────────────────────────────
  safePasteScanned: (p: {
    chars: number;
    detections: number;
    band: string;
    mode: string;
  }) => track("safe_paste_scanned", p),

  safePasteCopied: (p: { mode: string; what: "masked" | "summary" }) =>
    track("safe_paste_copied", p),

  safePasteSampleLoaded: (p: { sample: string }) =>
    track("safe_paste_sample_loaded", p),

  safePasteModeChanged: (p: { mode: string }) =>
    track("safe_paste_mode_changed", p),

  // ── Chunker ─────────────────────────────────────────────────────────
  chunkerInput: (p: {
    surface: "home" | "tool";
    chars: number;
    tokens: number;
    detected_type?: string;
    model: string;
  }) => track("chunker_input", p),

  chunkerHandoff: (p: { mode: "split" | "decompose"; tokens: number }) =>
    track("chunker_handoff", p),

  chunkerCopyChunk: (p: {
    surface: "home" | "tool";
    index?: number;
    total?: number;
  }) => track("chunker_copy_chunk", p),

  chunkerSampleLoaded: (p: { surface: "home" | "tool"; sample: string }) =>
    track("chunker_sample_loaded", p),

  chunkerModeChanged: (p: { mode: "split" | "decompose" }) =>
    track("chunker_mode_changed", p),

  chunkerModelChanged: (p: { surface: "home" | "tool"; model: string }) =>
    track("chunker_model_changed", p),

  // ── Templates ───────────────────────────────────────────────────────
  templateOpened: (p: {
    slug: string;
    technique?: string;
    category: string;
    advanced?: boolean;
    viral?: boolean;
  }) => track("template_opened", p),

  templateSampleLoaded: (p: { slug: string }) =>
    track("template_sample_loaded", p),

  templateCopied: (p: {
    slug: string;
    filled_count: number;
    total: number;
    fully_filled: boolean;
  }) => track("template_copied", p),

  templateLinkShared: (p: { slug: string; filled_count: number }) =>
    track("template_link_shared", p),

  templateFavorited: (p: { slug: string; on: boolean }) =>
    track("template_favorited", p),

  templatesSearched: (p: { query_len: number; results: number }) =>
    track("templates_searched", p),

  templatesFiltered: (p: { filter: string }) =>
    track("templates_filtered", p),

  // ── Glossary ────────────────────────────────────────────────────────
  glossaryOpened: (p: { slug: string }) => track("glossary_opened", p),
  glossaryFavorited: (p: { slug: string; on: boolean }) =>
    track("glossary_favorited", p),

  // ── Prompt Diff ─────────────────────────────────────────────────────
  promptDiffCompared: (p: {
    winner: "a" | "b" | "tie";
    score_a: number;
    score_b: number;
    task_a: string;
    task_b: string;
  }) => track("prompt_diff_compared", p),

  promptDiffSampleLoaded: () => track("prompt_diff_sample_loaded"),

  promptDiffCopied: (p: { which: "a" | "b" }) =>
    track("prompt_diff_copied", p),

  // ── Data Cleaner ────────────────────────────────────────────────────
  dataCleanerInput: (p: { format: string; chars: number }) =>
    track("data_cleaner_input", p),

  dataCleanerAnalysed: (p: { format: string; masked_cells: number; column_count?: number }) =>
    track("data_cleaner_analysed", p),

  dataCleanerColumnToggled: (p: { kind: string; on: boolean }) =>
    track("data_cleaner_column_toggled", p),

  dataCleanerDownloaded: (p: { format: string }) =>
    track("data_cleaner_downloaded", p),

  dataCleanerSampleLoaded: (p: { sample: string }) =>
    track("data_cleaner_sample_loaded", p),

  // ── Command Palette ─────────────────────────────────────────────────
  cmdkOpened: () => track("cmdk_opened"),
  cmdkPick: (p: { kind: string; slug?: string }) => track("cmdk_pick", p),

  // ── Misc ────────────────────────────────────────────────────────────
  externalLinkClicked: (p: { url: string; surface?: string }) =>
    track("external_link_clicked", p),
};
