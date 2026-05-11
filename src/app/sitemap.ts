import type { MetadataRoute } from "next";
import { TEMPLATES } from "@/lib/templates";

const BASE = "https://fixaiprompt.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/fix`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/safe-paste`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/templates`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/safe-chatgpt-paste`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/mask-api-keys`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/sanitize-logs-for-ai`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/remove-pii-from-json`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const templateUrls = TEMPLATES.map((t) => ({
    url: `${BASE}/templates/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticUrls, ...templateUrls];
}
