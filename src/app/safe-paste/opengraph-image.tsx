import { buildOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Safe Paste — Detect & mask secrets before pasting into AI";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return buildOg({
    eyebrow: "Safe Paste",
    title: "Don't paste secrets into AI.",
    subtitle:
      "Detects 30+ types of API keys, JWTs, PII, and database credentials before they ever leave your browser. AI Leak Score included.",
    accentFrom: "#fda4af",
    accentVia: "#fb7185",
    accentTo: "#fbbf24",
    badgeText: "100% client-side",
    badgeColor: "#34d399",
  });
}
