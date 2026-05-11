import { buildOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Prompt Fixer — Lint and rewrite any AI prompt";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return buildOg({
    eyebrow: "Prompt Fixer",
    title: "Fix your AI prompt. Instantly.",
    subtitle:
      "Task-aware rewriting + multi-metric scoring. Auto-detects whether you're asking for code / analysis / writing / decisions — and adapts the structure.",
    accentFrom: "#c4b5fd",
    accentVia: "#a78bfa",
    accentTo: "#22d3ee",
  });
}
