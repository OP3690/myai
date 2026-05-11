import type { Metadata } from "next";
import { LandingShell } from "@/components/LandingShell";

export const metadata: Metadata = {
  title: "Sanitize Logs for AI — Remove secrets and PII from log files",
  description:
    "Paste production logs and share them with ChatGPT or Claude without leaking tokens, customer emails, or DB credentials. Detection runs entirely in your browser.",
  alternates: { canonical: "/sanitize-logs-for-ai" },
};

const before = `[2026-04-12 09:02:11] INFO  POST /api/v1/charges  user_id=u_8923
[2026-04-12 09:02:11] DEBUG  authorization=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1ODkyMyJ9.kS8s_LpQrTuVwXyZ012aBcDeFgHiJkLmNoPqRsTuVw
[2026-04-12 09:02:12] WARN  Card declined for raghav.menon@gmail.com (card_brand=visa, ipv4=49.207.181.22)
[2026-04-12 09:02:12] ERROR  Connection refused: postgres://acme:Hunt3r2$@db.internal:5432/payments
[2026-04-12 09:02:13] INFO  Retrying with backup db: mongodb+srv://prod:Sup3r@cluster0.abcde.mongodb.net/main
[2026-04-12 09:02:13] DEBUG  GITHUB_PAT=ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ012345abcd attempting deploy`;

const after = `[2026-04-12 09:02:11] INFO  POST /api/v1/charges  user_id=u_8923
[2026-04-12 09:02:11] DEBUG  authorization=Bearer [BEARER_TOKEN_MASKED]
[2026-04-12 09:02:12] WARN  Card declined for [EMAIL_MASKED] (card_brand=visa, ipv4=[IPV4_MASKED])
[2026-04-12 09:02:12] ERROR  Connection refused: [POSTGRES_URI_MASKED]
[2026-04-12 09:02:13] INFO  Retrying with backup db: [MONGO_URI_MASKED]
[2026-04-12 09:02:13] DEBUG  GITHUB_PAT=[GITHUB_TOKEN_MASKED] attempting deploy`;

export default function Page() {
  return (
    <LandingShell
      eyebrow="Sanitize Logs · 100% client-side"
      title={
        <>
          Sanitize logs before sharing them with{" "}
          <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
            AI
          </span>
          .
        </>
      }
      blurb={
        <>
          You&apos;re debugging a production incident at 2am. You paste the
          log into ChatGPT to get a faster answer. But that log has bearer
          tokens, a database URL, a customer email, an IP. Now it&apos;s on
          someone else&apos;s servers. FixAIPrompt strips all of that — in
          your browser — before you hit send.
        </>
      }
      exampleBefore={before}
      exampleAfter={after}
      bullets={[
        "Detects JWTs, bearer tokens, basic auth headers, and URL-embedded credentials.",
        "Masks database connection strings (Postgres, MySQL, MongoDB, Redis) including the embedded password.",
        "Strips customer PII (emails, phone numbers, IP addresses, SSNs) while keeping the structure of the log intact.",
        "Preserves request IDs, timestamps, levels, and HTTP details — the parts that matter for debugging stay readable.",
        "Free, no signup, no upload. Detection runs as JavaScript in your browser.",
      ]}
    />
  );
}
