import type { Metadata } from "next";
import { LandingShell } from "@/components/LandingShell";

export const metadata: Metadata = {
  title: "Remove PII from JSON — Mask sensitive fields before sharing with AI",
  description:
    "Paste a JSON blob, get back a structurally-identical version with all emails, phone numbers, SSNs, credit cards, and credentials masked. Works in your browser.",
  alternates: { canonical: "/remove-pii-from-json" },
};

const before = `{
  "user": {
    "id": "u_4821",
    "email": "priya.iyer@acme.co",
    "phone": "+91 98765 43210",
    "ssn": "501-29-4471",
    "card_number": "4111 1111 1111 1111"
  },
  "auth": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1NDgyMSJ9.X9R3pqTuVwXyZ012aBcDeFgHiJkLmNoPqRsTuVwXyZ",
    "api_key": "sk-proj-1QRSt2UvWxYz0abcdef123456ghij789klMnoPqr"
  },
  "metadata": {
    "ip": "49.207.181.22",
    "country": "IN"
  }
}`;

const after = `{
  "user": {
    "id": "u_4821",
    "email": "[EMAIL_MASKED]",
    "phone": "[PHONE_MASKED]",
    "ssn": "[SSN_MASKED]",
    "card_number": "[CARD_NUMBER_MASKED]"
  },
  "auth": {
    "token": "[TOKEN_MASKED]",
    "api_key": "[API_KEY_MASKED]"
  },
  "metadata": {
    "ip": "[IPV4_MASKED]",
    "country": "IN"
  }
}`;

export default function Page() {
  return (
    <LandingShell
      eyebrow="Remove PII from JSON · 100% client-side"
      title={
        <>
          Remove PII from{" "}
          <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
            JSON
          </span>{" "}
          — keep the shape.
        </>
      }
      blurb={
        <>
          Paste a JSON payload — API response, fixture, support ticket. FixAIPrompt
          parses it, walks the tree, and replaces sensitive values with safe
          placeholders. The shape, keys, and harmless values stay exactly the
          same, so the AI you share it with still understands the structure.
        </>
      }
      exampleBefore={before}
      exampleAfter={after}
      bullets={[
        "Detects sensitive JSON keys (password, token, secret, api_key, auth, credential, etc.) and masks the entire value.",
        "Detects in-value PII (emails, phone numbers, SSNs, Aadhaar, credit cards with Luhn validation) — even in fields you didn't think were sensitive.",
        "Preserves valid JSON structure so the output is still copy-paste ready for AI.",
        "If the JSON is invalid, falls back to plain text masking on the original.",
        "Runs entirely in your browser. Nothing uploaded.",
      ]}
    />
  );
}
