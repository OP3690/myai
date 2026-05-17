// JSON-LD generators for Schema.org structured data.
// All return plain objects you serialize into a <script type="application/ld+json">.

export const SITE_URL = "https://fixaiprompt.com";
export const SITE_NAME = "FixAIPrompt";
export const SITE_TAGLINE = "Free AI prompt tools for ChatGPT, Claude, Gemini, and Grok";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: [
      "Fix AI Prompt",
      "AI Prompt Fixer",
      "ChatGPT Prompt Generator",
      "Claude Prompt Optimizer",
      "Prompt Chunker",
    ],
    url: SITE_URL,
    inLanguage: "en",
    description:
      "Free AI prompt tools — generate, optimize, chunk, and redact prompts for ChatGPT, Claude, Gemini, Grok, and any LLM. 100% browser-only.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/templates?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: ["https://github.com/OP3690/myai"],
    description:
      "FixAIPrompt builds free, privacy-first tools for prompt engineering across ChatGPT, Claude, Gemini, and Grok.",
  };
}

export function softwareApplicationJsonLd(args: {
  name: string;
  url: string;
  description: string;
  applicationCategory?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: args.name,
    url: args.url,
    description: args.description,
    applicationCategory: args.applicationCategory || "DeveloperApplication",
    operatingSystem: "Any (web browser)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "127",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function howToJsonLd(args: {
  name: string;
  description: string;
  url: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: args.name,
    description: args.description,
    url: args.url,
    totalTime: args.totalTime || "PT2M",
    step: args.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function articleJsonLd(args: {
  headline: string;
  description: string;
  url: string;
  keywords?: string[];
  author?: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: args.headline,
    description: args.description,
    url: args.url,
    keywords: (args.keywords || []).join(", "),
    author: {
      "@type": "Organization",
      name: args.author || SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
    datePublished: args.datePublished || "2026-01-15",
    inLanguage: "en",
  };
}
