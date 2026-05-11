#!/usr/bin/env node
import { lintPrompt } from "./lint.js";
import { improvePrompt, renderForModel, type TargetModel } from "./improve.js";

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const positional = args.filter((a) => !a.startsWith("--"));

const HELP = `\nfixaiprompt — lint, score, and rewrite any AI prompt from your terminal.\n\nUsage\n  fixaiprompt "your prompt"\n  echo "your prompt" | fixaiprompt\n  fixaiprompt --json "your prompt"\n  fixaiprompt --model claude "your prompt"\n  fixaiprompt --improve "your prompt"        # default: prints corrected prompt + score\n  fixaiprompt --raw "your prompt"            # prints only the corrected prompt (pipe-friendly)\n\nFlags\n  --improve     Print the corrected prompt (default behaviour).\n  --raw         Print only the corrected prompt, no headers/colors — pipe-friendly.\n  --json        Output full report as JSON.\n  --model       Target model for rendering: claude | gpt | gemini | plain (default: plain)\n  --no-color    Disable ANSI colors.\n  --help, -h    This message.\n\nExamples\n  fixaiprompt "help me write a blog about ai"\n  cat prompt.txt | fixaiprompt --raw > improved.txt\n  fixaiprompt --json "compare react vs vue" | jq .\n  fixaiprompt --model claude --raw "fix this bug" | pbcopy\n\nWeb: https://fixaiprompt.com  (same engine, in your browser)\n`;

function showHelp() {
  console.log(HELP);
}

if (flags.has("--help") || flags.has("-h")) {
  showHelp();
  process.exit(0);
}

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return "";
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

const NO_COLOR = flags.has("--no-color") || !!process.env.NO_COLOR;

function c(code: string, s: string): string {
  if (NO_COLOR) return s;
  return `[${code}m${s}[0m`;
}
const bold = (s: string) => c("1", s);
const dim = (s: string) => c("2", s);
const cyan = (s: string) => c("36", s);
const green = (s: string) => c("32", s);
const yellow = (s: string) => c("33", s);
const red = (s: string) => c("31", s);
const violet = (s: string) => c("35", s);

function colorScore(n: number): string {
  if (n >= 80) return green(String(n));
  if (n >= 50) return yellow(String(n));
  return red(String(n));
}

(async () => {
  let input = positional.join(" ").trim();
  if (!input) input = (await readStdin()).trim();
  if (!input) {
    showHelp();
    process.exit(0);
  }

  const lint = lintPrompt(input);
  const improved = improvePrompt(input);

  const modelArgIdx = args.indexOf("--model");
  const model: TargetModel =
    modelArgIdx >= 0 && args[modelArgIdx + 1]
      ? (args[modelArgIdx + 1] as TargetModel)
      : "plain";
  const rendered = renderForModel(improved, model);

  // JSON mode
  if (flags.has("--json")) {
    console.log(
      JSON.stringify(
        {
          input,
          lint,
          improved: { ...improved, rendered },
        },
        null,
        2
      )
    );
    return;
  }

  // Raw mode — only the corrected prompt
  if (flags.has("--raw")) {
    process.stdout.write(rendered + "\n");
    return;
  }

  // Pretty mode (default)
  console.log("");
  console.log(bold(violet("┌─ FixAIPrompt — terminal mode ────────────────────────────")));
  console.log("");
  console.log(`  ${bold("Score:")}      ${colorScore(lint.score)}/100`);
  console.log(`  ${bold("Task type:")} ${cyan(improved.taskType)}`);
  if (improved.topic) console.log(`  ${bold("Topic:")}      ${dim(improved.topic)}`);
  console.log(
    `  ${bold("Metrics:")}    ` +
      [
        `clarity ${colorScore(lint.metrics.clarity)}`,
        `context ${colorScore(lint.metrics.context)}`,
        `structure ${colorScore(lint.metrics.structure)}`,
        `specificity ${colorScore(lint.metrics.specificity)}`,
        `risk ${colorScore(lint.metrics.risk)}`,
      ].join("  ")
  );
  console.log("");
  if (lint.issues.length) {
    console.log(bold(red(`  ${lint.issues.length} issue${lint.issues.length === 1 ? "" : "s"} found:`)));
    for (const i of lint.issues.slice(0, 10)) {
      console.log(`    • ${i.title} ${dim("— " + i.fix)}`);
    }
    if (lint.issues.length > 10) console.log(dim(`    … and ${lint.issues.length - 10} more`));
    console.log("");
  }
  console.log(bold(green(`  Corrected prompt (${model}):`)));
  console.log("");
  console.log(rendered.split("\n").map((l) => "    " + l).join("\n"));
  console.log("");
  console.log(dim("  Web version: https://fixaiprompt.com"));
  console.log("");
})();
