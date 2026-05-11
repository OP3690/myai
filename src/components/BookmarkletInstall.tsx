"use client";

import { Bookmark, Mouse } from "lucide-react";

// Minified bookmarklet: read clipboard, open Safe Paste with the content prefilled via sessionStorage.
const BOOKMARKLET_JS = `javascript:(async()=>{try{const t=await navigator.clipboard.readText();sessionStorage.setItem('fixaiprompt.bookmarklet',t);window.open('https://fixaiprompt.com/safe-paste?from=bookmarklet','_blank');}catch(e){window.open('https://fixaiprompt.com/safe-paste','_blank');}})();`;

export function BookmarkletInstall() {
  return (
    <div className="card relative overflow-hidden p-5 sm:p-6">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/10 via-transparent to-accent-cyan/10" />
      <div className="grid items-start gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-glow">
            <Bookmark className="h-3 w-3" />
            One-click safe paste
          </div>
          <h3 className="text-lg font-bold text-ink sm:text-xl">
            Install the bookmarklet
          </h3>
          <p className="mt-1.5 text-sm text-ink-dim">
            Drag the button below to your bookmarks bar. From now on, anywhere
            you copy something — a log line, a JSON blob, a config — click
            this bookmark to scan it in Safe Paste before pasting into ChatGPT
            or Claude. Zero install, no extension permissions.
          </p>
          <ol className="mt-4 space-y-1.5 text-sm text-ink-dim">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-glow" />
              <span>Show your bookmarks bar (Cmd/Ctrl + Shift + B).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-glow" />
              <span>Drag the &quot;Scan with FixAIPrompt&quot; button into it.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-glow" />
              <span>Copy something risky → click the bookmark → see the leak score before paste.</span>
            </li>
          </ol>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href={BOOKMARKLET_JS}
            onClick={(e) => e.preventDefault()}
            draggable
            className="inline-flex cursor-grab items-center gap-2 rounded-xl border border-accent/40 bg-accent/15 px-5 py-3 text-sm font-semibold text-accent-glow shadow-glow transition hover:bg-accent/25 active:cursor-grabbing"
            title="Drag me to your bookmarks bar"
          >
            <Bookmark className="h-4 w-4" />
            Scan with FixAIPrompt
          </a>
          <p className="inline-flex items-center gap-1.5 text-xs text-ink-fade">
            <Mouse className="h-3 w-3" /> Drag to bookmarks bar
          </p>
        </div>
      </div>
    </div>
  );
}
