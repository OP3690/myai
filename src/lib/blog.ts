export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  category: "Guides" | "Comparisons" | "Techniques" | "Templates";
  readingMinutes: number;
  keywords: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-write-better-chatgpt-prompts-2026",
    title: "How to Write Better ChatGPT Prompts in 2026 — The Complete Guide",
    description:
      "A practical, no-fluff guide to writing ChatGPT prompts that consistently produce great answers. 12 patterns, 7 anti-patterns, and the exact structure that works on GPT-4, GPT-4o, and beyond.",
    publishedAt: "2026-05-10",
    category: "Guides",
    readingMinutes: 11,
    keywords: [
      "how to write chatgpt prompts",
      "better chatgpt prompts",
      "chatgpt prompt guide",
      "chatgpt prompting 2026",
      "gpt-4 prompts",
      "gpt-4o prompts",
    ],
  },
  {
    slug: "chatgpt-vs-claude-vs-gemini",
    title: "ChatGPT vs Claude vs Gemini — Which AI Is Best for What? (2026)",
    description:
      "A working comparison of ChatGPT (GPT-4o), Claude (Sonnet 3.5 / Opus), and Gemini (1.5 Pro) across coding, writing, analysis, long-context, and cost. With prompt patterns each model handles best.",
    publishedAt: "2026-05-12",
    category: "Comparisons",
    readingMinutes: 13,
    keywords: [
      "chatgpt vs claude",
      "claude vs gemini",
      "chatgpt vs claude vs gemini",
      "best ai model 2026",
      "which ai is best",
      "gpt-4 vs claude sonnet",
    ],
  },
  {
    slug: "chain-of-thought-prompting-practical-guide",
    title: "Chain-of-Thought Prompting — A Practical Guide With 6 Real Examples",
    description:
      "Chain-of-Thought (CoT) is the single highest-ROI prompt-engineering technique. Here's exactly when to use it, when not to, and 6 real before/after examples that boost accuracy on multi-step problems.",
    publishedAt: "2026-05-14",
    category: "Techniques",
    readingMinutes: 9,
    keywords: [
      "chain of thought prompting",
      "cot prompting",
      "what is chain of thought",
      "step by step prompts",
      "chain of thought examples",
      "let's think step by step",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
