// ─── Token estimation ────────────────────────────────────────────────────
// Rough heuristic: 1 token ≈ 4 chars for English. Within ±10% of real tokenizer
// counts for typical prose. We round up to be safe.
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Slightly better than chars/4: weight whitespace differently and account for
  // the fact that very long words split into multiple BPE tokens.
  const chars = text.length;
  const words = (text.match(/\S+/g) || []).length;
  // Empirically: max(chars/4, words * 1.3) tracks GPT-style tokenization well.
  return Math.ceil(Math.max(chars / 4, words * 1.3));
}

// ─── Model presets ───────────────────────────────────────────────────────

export type ContextModel = {
  id: string;
  label: string;
  contextTokens: number;
  recommendedChunkTokens: number;
};

export const CONTEXT_MODELS: ContextModel[] = [
  { id: "gpt-3.5", label: "GPT-3.5 (16k)", contextTokens: 16_385, recommendedChunkTokens: 3_000 },
  { id: "gpt-4", label: "GPT-4 classic (8k)", contextTokens: 8_192, recommendedChunkTokens: 2_000 },
  { id: "gpt-4-turbo", label: "GPT-4 Turbo / GPT-4o (128k)", contextTokens: 128_000, recommendedChunkTokens: 8_000 },
  { id: "claude-haiku", label: "Claude Haiku (200k)", contextTokens: 200_000, recommendedChunkTokens: 8_000 },
  { id: "claude-sonnet", label: "Claude Sonnet (200k)", contextTokens: 200_000, recommendedChunkTokens: 12_000 },
  { id: "claude-opus", label: "Claude Opus (1M)", contextTokens: 1_000_000, recommendedChunkTokens: 32_000 },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro (1M)", contextTokens: 1_000_000, recommendedChunkTokens: 32_000 },
  { id: "llama-3", label: "Llama 3 (8k)", contextTokens: 8_192, recommendedChunkTokens: 2_000 },
  { id: "mistral-large", label: "Mistral Large (32k)", contextTokens: 32_768, recommendedChunkTokens: 6_000 },
  { id: "custom", label: "Custom", contextTokens: 32_768, recommendedChunkTokens: 4_000 },
];

// ─── Text chunking ───────────────────────────────────────────────────────

export type ChunkPrefixMode = "none" | "header" | "xml";

export type ChunkOptions = {
  chunkTokens: number;
  overlapTokens: number;
  prefix: ChunkPrefixMode;
};

export type Chunk = {
  index: number;
  total: number;
  content: string;
  decoratedContent: string;
  tokenEstimate: number;
  charRange: [number, number];
  startsAt: "paragraph" | "sentence" | "word" | "char";
  hasOverlap: boolean;
};

// Walk backwards from `target` to find the nearest sensible break point
// inside [min, target]. Returns the cut position and what kind of boundary it was.
function findBreakBackwards(
  text: string,
  target: number,
  min: number
): { cut: number; kind: Chunk["startsAt"] } {
  if (target >= text.length) return { cut: text.length, kind: "char" };

  // Try paragraph break (\n\n)
  for (let i = target; i >= min; i--) {
    if (text[i] === "\n" && text[i - 1] === "\n") {
      return { cut: i + 1, kind: "paragraph" };
    }
  }
  // Try sentence break (. ! ? followed by space or newline)
  for (let i = target; i >= min; i--) {
    if (/[.!?]/.test(text[i]) && (text[i + 1] === " " || text[i + 1] === "\n" || text[i + 1] === undefined)) {
      return { cut: i + 1, kind: "sentence" };
    }
  }
  // Try word break (whitespace)
  for (let i = target; i >= min; i--) {
    if (/\s/.test(text[i])) {
      return { cut: i + 1, kind: "word" };
    }
  }
  // Fall back to hard cut at target
  return { cut: target, kind: "char" };
}

export function chunkText(text: string, options: ChunkOptions): Chunk[] {
  const trimmed = text ?? "";
  if (!trimmed) return [];

  // Convert token budgets into approximate char budgets (1 tok ≈ 4 chars).
  const chunkChars = Math.max(50, options.chunkTokens * 4);
  const overlapChars = Math.max(0, Math.min(chunkChars - 50, options.overlapTokens * 4));

  const ranges: { start: number; end: number; kind: Chunk["startsAt"]; hasOverlap: boolean }[] = [];
  let cursor = 0;
  let lastKind: Chunk["startsAt"] = "paragraph";
  let firstChunk = true;

  while (cursor < trimmed.length) {
    const targetEnd = Math.min(trimmed.length, cursor + chunkChars);
    const minEnd = cursor + Math.floor(chunkChars * 0.6);
    let { cut, kind } =
      targetEnd >= trimmed.length
        ? { cut: trimmed.length, kind: "char" as Chunk["startsAt"] }
        : findBreakBackwards(trimmed, targetEnd, minEnd);
    if (cut <= cursor) cut = targetEnd; // safety
    ranges.push({
      start: cursor,
      end: cut,
      kind: firstChunk ? "paragraph" : lastKind,
      hasOverlap: !firstChunk,
    });
    if (cut >= trimmed.length) break;
    lastKind = kind;
    cursor = Math.max(cursor + 1, cut - overlapChars);
    firstChunk = false;
  }

  const total = ranges.length;
  return ranges.map((r, i) => {
    const content = trimmed.slice(r.start, r.end);
    const decoratedContent = decorate(content, i, total, options.prefix);
    return {
      index: i + 1,
      total,
      content,
      decoratedContent,
      tokenEstimate: estimateTokens(content),
      charRange: [r.start, r.end],
      startsAt: r.kind,
      hasOverlap: r.hasOverlap,
    };
  });
}

function decorate(content: string, idx: number, total: number, mode: ChunkPrefixMode): string {
  if (mode === "none") return content;
  if (mode === "header") {
    return `--- Chunk ${idx + 1} of ${total} ---\n${content}`;
  }
  // xml
  return `<chunk index="${idx + 1}" total="${total}">\n${content}\n</chunk>`;
}

// ─── Task decomposition ──────────────────────────────────────────────────

export type DecomposeStep = {
  number: number;
  title: string;
  goal: string;
  prompt: string;
  dependsOnPrior: boolean;
};

export type Decomposition = {
  isComplex: boolean;
  reasons: string[];
  steps: DecomposeStep[];
  summary: string;
};

const STAGE_VERBS = {
  research: /\b(research|investigate|gather|learn|study|review\s+(?:the\s+)?(?:literature|background))\b/i,
  analyze: /\b(analy[sz]e|evaluate|assess|critique|compare|breakdown)\b/i,
  plan: /\b(plan|outline|structure|design|architect|organize)\b/i,
  draft: /\b(draft|write|compose|create|build|generate|produce|implement)\b/i,
  polish: /\b(polish|refine|edit|revise|improve|optimi[sz]e)\b/i,
  format: /\b(format|export|render|publish|ship|deliver)\b/i,
};

function detectComplexity(prompt: string): { isComplex: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const t = prompt.trim();
  const words = (t.match(/\S+/g) || []).length;
  const andCount = (t.match(/\band\b/gi) || []).length;
  const alsoCount = (t.match(/\balso\b/gi) || []).length;
  const sentenceCount = (t.match(/[.!?]+\s/g) || []).length + 1;
  const distinctVerbs = Object.values(STAGE_VERBS).filter((p) => p.test(t)).length;
  const explicitSteps = /\b(?:step\s+\d|first[,]?|then[,]?|finally[,]?|after\s+that)\b/gi.test(t);
  const numberedAsk = /\b\d+\s*\)|\b\d+\.\s+/.test(t);

  if (words >= 60) reasons.push(`Long prompt (${words} words)`);
  if (andCount + alsoCount >= 4) reasons.push(`Many connectives (${andCount + alsoCount}× "and/also")`);
  if (distinctVerbs >= 2) reasons.push(`Multiple stage verbs detected`);
  if (sentenceCount >= 4) reasons.push(`Multiple sentences (${sentenceCount})`);
  if (explicitSteps) reasons.push(`Explicit sequencing words ("first", "then"…)`);
  if (numberedAsk) reasons.push(`Numbered sub-asks already present`);

  return { isComplex: reasons.length >= 2, reasons };
}

function extractTopic(prompt: string): string {
  let t = prompt
    .replace(/^(?:can\s+you\s+|please\s+|i\s+(?:need|want)\s+|help\s+me\s+(?:with|to)?\s*)/i, "")
    .replace(/\s*(thanks|thank\s+you)\s*[.!?]?\s*$/i, "")
    .trim();
  // Cut at the first "and"-bridge for a tight topic phrase
  t = t.split(/\s+(?:and|also|then|after\s+that)\s+/i)[0];
  if (t.length > 100) t = t.slice(0, 97) + "…";
  return t;
}

const STAGE_TEMPLATES: { key: string; title: string; goal: string; build: (topic: string) => string }[] = [
  {
    key: "research",
    title: "Research",
    goal: "Gather the raw material before producing anything.",
    build: (topic) =>
      `Act as a careful researcher.

Task: For the project "${topic}", gather the inputs we'll need downstream:
- key facts, recent data, and verified sources
- the main schools of thought / stakeholders / opinions
- the strongest counterargument
- 3 surprising or non-obvious angles

Format: a markdown bulleted brief. Cite sources where you can; flag anything you're uncertain about.
Audience: an analyst who will use this to build a plan.
If you don't know something, say "I don't know" — do not invent sources.`,
  },
  {
    key: "plan",
    title: "Plan",
    goal: "Turn the research into a structured outline.",
    build: (topic) =>
      `Act as a senior editor / strategist.

Context: I have the research output for "${topic}" from the previous step (paste it below this prompt).

Task: Produce a tight outline for the deliverable.
- Identify the single most important insight.
- Order the major sections by reader payoff (best first).
- For each section: one-line description + the evidence it draws from.
- Flag any gaps where the research is too thin to support a claim.

Format: numbered markdown outline with H2/H3 sections.
Audience: a writer who will produce the first draft from this outline.`,
  },
  {
    key: "draft",
    title: "Draft",
    goal: "Produce the first full version against the outline.",
    build: (topic) =>
      `Act as a sharp professional writer.

Context: The outline for "${topic}" is pasted below. The research brief is referenced by the outline.

Task: Write the full draft following the outline exactly. Do not invent facts not present in the research. Use the strongest evidence from each section.

Format:
- Hook line in the first sentence (specific scene, stat, or contrarian claim — no rhetorical questions).
- Short paragraphs.
- One concrete example per claim.
- Plain text or markdown only — no emojis, no hashtags.

Length: appropriate to the outline.
Audience: an engaged reader who values clarity over decoration.`,
  },
  {
    key: "critique",
    title: "Critique",
    goal: "Pressure-test the draft before polish.",
    build: (topic) =>
      `Act as a brutally honest editor (not encouraging — useful).

Task: Critique the draft for "${topic}" pasted below.

Specifically:
1. The single weakest paragraph and why.
2. Three claims that aren't supported by the research.
3. The two sentences that sound like AI ("delve", "tapestry", "navigate the landscape", etc.).
4. One section I should consider cutting entirely and why.
5. The one improvement that would most increase reader payoff.

Do not rewrite the draft. Do not be encouraging. Be useful.`,
  },
  {
    key: "polish",
    title: "Polish",
    goal: "Apply the critique to produce the final.",
    build: (topic) =>
      `Act as the writer applying editor feedback.

Inputs (paste below this prompt):
1. The current draft of "${topic}".
2. The critique from the previous step.

Task: Apply every point of the critique. For each change you make, note it in a one-line changelog at the very bottom. Do not change anything the critique didn't ask you to change.

Format: the polished version, then a [changelog] block.
Audience: the reader who will see the final.`,
  },
];

export function decomposeTask(prompt: string): Decomposition {
  const trimmed = (prompt ?? "").trim();
  const { isComplex, reasons } = detectComplexity(trimmed);
  const topic = extractTopic(trimmed);

  if (!trimmed) {
    return {
      isComplex: false,
      reasons: ["No prompt provided."],
      steps: [],
      summary: "",
    };
  }

  // Detect which stages are relevant from the prompt's verbs.
  const stagePresent = (key: keyof typeof STAGE_VERBS) => STAGE_VERBS[key].test(trimmed);

  // Default chain: research → plan → draft → critique → polish.
  // If the prompt is explicitly code-y, swap to: research → design → implement → test → refactor.
  const isCode =
    /\b(code|function|class|component|api|sql|regex|debug|implement|refactor|build\s+(?:a|an)\s+(?:app|service|tool))\b/i.test(
      trimmed
    );

  const steps: DecomposeStep[] = isCode
    ? [
        codeStep(1, "Spec", "Pin down exactly what the code must do.", topic,
`Act as a senior engineer.

Task: Pin down the spec for the project "${topic}".
- Inputs and outputs (with types where you can).
- Acceptance criteria as a bulleted list (each one testable).
- Edge cases to handle.
- Anything explicitly OUT of scope.

Format: a markdown brief.
Do NOT write code yet.`),
        codeStep(2, "Design", "Sketch the structure before implementing.", topic,
`Act as a senior engineer.

Context: the spec is pasted below.

Task: Design the implementation. Cover:
- Public API / function signatures.
- Data shapes / types.
- The 2–3 hardest cases and how the design handles them.
- One thing you considered and rejected, and why.

Format: markdown with code-fenced signatures where useful.
Do NOT implement the full body yet.`),
        codeStep(3, "Implement", "Write the actual code from the design.", topic,
`Act as a senior engineer pair-programming with me.

Context: the spec and design are pasted below.

Task: Implement the code. Constraints:
- Match the signatures exactly.
- No new dependencies without flagging them in a TODO.
- Add brief inline comments only where the WHY is non-obvious.
- After the code, list 3 ways to break it.`),
        codeStep(4, "Test", "Generate tests before declaring done.", topic,
`Act as a test engineer.

Context: the implementation is pasted below.

Task: Write a test suite that covers:
- The happy path.
- All acceptance criteria from the spec.
- The edge cases identified in the design.
- Error / failure modes.

Format: runnable test code in the same language. Group by category.
Note: do NOT modify the implementation; if a test reveals a real bug, list it under "[bugs found]" at the bottom.`),
        codeStep(5, "Refactor & Review", "Final pass before shipping.", topic,
`Act as a code reviewer.

Context: the implementation and tests are pasted below.

Task:
1. Three concrete refactors that would improve clarity (no behavior change).
2. Anything that should be extracted into a named helper.
3. Performance hotspots (if any) — flag, don't necessarily fix.
4. One thing you would NOT change, and why (resist the urge to over-engineer).

Format: a markdown review.`),
      ]
    : STAGE_TEMPLATES.map((stage, i) => ({
        number: i + 1,
        title: stage.title,
        goal: stage.goal,
        prompt: stage.build(topic),
        dependsOnPrior: i > 0,
      }));

  const usedStages = isCode
    ? ["Spec", "Design", "Implement", "Test", "Refactor & Review"]
    : STAGE_TEMPLATES.map((s) => s.title);
  const summary = isCode
    ? `Code task. Decomposed into ${steps.length} stages: ${usedStages.join(" → ")}.`
    : `Knowledge / writing task. Decomposed into ${steps.length} stages: ${usedStages.join(" → ")}.`;

  return {
    isComplex,
    reasons: isComplex ? reasons : ["Prompt looks simple enough to run in one shot — but a chain often still beats a one-shot."],
    steps,
    summary,
  };
}

function codeStep(
  number: number,
  title: string,
  goal: string,
  _topic: string,
  prompt: string
): DecomposeStep {
  return { number, title, goal, prompt, dependsOnPrior: number > 1 };
}
