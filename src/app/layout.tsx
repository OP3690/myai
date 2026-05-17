import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { CommandPalette } from "@/components/CommandPalette";

const GA_MEASUREMENT_ID = "G-HBSX0Q2WGT";

export const metadata: Metadata = {
  metadataBase: new URL("https://fixaiprompt.com"),
  title: {
    default: "FixAIPrompt — Fix prompts. Remove secrets. Use AI safely.",
    template: "%s · FixAIPrompt",
  },
  description:
    "The privacy layer for AI. Lint and rewrite any prompt, detect API keys / JWTs / PII before pasting into ChatGPT, Claude, or Gemini. Free, 100% client-side.",
  keywords: [
    "ai data loss prevention",
    "mask api keys",
    "safe chatgpt paste",
    "sanitize logs for ai",
    "remove pii from json",
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
    title: "FixAIPrompt — Fix prompts. Remove secrets. Use AI safely.",
    description:
      "The privacy layer for AI. Detect & mask API keys, JWTs, PII before pasting into ChatGPT, Claude, or Gemini.",
    url: "https://fixaiprompt.com",
    siteName: "FixAIPrompt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FixAIPrompt — Fix prompts. Remove secrets. Use AI safely.",
    description:
      "The privacy layer for AI. Mask secrets before pasting into ChatGPT or Claude.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "92yHC6RoKppsBrxkUZUS2izV8H6K-Ff6fD5wQ0POUuA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        <CommandPalette />
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
