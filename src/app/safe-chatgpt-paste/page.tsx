import type { Metadata } from "next";
import { LandingShell } from "@/components/LandingShell";

export const metadata: Metadata = {
  title: "Safe ChatGPT Paste — Remove secrets before sharing with ChatGPT",
  description:
    "Don't paste API keys, JWTs, customer data, or production logs into ChatGPT. FixAIPrompt detects and masks 30+ types of secrets locally in your browser — nothing uploaded.",
  alternates: { canonical: "/safe-chatgpt-paste" },
};

const before = `Hey ChatGPT, can you help me debug this?

[2026-04-12 14:08:12] INFO request_id=req_8a7b2c
  user_email=arnav.kapoor@stripe-internal.dev
  user_phone=+91 99887 71234
  api_key=sk-proj-1QRSt2UvWxYz0abcdef123456ghij789klMnoPqr
  authorization=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1MTIzIn0.QrSt8aLkpY9w_zBnTr5mhCxKLqPp3jhwAGzLkXuIMvc
  db_url=postgres://acme:Sup3rSecret@db.internal:5432/prod
ERROR  Could not refresh access token`;

const after = `Hey ChatGPT, can you help me debug this?

[2026-04-12 14:08:12] INFO request_id=req_8a7b2c
  user_email=[EMAIL_MASKED]
  user_phone=[PHONE_MASKED]
  api_key=[OPENAI_API_KEY_MASKED]
  authorization=Bearer [BEARER_TOKEN_MASKED]
  db_url=[POSTGRES_URI_MASKED]
ERROR  Could not refresh access token`;

export default function Page() {
  return (
    <LandingShell
      eyebrow="Safe ChatGPT Paste · Browser-only"
      title={
        <>
          Stop pasting{" "}
          <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
            secrets
          </span>{" "}
          into ChatGPT.
        </>
      }
      blurb={
        <>
          Every day, developers paste production logs, API keys, JWTs, customer
          PII, and database URLs into ChatGPT to debug things faster. Most
          don&apos;t realise the data leaves their network. FixAIPrompt scans
          your paste{" "}
          <strong className="text-ink">before</strong> you share it — locally,
          in your browser — and gives you a safe version.
        </>
      }
      exampleBefore={before}
      exampleAfter={after}
      bullets={[
        "Detects API keys, JWTs, bearer tokens, private key blocks, and database connection strings — even ones you forgot were in the log.",
        "Catches PII (emails, phones, SSNs, Aadhaar, credit cards) automatically.",
        "Falls back to high-entropy detection so unknown secret formats still get flagged.",
        "100% client-side. The detector and masker run as JavaScript in your browser. We never see your paste.",
        "Free, no signup. Bookmark it and use it as your habit-loop before opening ChatGPT.",
      ]}
    />
  );
}
