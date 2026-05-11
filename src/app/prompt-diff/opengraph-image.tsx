import { buildOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Prompt Diff — Compare two AI prompts side-by-side";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return buildOg({
    eyebrow: "Prompt Diff",
    title: "Two prompts walk into a ring. One wins.",
    subtitle:
      "Paste two prompts, see which scores higher on Clarity, Context, Structure, Specificity, and Hallucination Risk. Auto-pick the winner.",
    accentFrom: "#fcd34d",
    accentVia: "#a78bfa",
    accentTo: "#22d3ee",
  });
}
