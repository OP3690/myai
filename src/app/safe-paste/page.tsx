import type { Metadata } from "next";
import Link from "next/link";
import { BookmarkletInstall } from "@/components/BookmarkletInstall";
import { SafePaste } from "@/components/SafePaste";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { Shield, Lock, EyeOff, Zap } from "lucide-react";

export const metadata: Metadata = {
  title:
    "Safe Paste for ChatGPT, Claude & Gemini — Mask API Keys, JWTs & PII",
  description:
    "Free secret scanner for any text you paste into ChatGPT, Claude, Gemini, or Grok. Detects 30+ API keys, JWTs, private keys, database URIs, and PII — and gives you a redacted version with an AI Leak Score. 100% browser-only.",
  keywords: [
    "safe paste",
    "chatgpt safe paste",
    "claude safe paste",
    "ai secret scanner",
    "mask api keys",
    "redact pii",
    "jwt detector",
    "remove secrets before ai",
    "ai data loss prevention",
    "openai key scanner",
    "anthropic key scanner",
  ],
  alternates: { canonical: "/safe-paste" },
};

export default function SafePastePage() {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Shield className="h-3 w-3 text-accent-glow" />
            Safe Paste · 100% browser-only · No uploads
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Don&apos;t paste{" "}
            <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              secrets
            </span>{" "}
            into AI.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            Paste your log line, JSON dump, SQL, or API response.
            We detect <strong className="text-ink">API keys, JWTs, PII, credentials, and database secrets</strong> — and mask them before you share with ChatGPT, Claude, or any AI.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-ink-dim">
            <Pill icon={Lock} text="Runs entirely in your browser" />
            <span className="text-ink-fade">·</span>
            <Pill icon={EyeOff} text="No uploads, no logs, no tracking" />
            <span className="text-ink-fade">·</span>
            <Pill icon={Zap} text="Detects 30+ secret types" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <SafePaste />
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <BookmarkletInstall />
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            What gets detected
          </h2>
          <p className="mt-2 text-center text-ink-dim">
            Everything you probably shouldn&apos;t be pasting into a chat box.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetectionCard
              title="API keys"
              items={[
                "AWS access & secret keys",
                "OpenAI sk- and sk-proj-",
                "Anthropic sk-ant-",
                "GitHub ghp_/gho_/ghs_",
                "Stripe sk_live/pk_live",
                "Google AIza, Slack xox*",
                "SendGrid, Mailgun, Twilio",
              ]}
            />
            <DetectionCard
              title="Auth & tokens"
              items={[
                "JWTs",
                "Bearer tokens",
                "Basic auth headers",
                "Credentials embedded in URLs",
                "OAuth secrets",
              ]}
            />
            <DetectionCard
              title="Crypto material"
              items={[
                "RSA / DSA / EC private keys",
                "OpenSSH private keys",
                "PGP private blocks",
              ]}
            />
            <DetectionCard
              title="Infrastructure"
              items={[
                "MongoDB connection URIs",
                "Postgres / MySQL URIs",
                "Redis URIs",
                "S3 bucket URLs",
                ".env-style secret lines",
              ]}
            />
            <DetectionCard
              title="PII"
              items={[
                "Emails",
                "Phone numbers",
                "US SSNs",
                "Aadhaar (Verhoeff-validated)",
                "Credit cards (Luhn-validated)",
                "IPv4 / IPv6",
              ]}
            />
            <DetectionCard
              title="Unknown secrets"
              items={[
                "High-entropy strings (32+ chars, mixed alpha-num)",
                "Caught even when the format isn't standard",
              ]}
            />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">How it stays safe</h2>
          <div className="mt-8 space-y-4">
            <Faq
              q="Where does my pasted data go?"
              a="Nowhere. The detector and masker run as JavaScript in your browser. Nothing is sent to our servers — there is no server."
            />
            <Faq
              q="Do you log or analytics my content?"
              a="No. We don't run analytics on this page's content. The only thing we measure is page-level visits, which contain no pasted data."
            />
            <Faq
              q="Will it catch every secret?"
              a="No tool catches 100%. Safe Paste covers 30+ well-known patterns plus a high-entropy fallback that catches strings that look like secrets even when their format is unknown. Always glance at the masked output before pasting."
            />
            <Faq
              q="Can I mask JSON or SQL properly?"
              a="Yes. Switch the mode to JSON or SQL on the input pane. JSON mode parses your blob and replaces values for sensitive keys like password/token/api_key. SQL mode masks INSERT VALUES and WHERE clauses for sensitive column names."
            />
            <Faq
              q="Want it on your team?"
              a={
                <>
                  Yes — enterprise DLP for AI is the next step. <Link href="/" className="text-accent-glow hover:underline">Get in touch</Link> if your team needs this baked into your developer workflow.
                </>
              }
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Pill({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-emerald-400" /> {text}
    </span>
  );
}

function DetectionCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-dim">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-glow" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="card group p-5">
      <summary className="cursor-pointer list-none text-sm font-medium text-ink sm:text-base">
        <span className="mr-2 text-accent-glow">›</span>
        {q}
      </summary>
      <p className="mt-3 text-sm text-ink-dim">{a}</p>
    </details>
  );
}
