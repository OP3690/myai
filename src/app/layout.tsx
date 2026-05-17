import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { CommandPalette } from "@/components/CommandPalette";
import { AnalyticsPageView } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const GA_MEASUREMENT_ID = "G-HBSX0Q2WGT";

export const metadata: Metadata = {
  metadataBase: new URL("https://fixaiprompt.com"),
  title: {
    default:
      "AI Prompt Generator + Optimizer for ChatGPT, Claude, Gemini & Grok | FixAIPrompt",
    template: "%s | FixAIPrompt",
  },
  description:
    "Free AI prompt tools — generate, optimize, and chunk prompts for ChatGPT, Claude, Gemini, and Grok. Includes prompt fixer, prompt chunker, 58 templates, and 16 prompt-engineering techniques. 100% browser-only, no API key, no signup.",
  applicationName: "FixAIPrompt",
  authors: [{ name: "FixAIPrompt" }],
  creator: "FixAIPrompt",
  publisher: "FixAIPrompt",
  category: "Developer Tools",
  keywords: [
    // Core / brand
    "ai",
    "ai prompt",
    "ai prompts",
    "ai prompt generator",
    "ai prompt optimizer",
    "fixaiprompt",
    "fix ai prompt",
    "prompt engineering",
    "prompt engineer",
    "prompt linter",
    "prompt rewriter",
    "prompt chunker",
    "prompt diff",
    "prompt templates",
    // Per-model
    "chatgpt",
    "chatgpt prompts",
    "chatgpt prompt generator",
    "best chatgpt prompts",
    "claude",
    "claude prompts",
    "claude ai prompts",
    "claude prompt generator",
    "anthropic claude",
    "gemini",
    "gemini prompts",
    "google gemini prompts",
    "grok",
    "grok prompts",
    "grok ai",
    "xai grok",
    "cursor",
    "cursor prompts",
    "github copilot",
    "copilot prompts",
    // Techniques
    "chain of thought",
    "chain of thought prompting",
    "tree of thoughts",
    "self-refine",
    "react prompting",
    "rag",
    "retrieval augmented generation",
    "few shot prompting",
    "zero shot prompting",
    "constitutional ai",
    "multi-persona prompting",
    "adversarial prompting",
    "pre-mortem analysis",
    // Privacy / safety
    "ai data loss prevention",
    "mask api keys",
    "safe chatgpt paste",
    "sanitize logs for ai",
    "remove pii from json",
    "csv pii stripper",
    "data redaction",
    "secret scanner",
  ],
  openGraph: {
    title:
      "Free AI Prompt Tools for ChatGPT, Claude, Gemini & Grok — FixAIPrompt",
    description:
      "Generate, optimize, chunk, and redact AI prompts. Free, browser-only, no API key. Works with ChatGPT, Claude, Gemini, Grok, Cursor, and Copilot.",
    url: "https://fixaiprompt.com",
    siteName: "FixAIPrompt",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Free AI Prompt Tools for ChatGPT, Claude, Gemini & Grok — FixAIPrompt",
    description:
      "Generate, optimize, and chunk AI prompts. 58 templates. 16 techniques. 100% browser-only.",
    creator: "@fixaiprompt",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "92yHC6RoKppsBrxkUZUS2izV8H6K-Ff6fD5wQ0POUuA",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      </head>
      <body className="font-sans">
        {children}
        <CommandPalette />
        <AnalyticsPageView />
        {/* Google Analytics 4 — loaded after page is interactive so it doesn't block paint. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
