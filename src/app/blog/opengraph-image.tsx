import { buildOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "FixAIPrompt Blog — Prompt-engineering guides for ChatGPT, Claude, Gemini";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return buildOg({
    eyebrow: "Blog · Prompt engineering",
    title: "Practical prompt-engineering, no fluff.",
    subtitle:
      "Honest guides for ChatGPT, Claude, and Gemini. Comparisons, techniques, and real before/after examples.",
    accentFrom: "#c4b5fd",
    accentVia: "#a78bfa",
    accentTo: "#22d3ee",
  });
}
