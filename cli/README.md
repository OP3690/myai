# fixaiprompt CLI

> Lint, score, and rewrite any AI prompt — from your terminal.

A pure-TypeScript port of the [fixaiprompt.com](https://fixaiprompt.com) linter and auto-fixer.

- **No API keys.** Runs entirely locally; no network calls.
- **No accounts.** No telemetry.
- **Same engine** as the web app — task-type detection (10 categories), 5-metric scoring (clarity / context / structure / specificity / risk), per-model rendering (Claude / GPT / Gemini / plain).

## Install

```bash
# one-shot
npx fixaiprompt "your prompt here"

# global install
npm install -g fixaiprompt
fixaiprompt "your prompt"
```

## Usage

```bash
# Pretty mode — shows score, metrics, issues, corrected prompt
fixaiprompt "help me write a blog about ai"

# Pipe stdin
echo "fix this bug" | fixaiprompt
cat prompt.txt | fixaiprompt

# Only the corrected prompt (pipe-friendly)
fixaiprompt --raw "help me write a blog" > improved.txt
fixaiprompt --raw "help me write a blog" | pbcopy

# Render for a specific model
fixaiprompt --model claude "fix this bug in my react app"
fixaiprompt --model gpt --raw "explain quantum to a kid" | tee -

# Full JSON report
fixaiprompt --json "compare react vs vue" | jq .

# Disable colors (for CI / logs)
fixaiprompt --no-color "your prompt"
```

## Flags

| Flag | What it does |
|---|---|
| `--improve` | Print corrected prompt + score (default). |
| `--raw` | Print only the corrected prompt — no headers, no colors. |
| `--json` | Full structured report as JSON. |
| `--model <model>` | Target model: `claude` \| `gpt` \| `gemini` \| `plain`. Default: `plain`. |
| `--no-color` | Disable ANSI colors. |
| `--help`, `-h` | This message. |

## What's the same as the web app

- Task type detection — `generative-writing`, `generative-code`, `analytical`, `educational`, `extraction`, `transformation`, `decisional`, `creative`, `conversational`, `general`.
- 5-metric scoring with severity-weighted penalties.
- Auto-rewriter that strips vague openers / politeness fluff / weak hedges / contradictions, then adds role / format / length / audience / example / safeguard tailored to the detected task.
- Model-specific rendering (Claude XML tags, GPT markdown, Gemini bulleted, plain prose).

## What's web-only (for now)

- Templates, Glossary, Chunker, Safe Paste, Prompt Diff, share cards, OG images — those live at [fixaiprompt.com](https://fixaiprompt.com).

## License

MIT.

## Links

- Web: [fixaiprompt.com](https://fixaiprompt.com)
