# FixAIPrompt

> **The privacy layer for AI.** Fix prompts. Remove secrets. Use AI safely.

A free, 100% client-side toolkit that helps anyone use AI more safely and effectively. No accounts, no API keys, no tracking — every tool runs as JavaScript in your own browser.

Live at **[fixaiprompt.com](https://fixaiprompt.com)** (deploy steps in [`DEPLOY.md`](./DEPLOY.md)).

---

## Tools

| Tool | What it does | Path |
|---|---|---|
| **Prompt Fixer** | Task-aware prompt rewriting with 5-metric scoring (clarity / context / structure / specificity / risk). Auto-detects task type and renders for Claude / ChatGPT / Gemini. | `/fix` |
| **Safe Paste** | Detects 30+ secret types (AWS, OpenAI, Anthropic, GitHub, Stripe, JWTs, …) and PII in any text you paste. Generates a masked version with an AI Leak Score. | `/safe-paste` |
| **Prompt Chunker** | Two tools in one. Chunk long text into model-ready pieces (9 model presets), or decompose a complex prompt into a chain of focused sub-prompts. | `/chunker` |
| **CSV / JSON Cleaner** | Paste a dataset, see column-by-column PII auto-classification, toggle which to mask, download the cleaned file. | `/data-cleaner` |
| **Prompt Diff** | Compare two prompts side-by-side, see which scores higher on each metric, get an automatic "why X wins" explanation. | `/prompt-diff` |
| **Templates** | 58 prompt templates — 27 advanced techniques (Chain-of-Thought, Tree-of-Thoughts, Self-Refine, Multi-Persona Debate, Pre-Mortem, Adversarial Red-Team, etc.) — each interactive with fill-in fields and one-click sample values. | `/templates` |
| **Glossary** | 16 prompt-engineering techniques explained in plain English — when to use, when not, how it works, common pitfalls. | `/glossary` |

Plus a [browser extension MVP](./extension) and a [`npx fixaiprompt` CLI](./cli).

---

## Stack

- **Next.js 14** (App Router, static + edge OG images)
- **TypeScript** + **Tailwind CSS**
- **No backend.** Everything runs in the browser. No database, no auth, no API.
- 91 statically-rendered pages, all under 156 kB First Load JS.

---

## Run locally

```bash
git clone https://github.com/OP3690/myai.git fixaiprompt
cd fixaiprompt
npm install
npm run dev
# → http://localhost:3000
```

Production build:
```bash
npm run build && npm start
```

---

## Project layout

```
src/
├── app/               # Next.js App Router pages
│   ├── fix/           # Prompt Fixer
│   ├── safe-paste/    # Secret detector + masker
│   ├── chunker/       # Text chunker + task decomposer
│   ├── data-cleaner/  # CSV / JSON PII stripper
│   ├── prompt-diff/   # Two-prompt comparison
│   ├── templates/     # 58 prompt templates (+ /[slug])
│   ├── glossary/      # 16 technique explainers
│   └── ...            # SEO landing pages, /tools, /about, /changelog
├── components/        # React components (all client where needed)
└── lib/
    ├── linter.ts      # Multi-metric prompt scoring rules
    ├── autoFix.ts     # Task-aware prompt rewriter
    ├── detector.ts    # Secret + PII regex engine (30+ rules)
    ├── masker.ts      # Plain / JSON / SQL-aware masking
    ├── chunker.ts     # Text chunker + task decomposer
    ├── dataCleaner.ts # Column-aware CSV / JSON cleaner
    ├── templates.ts   # 58 prompt template definitions
    ├── glossary.ts    # 16 glossary entries
    ├── og.tsx         # Shared OpenGraph image builder
    └── ...

cli/                   # `npx fixaiprompt` CLI (TypeScript, dist included)
extension/             # Browser extension MVP (Manifest V3)
```

---

## Deploy

See [`DEPLOY.md`](./DEPLOY.md) for a full Vercel + DNS walkthrough.

TL;DR:
```bash
npm i -g vercel
vercel login
vercel --prod
```

Then add the DNS records (apex A + www CNAME) shown by the Vercel dashboard.

---

## Privacy stance

Every operation runs in your browser. There is no server-side processing. There is no database. There is no API the site calls. The only things that ever leave your machine are:

- Static page assets from Vercel's CDN.
- The OG image edge functions, which receive only the URL of the page being shared (no body).

If anything in the repo or the site contradicts this, file an issue.

---

## License

MIT. See [`LICENSE`](./LICENSE).

---

## Contributing

PRs welcome. The codebase is small, pure-TS, and dependency-light by design — adding a new lint rule or template is a 10-line PR.

- **New advanced template?** Add a `Template` entry in `src/lib/templates.ts` with `advanced: true`.
- **New glossary entry?** Add to `src/lib/glossary.ts`.
- **New detection rule?** Add a `Rule` entry in `src/lib/detector.ts`.
- **New SEO landing?** Drop a folder under `src/app/<slug>/page.tsx` using `LandingShell`.
