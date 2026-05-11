export type Severity = "error" | "warning" | "info";

export type LintIssue = {
  id: string;
  severity: Severity;
  title: string;
  message: string;
  fix: string;
};

export type LintReport = {
  score: number;
  issues: LintIssue[];
  stats: {
    chars: number;
    words: number;
    sentences: number;
  };
};

const VAGUE_OPENERS = [
  /^\s*help\s+me\s+(with|on)\b/i,
  /^\s*can\s+you\s+(please\s+)?(help|do|make|write|tell|give)\b/i,
  /^\s*please\s+(help|tell|write|do|make)\b/i,
  /^\s*i\s+(need|want)\s+(some\s+)?(help|info|stuff)\b/i,
  /^\s*do\s+something\b/i,
  /^\s*tell\s+me\s+about\b/i,
];

const FORMAT_HINTS = [
  /\b(list|bullets?|table|json|yaml|xml|markdown|md|csv|paragraph|paragraphs|outline|bullet points|step[- ]by[- ]step|numbered|code block|code snippet|format(ted)?|schema)\b/i,
];

const LENGTH_HINTS = [
  /\b\d+\s*(words?|sentences?|paragraphs?|lines?|bullets?|items?|steps?|tokens?|chars?|characters?)\b/i,
  /\b(short|brief|concise|tldr|detailed|comprehensive|thorough|in[- ]depth|long|exhaustive|one[- ]sentence|one[- ]paragraph)\b/i,
];

const ROLE_HINTS = [
  /\b(act\s+as|you\s+are\s+(a|an|the)|as\s+(a|an)\s+(senior|expert|professional)|imagine\s+you\s+are|pretend\s+you\s+are|role[: ]|persona[: ])\b/i,
];

const AUDIENCE_HINTS = [
  /\b(for\s+(a|an|my)\s+(beginner|expert|engineer|student|teacher|child|kid|five[- ]year[- ]old|5\s*year\s*old|non[- ]technical|developer|designer|manager|investor|audience)|explain\s+(it\s+)?(to|like))\b/i,
];

const EXAMPLE_HINTS = [
  /\b(example|examples|e\.g\.?|for instance|such as|like this:|input:|output:|sample)\b/i,
];

const CONTRADICTION_PAIRS: { a: RegExp; b: RegExp; phrase: string }[] = [
  { a: /\b(short|brief|concise|tldr)\b/i, b: /\b(detailed|comprehensive|thorough|exhaustive|in[- ]depth|long)\b/i, phrase: '"short" + "detailed"' },
  { a: /\b(simple|simply|basic)\b/i, b: /\b(technical|advanced|expert|sophisticated)\b/i, phrase: '"simple" + "technical"' },
  { a: /\b(formal)\b/i, b: /\b(casual|informal|friendly|chatty)\b/i, phrase: '"formal" + "casual"' },
  { a: /\b(creative)\b/i, b: /\b(strict|precise|exact)\b/i, phrase: '"creative" + "strict"' },
];

const WEAK_WORDS = [
  /\bmaybe\b/i,
  /\bperhaps\b/i,
  /\bif\s+possible\b/i,
  /\btry\s+to\b/i,
  /\bsort\s+of\b/i,
  /\bkind\s+of\b/i,
  /\bi\s+think\b/i,
  /\bi\s+guess\b/i,
];

const POLITENESS_FLUFF = [
  /\bplease\s+please\b/i,
  /\bthank\s+you\s+(so\s+)?much\b/i,
  /\bif\s+you\s+(could|would|don'?t\s+mind)\b/i,
  /\bwould\s+you\s+mind\b/i,
  /\bi\s+would\s+really\s+appreciate\b/i,
  /\bcan\s+you\s+(please|kindly)\b/i,
  /\b(thanks|thank\s+you)\s*[.!?]?\s*$/i,
];

const QUESTION_OR_IMPERATIVE = /(\?|\b(write|create|build|generate|explain|summarize|list|analyze|compare|translate|refactor|fix|debug|design|draft|outline|review|describe|define|convert|extract|find|implement)\b)/i;

function countWords(text: string): number {
  const m = text.trim().match(/\S+/g);
  return m ? m.length : 0;
}

function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const m = trimmed.match(/[.!?]+(\s|$)/g);
  return Math.max(1, m ? m.length : 1);
}

function uppercaseRatio(text: string): number {
  const letters = text.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 20) return 0;
  const upper = letters.replace(/[^A-Z]/g, "").length;
  return upper / letters.length;
}

export function lintPrompt(input: string): LintReport {
  const text = input ?? "";
  const trimmed = text.trim();
  const words = countWords(trimmed);
  const sentences = countSentences(trimmed);
  const issues: LintIssue[] = [];

  if (!trimmed) {
    return {
      score: 0,
      issues: [],
      stats: { chars: 0, words: 0, sentences: 0 },
    };
  }

  if (words < 6) {
    issues.push({
      id: "too-short",
      severity: "error",
      title: "Prompt is too short",
      message: `Only ${words} word${words === 1 ? "" : "s"}. The AI can't infer what you want from this little context.`,
      fix: "Add: the goal, the topic, the desired output format, and any constraints (length, tone, audience).",
    });
  }

  if (VAGUE_OPENERS.some((r) => r.test(trimmed))) {
    issues.push({
      id: "vague-opener",
      severity: "warning",
      title: "Vague opener",
      message: "Phrases like \"help me with\" or \"can you please\" don't tell the model what to do.",
      fix: "Start with an action verb and a concrete deliverable. e.g. \"Write a 5-bullet summary of...\"",
    });
  }

  if (!ROLE_HINTS.some((r) => r.test(trimmed))) {
    issues.push({
      id: "missing-role",
      severity: "info",
      title: "No role or persona set",
      message: "The model is more accurate when it knows what perspective to take.",
      fix: "Add: \"Act as a senior <X>...\" or \"You are an expert in <Y>.\"",
    });
  }

  if (!FORMAT_HINTS.some((r) => r.test(trimmed))) {
    issues.push({
      id: "missing-format",
      severity: "warning",
      title: "No output format specified",
      message: "Without a format, you'll get unpredictable structure that's hard to parse or reuse.",
      fix: "Say what you want: a bulleted list, a JSON object with these keys, a 3-paragraph essay, etc.",
    });
  }

  if (!LENGTH_HINTS.some((r) => r.test(trimmed))) {
    issues.push({
      id: "missing-length",
      severity: "info",
      title: "No length constraint",
      message: "The model will guess how long to go. That guess is usually wrong.",
      fix: "Add a target: \"in 3 sentences\", \"under 200 words\", \"a one-paragraph summary\".",
    });
  }

  if (!AUDIENCE_HINTS.some((r) => r.test(trimmed))) {
    issues.push({
      id: "missing-audience",
      severity: "info",
      title: "No audience specified",
      message: "\"Explain X\" is very different for a 5-year-old vs. a senior engineer.",
      fix: "Add: \"for a <audience>\" — e.g. \"for a non-technical founder\".",
    });
  }

  if (words > 40 && !EXAMPLE_HINTS.some((r) => r.test(trimmed))) {
    issues.push({
      id: "missing-examples",
      severity: "info",
      title: "Consider an example",
      message: "Long prompts benefit hugely from a single concrete example of input → desired output.",
      fix: "Add a 'For example:' block showing one input/output pair.",
    });
  }

  CONTRADICTION_PAIRS.forEach((c, i) => {
    if (c.a.test(trimmed) && c.b.test(trimmed)) {
      issues.push({
        id: `contradiction-${i}`,
        severity: "error",
        title: "Contradicting instructions",
        message: `Your prompt contains a contradiction (${c.phrase}). The model has to guess which one you mean.`,
        fix: "Pick one. If you really want both, explain the trade-off (e.g. \"short, but include the why\").",
      });
    }
  });

  const weakHits = WEAK_WORDS.filter((r) => r.test(trimmed));
  if (weakHits.length >= 2) {
    issues.push({
      id: "weak-language",
      severity: "warning",
      title: "Weak / hedging language",
      message: "Words like \"maybe\", \"try to\", \"if possible\" make the model give wishy-washy answers.",
      fix: "Be direct. Replace hedges with imperatives: \"Do X\" instead of \"Maybe try to do X\".",
    });
  }

  const fluffHits = POLITENESS_FLUFF.filter((r) => r.test(trimmed));
  if (fluffHits.length >= 1 && words < 60) {
    issues.push({
      id: "politeness-fluff",
      severity: "info",
      title: "Politeness fluff",
      message: "Politeness doesn't help model quality and burns tokens.",
      fix: "Drop the \"please please\" and \"if you could\". Just state the task.",
    });
  }

  if (uppercaseRatio(trimmed) > 0.5 && trimmed.length > 30) {
    issues.push({
      id: "all-caps",
      severity: "warning",
      title: "Excessive ALL CAPS",
      message: "All-caps text reads as shouting and can confuse tokenization.",
      fix: "Use normal sentence case. Reserve caps for genuine emphasis on a single word.",
    });
  }

  if (sentences === 1 && words > 35 && !/[,;:]/.test(trimmed)) {
    issues.push({
      id: "no-punctuation",
      severity: "info",
      title: "One long sentence with no punctuation",
      message: "Hard for the model (and humans) to parse a long run-on sentence.",
      fix: "Break it into shorter sentences, or use a bulleted list of requirements.",
    });
  }

  if (!QUESTION_OR_IMPERATIVE.test(trimmed)) {
    issues.push({
      id: "no-clear-ask",
      severity: "warning",
      title: "Unclear what you're actually asking for",
      message: "No question mark and no clear action verb (write/explain/summarize/etc).",
      fix: "Start with a clear imperative: \"Write...\", \"Explain...\", \"Summarize...\", \"List...\".",
    });
  }

  const andCount = (trimmed.match(/\band\b/gi) || []).length;
  const alsoCount = (trimmed.match(/\balso\b/gi) || []).length;
  if (andCount + alsoCount >= 4 && words > 40) {
    issues.push({
      id: "multiple-asks",
      severity: "info",
      title: "Many requests in one prompt",
      message: "Multiple chained \"and... and also...\" tasks dilute model focus.",
      fix: "Split into separate prompts, or number the asks explicitly: 1) ... 2) ... 3) ...",
    });
  }

  const score = computeScore(issues, words);

  return {
    score,
    issues,
    stats: {
      chars: trimmed.length,
      words,
      sentences,
    },
  };
}

function computeScore(issues: LintIssue[], words: number): number {
  if (words === 0) return 0;
  let penalty = 0;
  for (const i of issues) {
    if (i.severity === "error") penalty += 25;
    else if (i.severity === "warning") penalty += 12;
    else penalty += 5;
  }
  return Math.max(0, Math.min(100, 100 - penalty));
}

export function severityColor(s: Severity): string {
  if (s === "error") return "bg-severity-error/15 text-severity-error border-severity-error/30";
  if (s === "warning") return "bg-severity-warn/15 text-severity-warn border-severity-warn/30";
  return "bg-severity-info/15 text-severity-info border-severity-info/30";
}

export function severityLabel(s: Severity): string {
  if (s === "error") return "Error";
  if (s === "warning") return "Warning";
  return "Suggestion";
}
