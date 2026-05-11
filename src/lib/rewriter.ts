import type { LintIssue } from "./linter";

export type TargetModel =
  | "claude"
  | "gpt"
  | "gemini"
  | "cursor"
  | "copilot"
  | "generic";

export const TARGET_MODELS: { value: TargetModel; label: string; hint: string }[] = [
  { value: "claude", label: "Claude (Anthropic)", hint: "Conversational, XML-tag friendly, strong reasoning" },
  { value: "gpt", label: "ChatGPT / GPT-4", hint: "Markdown-friendly, role-driven" },
  { value: "gemini", label: "Gemini", hint: "Concise instructions, structured output" },
  { value: "cursor", label: "Cursor (coding agent)", hint: "Code-context aware, file-scoped" },
  { value: "copilot", label: "GitHub Copilot Chat", hint: "Editor-context aware, inline-fix focused" },
  { value: "generic", label: "Generic / model-agnostic", hint: "Works across most chat LLMs" },
];

const MODEL_NOTES: Record<TargetModel, string> = {
  claude:
    "Optimize for Claude: use clear XML tags like <task>, <context>, <output_format> when structure helps; favor direct natural language over JSON-schema-heavy prompts; allow the model to think step by step where useful.",
  gpt:
    "Optimize for ChatGPT/GPT-4: use markdown headings and numbered steps; system-style 'You are…' role works well; specify the output format precisely.",
  gemini:
    "Optimize for Gemini: keep instructions tight and bulleted; explicitly state the output schema; avoid ambiguity.",
  cursor:
    "Optimize for Cursor: be specific about which files / functions / symbols are in scope; describe the desired diff or behavior; mention edge cases the agent must preserve.",
  copilot:
    "Optimize for Copilot Chat: write as if you're sitting in the editor; reference the current file, function name, and the exact behavior you want.",
  generic:
    "Make it model-agnostic: clear role, explicit task, concrete output format, and at least one example.",
};

const ANTHROPIC_MODEL = "claude-sonnet-4-5";

export type RewriteParams = {
  apiKey: string;
  prompt: string;
  target: TargetModel;
  issues: LintIssue[];
};

export type RewriteResult = {
  rewritten: string;
  rationale: string;
};

function buildSystemPrompt(): string {
  return `You are "FixAIPrompt", an expert prompt engineer. The user will give you:
- their original prompt (which is rough / imperfect)
- a list of lint findings (issues a static linter detected)
- the target model the prompt is for

Your job:
1. Rewrite the user's prompt so it is dramatically clearer, more specific, and more likely to produce a great response on the target model.
2. PRESERVE the user's original intent and topic — never change what they're asking about.
3. ADD: a clear role/persona, an explicit task, a precise output format, length and audience constraints, and (when the task is non-trivial) a brief example.
4. REMOVE: hedging, politeness fluff, contradictions, and vague phrasing.
5. Tailor the structure to the target model's strengths.

Return STRICT JSON only, matching this schema:
{
  "rewritten": "the improved prompt, ready to paste into the target model",
  "rationale": "2-4 sentences explaining the key changes you made and why"
}

Do not include any text outside the JSON. Do not wrap in markdown fences.`;
}

function buildUserMessage(prompt: string, target: TargetModel, issues: LintIssue[]): string {
  const issueLines = issues.length
    ? issues
        .map((i) => `- [${i.severity.toUpperCase()}] ${i.title}: ${i.message}`)
        .join("\n")
    : "(no static lint issues detected — improve clarity, structure, and specificity anyway)";

  return `Target model: ${target}
Notes for this target: ${MODEL_NOTES[target]}

Lint findings:
${issueLines}

Original prompt (between <<<>>>):
<<<
${prompt}
>>>

Rewrite it. Return JSON only.`;
}

export async function rewriteWithClaude(params: RewriteParams): Promise<RewriteResult> {
  const { apiKey, prompt, target, issues } = params;

  if (!apiKey?.trim()) {
    throw new Error("API key is required. Paste your Anthropic API key (starts with 'sk-ant-').");
  }
  if (!prompt?.trim()) {
    throw new Error("Prompt is empty.");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey.trim(),
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 2048,
      system: buildSystemPrompt(),
      messages: [
        {
          role: "user",
          content: buildUserMessage(prompt, target, issues),
        },
      ],
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j?.error?.message || JSON.stringify(j);
    } catch {
      detail = await res.text();
    }
    throw new Error(`Claude API error (${res.status}): ${detail || res.statusText}`);
  }

  const data = await res.json();
  const text: string =
    data?.content?.[0]?.type === "text" ? data.content[0].text : "";

  if (!text) {
    throw new Error("Empty response from Claude.");
  }

  const parsed = safeParseJson(text);
  if (!parsed || typeof parsed.rewritten !== "string") {
    throw new Error(
      "Couldn't parse the model's response as JSON. Raw output:\n\n" + text
    );
  }

  return {
    rewritten: parsed.rewritten,
    rationale: typeof parsed.rationale === "string" ? parsed.rationale : "",
  };
}

function safeParseJson(text: string): any {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first >= 0 && last > first) {
      try {
        return JSON.parse(trimmed.slice(first, last + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}
