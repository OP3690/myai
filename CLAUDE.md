# fixaiprompt.com

A tool site that helps people write better AI prompts. Audience spans developers, students, teachers, and everyday AI users.

## Owner context
- Owner also runs **unblockdevs.com** (`~/Desktop/unblockdevs`) — same playbook is the reference: focused tools + heavy SEO blog + Next.js 14 + TypeScript + Tailwind + MongoDB.
- Owner prefers shipping fast, SEO-first, and reusing the unblockdevs stack/patterns unless there's a strong reason to deviate.

## Product (working concept)

### Hero tool — Prompt Linter + Rewriter
Paste a prompt, get:
1. **Inline lint warnings** (rules-based, runs client-side):
   - Vague verbs, no output format, no examples, contradicting instructions, ambiguous references, missing role/persona, missing constraints (length/tone/audience).
2. **Rewritten version** side-by-side, optimized per target model (Claude / GPT / Gemini / Cursor / Copilot).

### Supporting tools (planned)
- Prompt Templates Library (dev / study / teach / write / research)
- Prompt Debugger (prompt + bad output → diagnose why it failed)
- Model Translator (same prompt, optimal version per model)
- Persona Generator (expert role prompts)
- Blog (SEO surface — "top 10 prompt mistakes", "Claude vs GPT prompting", "prompts for teachers", etc.)

## Architecture decisions (current direction, not final)

- **Stack:** Next.js 14 + TypeScript + Tailwind (same as unblockdevs)
- **Linter:** rules-based, runs **client-side**, free, zero cost
- **Rewriter:** **bring-your-own-key** at launch — user pastes their own Claude/OpenAI key, we pay zero API cost, no rate-limit drama. Revisit once traffic justifies a hosted offering.
- **MVP scope:** **Linter first** (1–2 days of work, fully static), then layer in Rewriter, then templates, then blog.

## Open decisions
- [ ] Final stack confirmation (Next.js 14 vs. alternative)
- [ ] LLM provider order for rewriter (Claude first? Multi-provider from day 1?)
- [ ] Free vs. signup-gated vs. ad-supported (likely free + ads, mirroring unblockdevs)
- [ ] Brand / color palette / logo direction
- [ ] Hosting (Vercel like unblockdevs?)

## Files
- [BRAINSTORM.md](BRAINSTORM.md) — original brainstorm with full reasoning and tradeoffs

## How to continue
This `CLAUDE.md` is auto-loaded when a Claude Code session is started from this directory. Next steps when ready: confirm stack → scaffold Next.js → build the linter rules engine → ship MVP page.
