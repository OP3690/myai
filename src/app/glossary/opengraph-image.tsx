import { buildOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Prompt Engineering Glossary — Plain-English explanations of real AI techniques";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return buildOg({
    eyebrow: "Glossary · 16 techniques",
    title: "Prompt engineering, in plain English.",
    subtitle:
      "Chain-of-Thought · Tree-of-Thoughts · ReAct · Self-Refine · Constitutional AI · RAG · Few-Shot · Pre-Mortem · Multi-Persona · and more. Each with when to use, when not to, and an interactive template.",
    accentFrom: "#c4b5fd",
    accentVia: "#a78bfa",
    accentTo: "#22d3ee",
  });
}
