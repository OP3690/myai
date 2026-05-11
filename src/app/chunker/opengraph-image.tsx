import { buildOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Prompt Chunker — Split text + decompose tasks for any LLM";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return buildOg({
    eyebrow: "Prompt Chunker",
    title: "Split big stuff into chunks AI can handle.",
    subtitle:
      "Token-aware text chunking for ChatGPT, Claude, Gemini, and 9 model presets — plus task decomposition for prompts too big for a single shot.",
    accentFrom: "#67e8f9",
    accentVia: "#22d3ee",
    accentTo: "#6ee7b7",
    badgeText: "New",
    badgeColor: "#fb7185",
  });
}
