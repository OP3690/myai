import { buildOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Prompt IQ Test — How good are you at prompt engineering?";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return buildOg({
    eyebrow: "Prompt IQ Test · 10 questions · 2 min",
    title: "What's your Prompt IQ?",
    subtitle:
      "10 questions on the prompt-engineering patterns that actually move the needle — role, format, Chain-of-Thought, few-shot, per-model syntax. Shareable score.",
    accentFrom: "#fcd34d",
    accentVia: "#fb7185",
    accentTo: "#a78bfa",
    badgeText: "Free · No signup",
    badgeColor: "#34d399",
  });
}
