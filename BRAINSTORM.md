# fixaiprompt.com — Brainstorm

## Domain
fixaiprompt.com — self-marketing, ties directly to the product promise.

## Target audience
- Developers (Cursor / Claude Code / Copilot / ChatGPT users)
- Students (homework, study, explanations)
- Teachers (lesson plans, rubrics, quiz generation)
- Normal users (better everyday AI results)

## Working product concept

### Hero tool: Prompt Linter + Rewriter
Paste a messy prompt → get back:
1. Inline lint warnings, like a code linter
   - Vague verbs ("help me with", "do something about")
   - No output format specified
   - No examples / few-shot context
   - Contradicting instructions
   - Ambiguous pronouns / references
   - Missing role / persona
   - Missing constraints (length, tone, audience)
2. Rewritten version side-by-side
3. Model-specific optimization (Claude / GPT / Gemini / Cursor / Copilot)

### Supporting tools
1. **Prompt Templates Library** — categorized, editable templates (dev / study / teach / write / research)
2. **Prompt Debugger** — paste prompt + bad output → diagnose why it failed
3. **Model Translator** — same prompt, rewritten optimally for each model
4. **Persona Generator** — battle-tested expert role prompts
5. **Blog** — SEO surface: "Top 10 prompt mistakes", "Prompt Claude vs GPT", "Prompts for teachers", etc.

## Key architectural decision

**Local-only vs. AI-powered backend**
- Local lint rules: free, instant, ships fast, limited intelligence
- LLM-backed rewriter: smart output, but API costs (need rate-limit / signup / ads)

Pragmatic split:
- Rules-based linter runs **locally / client-side** (free hook)
- Rewriter calls an **LLM** (gated value)

## Open decisions
- [ ] Tech stack (Next.js 14 like unblockdevs? Astro? Vite + React?)
- [ ] LLM provider for rewriter (Claude API? OpenAI? Both? User-supplied key?)
- [ ] Free vs. signup-gated vs. ad-supported
- [ ] MVP scope — start with linter only, or linter + rewriter together?
- [ ] Brand / color palette / logo direction
