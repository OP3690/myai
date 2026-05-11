import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fixaiprompt.com"),
  title: {
    default: "FixAIPrompt — Fix your AI prompts. Instantly.",
    template: "%s · FixAIPrompt",
  },
  description:
    "Paste any prompt and get instant lint warnings plus an AI-rewritten version optimized for Claude, GPT, Gemini, Cursor, or Copilot. Free, browser-only, bring your own key.",
  keywords: [
    "prompt engineering",
    "prompt linter",
    "fix ai prompt",
    "prompt rewriter",
    "claude prompts",
    "chatgpt prompts",
    "gemini prompts",
    "cursor prompts",
    "copilot prompts",
  ],
  openGraph: {
    title: "FixAIPrompt — Fix your AI prompts. Instantly.",
    description:
      "Lint and rewrite any AI prompt. Optimized for Claude, GPT, Gemini, Cursor, Copilot.",
    url: "https://fixaiprompt.com",
    siteName: "FixAIPrompt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FixAIPrompt — Fix your AI prompts. Instantly.",
    description:
      "Lint and rewrite any AI prompt. Optimized for Claude, GPT, Gemini, Cursor, Copilot.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
