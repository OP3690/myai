import { buildOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Advanced AI Prompt Templates — Chain-of-Thought, Tree-of-Thoughts, Self-Refine";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return buildOg({
    eyebrow: "Templates · advanced techniques",
    title: "Prompt templates with real prompt engineering.",
    subtitle:
      "Chain-of-Thought · Tree-of-Thoughts · Self-Refine · Multi-Persona Debate · Adversarial Red-Team · Pre-Mortem · Bias Audit · Algorithm Whisperer.",
    accentFrom: "#fcd34d",
    accentVia: "#a78bfa",
    accentTo: "#fb7185",
    badgeText: "Interactive",
    badgeColor: "#a78bfa",
  });
}
