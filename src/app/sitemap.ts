import type { MetadataRoute } from "next";
import { GLOSSARY } from "@/lib/glossary";
import { TEMPLATES } from "@/lib/templates";
import { BLOG_POSTS } from "@/lib/blog";

const BASE = "https://fixaiprompt.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/fix`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/safe-paste`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/chunker`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/data-cleaner`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/prompt-diff`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/templates`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/glossary`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    // High-volume keyword landing pages
    { url: `${BASE}/ai-prompt-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/chatgpt-prompts`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/claude-prompts`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/gemini-prompts`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/grok-prompts`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // Use-case landings
    { url: `${BASE}/prompts-for-developers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/prompts-for-writers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/prompts-for-students`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/prompts-for-marketers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // Blog
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    // Viral
    { url: `${BASE}/prompt-iq`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
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

  const glossaryUrls = GLOSSARY.map((g) => ({
    url: `${BASE}/glossary/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogUrls = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...templateUrls, ...glossaryUrls, ...blogUrls];
}
