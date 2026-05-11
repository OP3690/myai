import type { LintIssue } from "./linter";

export type TargetModel =
  | "claude"
  | "gpt"
  | "gemini"
  | "grok"
  | "cursor"
  | "copilot"
  | "generic";

export type Personality =
  | "default"
  | "professor"
  | "hacker"
  | "therapist"
  | "mentor"
  | "ceo"
  | "comedian"
  | "product-manager";

export type Style =
  | "default"
  | "concise"
  | "detailed"
  | "beginner"
  | "expert"
  | "viral"
  | "persuasive"
  | "technical"
  | "emotional";

export type Level = "beginner" | "intermediate" | "expert" | "god-mode";

export type RewriteMode = "improve" | "roast";

export const TARGET_MODELS: { value: TargetModel; label: string; hint: string }[] = [
  { value: "claude", label: "Claude (Anthropic)", hint: "Conversational, XML-tag friendly, strong reasoning" },
  { value: "gpt", label: "ChatGPT / GPT-4", hint: "Markdown-friendly, role-driven" },
  { value: "gemini", label: "Gemini", hint: "Concise instructions, structured output" },
  { value: "grok", label: "Grok (xAI)", hint: "Direct, irreverent — short prompts work well" },
  { value: "cursor", label: "Cursor (coding agent)", hint: "Code-context aware, file-scoped" },
  { value: "copilot", label: "GitHub Copilot Chat", hint: "Editor-context aware, inline-fix focused" },
  { value: "generic", label: "Generic / model-agnostic", hint: "Works across most chat LLMs" },
];

export const PERSONALITIES: { value: Personality; label: string; emoji: string }[] = [
  { value: "default", label: "Default", emoji: "✨" },
  { value: "professor", label: "Professor", emoji: "🎓" },
  { value: "hacker", label: "Hacker", emoji: "💻" },
  { value: "therapist", label: "Therapist", emoji: "🛋️" },
  { value: "mentor", label: "Mentor", emoji: "🤝" },
  { value: "ceo", label: "CEO", emoji: "📈" },
  { value: "comedian", label: "Comedian", emoji: "🎭" },
  { value: "product-manager", label: "Product Manager", emoji: "📋" },
];

export const STYLES: { value: Style; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "concise", label: "Concise" },
  { value: "detailed", label: "Detailed" },
  { value: "beginner", label: "Beginner-friendly" },
  { value: "expert", label: "Expert" },
  { value: "viral", label: "Viral" },
  { value: "persuasive", label: "Persuasive" },
  { value: "technical", label: "Technical" },
  { value: "emotional", label: "Emotional" },
];

export const LEVELS: { value: Level; label: string; hint: string }[] = [
  { value: "beginner", label: "Beginner", hint: "Friendly, lots of structure, explains the why." },
  { value: "intermediate", label: "Intermediate", hint: "Solid prompt — clear role, format, and constraints." },
  { value: "expert", label: "Expert", hint: "Optimized prompt with examples, edge cases, and tight output spec." },
  { value: "god-mode", label: "God Mode", hint: "Chain-of-thought, multi-stage, defensive against hallucination." },
];

const PERSONALITY_PROMPT: Record<Personality, string> = {
  default: "",
  professor:
    "Style: write the rewritten prompt as if the user is asking an actual university professor. Add a brief 'context' section that establishes academic framing.",
  hacker:
    "Style: write the rewritten prompt with the directness and concision of a senior engineer talking to another senior engineer. Strip all niceties. Be technical.",
  therapist:
    "Style: write the rewritten prompt as if framing the request to a thoughtful, non-judgmental coach. Emphasize emotional safety, reflection, and listening before advice.",
  mentor:
    "Style: write the rewritten prompt as if asked to a trusted mentor. Encourage Socratic questioning back to the user where appropriate.",
  ceo:
    "Style: write the rewritten prompt as if asked to a high-leverage operator. Get to the point fast, prioritize outcomes, force a recommendation with confidence levels.",
  comedian:
    "Style: write the rewritten prompt with light, dry wit. Keep the substance serious but the surrounding language playful and memorable.",
  "product-manager":
    "Style: write the rewritten prompt with PM-style clarity: stated problem, success criteria, constraints, and explicit non-goals.",
};

const STYLE_PROMPT: Record<Style, string> = {
  default: "",
  concise: "Output style: optimize for brevity. Reduce token count without losing essential structure. Prefer bullet points and short imperatives.",
  detailed: "Output style: be thorough. Include explicit role, format, length, audience, example, and constraints. Aim for completeness over brevity.",
  beginner: "Output style: assume the AI will explain like to a complete beginner. Add 'explain in plain English', define jargon inline, and ask for analogies.",
  expert: "Output style: assume the AI is talking to a domain expert. Skip basics, use precise terminology, and request advanced edge-case coverage.",
  viral: "Output style: optimize the output for shareability — punchy, contrarian framing, specific numbers, and a clear payoff. Best for social content.",
  persuasive: "Output style: structure the prompt so the output is naturally persuasive — open with the most compelling point, use specific evidence, end with a clear call to action.",
  technical: "Output style: code-, math-, or engineering-heavy. Require precise notation, fully runnable examples, and explicit failure modes.",
  emotional: "Output style: tone should be warm and human. Acknowledge feelings, avoid clinical language, and lead with empathy before logic.",
};

const LEVEL_PROMPT: Record<Level, string> = {
  beginner:
    "Sophistication: produce a Level-1 (beginner) prompt. Include a clear role, a one-line task, and an explicit format. Keep it short — under 80 words. Do not include examples or chain-of-thought instructions.",
  intermediate:
    "Sophistication: produce a Level-2 (intermediate) prompt. Include role, task, format, length, and audience. 80–150 words. Optional: one short example.",
  expert:
    "Sophistication: produce a Level-3 (expert) prompt. Include role, task, format, length, audience, constraints, and at least one input→output example. Add 'if uncertain, ask' instructions. 150–300 words.",
  "god-mode":
    "Sophistication: produce a Level-4 (God Mode) prompt. Include all of the above plus: explicit chain-of-thought scaffolding, anti-hallucination guardrails (e.g. 'cite or say I don't know'), edge-case enumeration, a self-critique step, and an output schema. Aim for the highest possible answer quality at the cost of length.",
};

const MODEL_NOTES: Record<TargetModel, string> = {
  claude:
    "Optimize for Claude: use clear XML tags like <task>, <context>, <output_format> when structure helps; favor direct natural language over JSON-schema-heavy prompts; allow the model to think step by step where useful.",
  gpt:
    "Optimize for ChatGPT/GPT-4: use markdown headings and numbered steps; system-style 'You are…' role works well; specify the output format precisely.",
  gemini:
    "Optimize for Gemini: keep instructions tight and bulleted; explicitly state the output schema; avoid ambiguity.",
  grok:
    "Optimize for Grok: short prompts with direct, slightly irreverent framing tend to work well. Avoid over-engineering the structure.",
  cursor:
    "Optimize for Cursor: be specific about which files / functions / symbols are in scope; describe the desired diff or behavior; mention edge cases the agent must preserve.",
  copilot:
    "Optimize for Copilot Chat: write as if you're sitting in the editor; reference the current file, function name, and the exact behavior you want.",
  generic:
    "Make it model-agnostic: clear role, explicit task, concrete output format, and at least one example.",
};

const ANTHROPIC_MODEL = "claude-sonnet-4-5";
const WATERMARK = "\n\n---\n_Optimized with FixAIPrompt.com_";

export type RewriteParams = {
  apiKey: string;
  prompt: string;
  target: TargetModel;
  issues: LintIssue[];
  personality?: Personality;
  style?: Style;
  level?: Level;
  mode?: RewriteMode;
  watermark?: boolean;
};

export type RewriteResult = {
  rewritten: string;
  rationale: string;
  roast?: string;
};

function buildSystemPrompt(mode: RewriteMode): string {
  if (mode === "roast") {
    return `You are "FixAIPrompt Roast Mode" — a witty, dry-humored prompt-engineering critic. The user will give you:
- their original prompt
- a list of lint findings
- the target model

Your job:
1. Roast the prompt. Be funny — observational, dry, slightly mean but never cruel. No insults about the person.
2. After the roast, rewrite the prompt dramatically better.
3. Add a one-line "expected quality boost" estimate (e.g. "+220% — model finally knows what you want").

Return STRICT JSON only, matching this schema:
{
  "roast": "the funny analysis, 3–6 sentences, no bullet points",
  "rewritten": "the improved prompt, ready to paste",
  "rationale": "1–2 sentences on the most important changes you made"
}

Do not include any text outside the JSON. Do not wrap in markdown fences.`;
  }

  return `You are "FixAIPrompt", an expert prompt engineer. The user will give you:
- their original prompt (which is rough / imperfect)
- a list of lint findings (issues a static linter detected)
- the target model the prompt is for
- optional modifiers: sophistication level, personality, output style

Your job:
1. Rewrite the user's prompt so it is dramatically clearer, more specific, and more likely to produce a great response on the target model.
2. PRESERVE the user's original intent and topic — never change what they're asking about.
3. ADD: a clear role/persona, an explicit task, a precise output format, length and audience constraints, and (when the task is non-trivial) a brief example.
4. REMOVE: hedging, politeness fluff, contradictions, and vague phrasing.
5. Tailor the structure to the target model's strengths AND respect the requested level/personality/style modifiers.

Return STRICT JSON only, matching this schema:
{
  "rewritten": "the improved prompt, ready to paste into the target model",
  "rationale": "2-4 sentences explaining the key changes you made and why"
}

Do not include any text outside the JSON. Do not wrap in markdown fences.`;
}

function buildUserMessage(params: RewriteParams): string {
  const {
    prompt,
    target,
    issues,
    personality = "default",
    style = "default",
    level = "expert",
    mode = "improve",
  } = params;

  const issueLines = issues.length
    ? issues
        .map((i) => `- [${i.severity.toUpperCase()}] ${i.title}: ${i.message}`)
        .join("\n")
    : "(no static lint issues detected — improve clarity, structure, and specificity anyway)";

  const modifierLines: string[] = [];
  if (personality !== "default" && PERSONALITY_PROMPT[personality]) {
    modifierLines.push(`Personality: ${PERSONALITY_PROMPT[personality]}`);
  }
  if (style !== "default" && STYLE_PROMPT[style]) {
    modifierLines.push(STYLE_PROMPT[style]);
  }
  if (mode === "improve") {
    modifierLines.push(LEVEL_PROMPT[level]);
  }

  return `Target model: ${target}
Notes for this target: ${MODEL_NOTES[target]}

${modifierLines.length ? `Modifiers:\n${modifierLines.join("\n")}\n\n` : ""}Lint findings:
${issueLines}

Original prompt (between <<<>>>):
<<<
${prompt}
>>>

${mode === "roast" ? "Roast it, then rewrite it. Return JSON only." : "Rewrite it. Return JSON only."}`;
}

export async function rewriteWithClaude(params: RewriteParams): Promise<RewriteResult> {
  const { apiKey, prompt, mode = "improve", watermark = false } = params;

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
      system: buildSystemPrompt(mode),
      messages: [
        {
          role: "user",
          content: buildUserMessage(params),
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

  let rewritten = parsed.rewritten as string;
  if (watermark) rewritten = rewritten.trimEnd() + WATERMARK;

  return {
    rewritten,
    rationale: typeof parsed.rationale === "string" ? parsed.rationale : "",
    roast: typeof parsed.roast === "string" ? parsed.roast : undefined,
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
