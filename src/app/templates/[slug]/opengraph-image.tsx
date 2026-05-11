import { getTemplate, TEMPLATES } from "@/lib/templates";
import { buildOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "FixAIPrompt prompt template";

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const t = getTemplate(params.slug);
  return [
    {
      id: "default",
      alt: t ? `${t.title} — Better AI prompt template` : "FixAIPrompt template",
      contentType,
      size,
    },
  ];
}

export default async function Image({ params }: { params: { slug: string } }) {
  const t = getTemplate(params.slug);
  if (!t) {
    return buildOg({
      eyebrow: "Template",
      title: "Better AI prompt template",
      accentFrom: "#a78bfa",
      accentVia: "#7c5cff",
      accentTo: "#22d3ee",
    });
  }

  const eyebrow = t.technique
    ? `Technique · ${t.technique}`
    : `Template · ${t.category}`;

  return buildOg({
    eyebrow,
    title: t.title,
    subtitle: t.tagline,
    accentFrom: t.viral ? "#fda4af" : "#c4b5fd",
    accentVia: t.advanced ? "#a78bfa" : "#7c5cff",
    accentTo: t.viral ? "#fbbf24" : "#22d3ee",
    badgeText: t.advanced ? "Advanced" : t.viral ? "Viral" : undefined,
    badgeColor: t.advanced ? "#a78bfa" : t.viral ? "#fb7185" : undefined,
  });
}

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}
