import { buildOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "FixAIPrompt — Fix prompts. Remove secrets. Use AI safely.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return buildOg({
    eyebrow: "The privacy layer for AI",
    title: "Fix prompts. Remove secrets. Use AI safely.",
    subtitle:
      "Lint and rewrite any prompt, detect API keys & PII before pasting, chunk huge inputs, and steal from advanced templates. 100% in-browser.",
  });
}
