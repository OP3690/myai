import { buildOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "CSV / JSON PII Stripper — Strip sensitive columns from any dataset";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return buildOg({
    eyebrow: "Data Cleaner",
    title: "Strip PII from CSV & JSON.",
    subtitle:
      "Column-aware redaction for analysts, support teams, and data engineers. 11 PII column types detected automatically. 100% in-browser.",
    accentFrom: "#86efac",
    accentVia: "#22d3ee",
    accentTo: "#a78bfa",
    badgeText: "New",
    badgeColor: "#fb7185",
  });
}
