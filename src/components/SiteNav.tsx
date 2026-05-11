"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Shield, BookOpen } from "lucide-react";

const LINKS = [
  { href: "/fix", label: "Prompt Fixer", icon: Sparkles },
  { href: "/safe-paste", label: "Safe Paste", icon: Shield },
  { href: "/templates", label: "Templates", icon: BookOpen },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/20 ring-1 ring-accent/40">
            <Sparkles className="h-4 w-4 text-accent-glow" />
          </div>
          <span className="text-base font-semibold tracking-tight sm:text-lg">
            fixai<span className="text-accent-glow">prompt</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition sm:px-3 ${
                  active
                    ? "bg-accent/15 text-accent-glow"
                    : "text-ink-dim hover:bg-white/5 hover:text-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 text-sm sm:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-accent/20 ring-1 ring-accent/40">
              <Sparkles className="h-3.5 w-3.5 text-accent-glow" />
            </div>
            <span className="font-semibold">
              fixai<span className="text-accent-glow">prompt</span>
            </span>
          </div>
          <p className="mt-3 text-xs text-ink-fade">
            The privacy layer for AI. Fix prompts. Remove secrets. Use AI safely.
          </p>
        </div>
        <FooterCol
          title="Tools"
          links={[
            { href: "/fix", label: "Prompt Fixer" },
            { href: "/safe-paste", label: "Safe Paste" },
            { href: "/templates", label: "Prompt Templates" },
          ]}
        />
        <FooterCol
          title="Use cases"
          links={[
            { href: "/safe-chatgpt-paste", label: "Safe ChatGPT paste" },
            { href: "/mask-api-keys", label: "Mask API keys" },
            { href: "/sanitize-logs-for-ai", label: "Sanitize logs for AI" },
            { href: "/remove-pii-from-json", label: "Remove PII from JSON" },
          ]}
        />
        <FooterCol
          title="About"
          links={[
            { href: "/#how", label: "How it works" },
            { href: "/#faq", label: "FAQ" },
          ]}
        />
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-ink-fade">
        © {new Date().getFullYear()} FixAIPrompt · Everything runs in your browser. Your data never leaves.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
        {title}
      </h4>
      <ul className="mt-3 space-y-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-ink-dim transition hover:text-ink"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
