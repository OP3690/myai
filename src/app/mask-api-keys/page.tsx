import type { Metadata } from "next";
import { LandingShell } from "@/components/LandingShell";

export const metadata: Metadata = {
  title: "Mask API Keys — Detect & redact secrets before sharing",
  description:
    "Paste any text, code, log, or config — FixAIPrompt detects API keys (AWS, OpenAI, Anthropic, GitHub, Stripe, Google, Slack, more) and replaces them with safe placeholders.",
  alternates: { canonical: "/mask-api-keys" },
};

const before = `# .env
OPENAI_API_KEY=sk-proj-1QRSt2UvWxYz0abcdef123456ghij789klMnoPqr
ANTHROPIC_API_KEY=sk-ant-api03-aXz0AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz
GITHUB_TOKEN=ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ012345abcd
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
STRIPE_SECRET=sk_test_EXAMPLEEXAMPLEEXAMPLEEXAMPLEexample
GOOGLE_API_KEY=AIzaSyB1nDfVqYz8aBcDeFgHiJkLmNoPqRsTuVw`;

const after = `# .env
OPENAI_API_KEY=[OPENAI_API_KEY_MASKED]
ANTHROPIC_API_KEY=[ANTHROPIC_API_KEY_MASKED]
GITHUB_TOKEN=[GITHUB_TOKEN_MASKED]
AWS_ACCESS_KEY_ID=[AWS_ACCESS_KEY_MASKED]
AWS_SECRET_ACCESS_KEY=[AWS_SECRET_KEY_MASKED]
STRIPE_SECRET=[STRIPE_SECRET_MASKED]
GOOGLE_API_KEY=[GOOGLE_API_KEY_MASKED]`;

export default function Page() {
  return (
    <LandingShell
      eyebrow="Mask API Keys · 100% client-side"
      title={
        <>
          Mask{" "}
          <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
            API keys
          </span>{" "}
          before they leak.
        </>
      }
      blurb={
        <>
          Paste a config file, an error message, a curl command, or a log
          line. FixAIPrompt finds every API key and replaces it with a safe
          placeholder. Works for AWS, OpenAI, Anthropic, GitHub, Stripe,
          Google, Slack, SendGrid, Twilio, and more — plus an entropy
          fallback for keys with unknown formats.
        </>
      }
      exampleBefore={before}
      exampleAfter={after}
      bullets={[
        "Specific patterns for AWS access & secret keys, OpenAI sk- / sk-proj-, Anthropic sk-ant-, GitHub ghp_/gho_/ghs_, Stripe sk_live_/pk_live_, Google AIza, Slack xox*, SendGrid SG.*, and more.",
        "Entropy fallback catches keys you've forgotten about — any 32+ char high-entropy alphanumeric string is flagged.",
        "Each match keeps its prefix in the placeholder so the masked output is still readable as the same config.",
        "Runs 100% in your browser. No keys are ever uploaded.",
      ]}
    />
  );
}
