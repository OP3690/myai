import { lintPrompt, type Metric } from "./lint.js";

// ─── Types ────────────────────────────────────────────────────────────────

export type InsightKind = "removed" | "added" | "rewrote";

export type Insight = {
  kind: InsightKind;
  text: string;
  reason: string;
  improves: Metric[];
};

export type TaskType =
  | "generative-writing"
  | "generative-code"
  | "analytical"
  | "educational"
  | "extraction"
  | "transformation"
  | "decisional"
  | "creative"
  | "conversational"
  | "general";

export type TargetModel = "claude" | "gpt" | "gemini" | "plain";

export type ImprovedSections = {
  role: string;
  task: string;
  context?: string;
  format: string;
  length: string;
  audience: string;
  example?: string;
  safeguard?: string;
};

export type ImprovedPrompt = {
  taskType: TaskType;
  topic: string;
  sections: ImprovedSections;
  insights: Insight[];
  scoreBefore: number;
  scoreAfter: number;
  changed: boolean;
};

// ─── Task type config ─────────────────────────────────────────────────────

export const TASK_TYPE_LABEL: Record<TaskType, string> = {
  "generative-writing": "Writing",
  "generative-code": "Code",
  analytical: "Analysis",
  educational: "Explainer",
  extraction: "Extraction",
  transformation: "Transform",
  decisional: "Decision",
  creative: "Brainstorm",
  conversational: "Conversation",
  general: "General",
};

export const TASK_TYPE_EMOJI: Record<TaskType, string> = {
  "generative-writing": "✍️",
  "generative-code": "💻",
  analytical: "📊",
  educational: "🎓",
  extraction: "🔎",
  transformation: "🔁",
  decisional: "⚖️",
  creative: "💡",
  conversational: "💬",
  general: "✨",
};

export const TASK_TYPE_BLURB: Record<TaskType, string> = {
  "generative-writing": "Produce prose / copy / content.",
  "generative-code": "Write or modify code.",
  analytical: "Investigate, compare, or evaluate.",
  educational: "Explain or teach a topic.",
  extraction: "Pull specific data out of input.",
  transformation: "Convert input to a different form.",
  decisional: "Help the user decide between options.",
  creative: "Generate ideas, options, or variations.",
  conversational: "Roleplay or hold a multi-turn chat.",
  general: "Generic structured response.",
};

// ─── Patterns ─────────────────────────────────────────────────────────────

const VAGUE_OPENERS: { pattern: RegExp; label: string }[] = [
  { pattern: /^(?:hey\s+(?:ai|chatgpt|claude|bot|gpt|gemini),?\s+)/i, label: "AI greeting" },
  { pattern: /^(?:can\s+you\s+(?:please|kindly)?\s*)/i, label: '"can you please"' },
  { pattern: /^(?:could\s+you\s+(?:please|kindly)?\s*)/i, label: '"could you please"' },
  { pattern: /^(?:would\s+you\s+(?:please|kindly|mind)?\s*)/i, label: '"would you please"' },
  { pattern: /^(?:please\s+)/i, label: '"please"' },
  {
    pattern: /^(?:i\s+(?:need|want)\s+(?:some\s+)?(?:help\s+(?:with|on)|info\s+about))\s*/i,
    label: '"i need help with"',
  },
  { pattern: /^(?:i\s+would\s+like\s+(?:to\s+know\s+|help\s+with\s+)?)/i, label: '"i would like"' },
  { pattern: /^(?:help\s+me\s+(?:with|on|to)\s+)/i, label: '"help me with"' },
  { pattern: /^(?:help\s+me\s+)(?=[a-z])/i, label: '"help me"' },
  { pattern: /^(?:tell\s+me\s+about)\s*/i, label: '"tell me about"' },
];

const POLITENESS_TRAILS = [
  /\s*(thanks\s+(?:so\s+much|in\s+advance|a\s+lot))\s*[.!?]?\s*$/i,
  /\s*(thank\s+you(?:\s+(?:so\s+much|very\s+much|in\s+advance))?)\s*[.!?]?\s*$/i,
  /\s*(thanks(?:!|\.|,)?)\s*$/i,
  /\s*(ty)\s*[.!?]?\s*$/i,
  /\s*(appreciate\s+(?:it|the\s+help))\s*[.!?]?\s*$/i,
];

const WEAK_PHRASES: { pattern: RegExp; label: string }[] = [
  { pattern: /\b(?:maybe|perhaps)\s+/gi, label: 'hedge "maybe"' },
  { pattern: /\bif\s+possible[,]?\s*/gi, label: '"if possible"' },
  { pattern: /\btry\s+to\s+/gi, label: '"try to"' },
  { pattern: /\bsort\s+of\s+/gi, label: '"sort of"' },
  { pattern: /\bkind\s+of\s+/gi, label: '"kind of"' },
  { pattern: /\bi\s+(?:think|guess|feel|believe)\s+/gi, label: '"I think"' },
];

const CONTRADICTION_PAIRS: { a: RegExp; b: RegExp; keep: "a" | "b"; aLabel: string; bLabel: string }[] = [
  {
    a: /\b(short|brief|concise|tldr|quick)\b/i,
    b: /\b(detailed|comprehensive|thorough|exhaustive|in[- ]depth|long)\b/i,
    keep: "a",
    aLabel: "concise",
    bLabel: "detailed",
  },
  {
    a: /\b(simple|simply|basic)\b/i,
    b: /\b(technical|advanced|expert|sophisticated)\b/i,
    keep: "a",
    aLabel: "simple",
    bLabel: "advanced",
  },
];

const ROLE_PATTERN = /\b(act\s+as|you\s+are\s+(?:a|an|the)|as\s+(?:a|an)\s+(?:senior|expert|professional)|imagine\s+you\s+are|pretend\s+you\s+are|role[: ]|persona[: ])\b/i;
const FORMAT_PATTERN = /\b(list|bullets?|table|json|yaml|xml|markdown|csv|paragraph|outline|bullet\s+points|step[- ]by[- ]step|numbered|code\s+block|format(?:ted)?|schema)\b/i;
const LENGTH_PATTERN = /\b\d+\s*(?:words?|sentences?|paragraphs?|lines?|bullets?|items?|steps?|tokens?|chars?)\b|\b(short|brief|concise|tldr|detailed|comprehensive|thorough|in[- ]depth|long|exhaustive|one[- ]sentence|one[- ]paragraph)\b/i;
const AUDIENCE_PATTERN = /\b(for\s+(?:a|an|my)\s+(?:beginner|expert|engineer|student|teacher|child|kid|five[- ]year[- ]old|5\s*year\s*old|non[- ]technical|developer|designer|manager|investor|audience)|explain\s+(?:it\s+)?(?:to|like))\b/i;

// "it should be detailed" / "make it short" — quality / constraint phrases that should move to constraints
const INLINE_CONSTRAINT_PATTERN =
  /\bit\s+should\s+be\s+(\w+(?:\s+and\s+\w+)*)/gi;
const QUALITY_FILLER_PATTERN =
  /\b(?:make\s+it\s+|should\s+be\s+|that\s+is\s+)(good|nice|cool|great|awesome|interesting|engaging)\b/gi;

// ─── Task-type detection ──────────────────────────────────────────────────

const TASK_TYPE_RULES: { type: TaskType; pattern: RegExp; priority: number }[] = [
  // Highest priority: explicit comparison / decision / brainstorm verbs win over noun-mentions of tools
  { type: "analytical", priority: 12, pattern: /\b(compare|comparison\b|versus\b|\bvs\.?\b|which\s+(?:is|one\s+is)\s+better|pros\s+and\s+cons\s+of)\b/i },
  { type: "creative", priority: 12, pattern: /\b(brainstorm|ideate|come\s+up\s+with\s+(?:\d+\s+)?|give\s+me\s+(?:\d+\s+)?(?:\w+\s+){0,2}(?:ideas|options|hooks|headlines|names|titles|variants|tweets|threads|captions|reels|examples|prompts|angles|takes|alternatives)|suggest\s+(?:\d+\s+)?(?:\w+\s+){0,2}(?:ideas|options|hooks|names|alternatives))\b/i },
  { type: "decisional", priority: 11, pattern: /\b(should\s+i|should\s+we|help\s+me\s+(?:decide|choose)|choose\s+between|recommend\s+(?:a|an|one|which)|best\s+(?:choice|option))\b/i },
  // Code-related — high but below comparison so "compare react vs vue" beats "react".
  { type: "generative-code", priority: 10, pattern: /\b(write\s+(?:a\s+)?(?:function|class|script|component|api|endpoint)|implement\b|build\s+(?:a\s+)?(?:function|component|api|app)|debug\b|fix\s+(?:this|the|my|a|an)?\s*(?:bug|error|issue|code|function|app)|refactor\b|stack\s*trace|sql\s+query|regex|kubernetes|docker|typescript|javascript|python\s+(?:script|code|function)|rust|golang|api\s+route)\b/i },
  { type: "extraction", priority: 9, pattern: /\b(extract|pull\s+out|identify\s+all|find\s+all|list\s+all\s+the|parse\b|scrape\b|isolate)\b/i },
  { type: "transformation", priority: 9, pattern: /\b(translate|convert\s+(?:to|into|from)|summari[sz]e|rewrite\s+(?:as|to|in)|reformulate|compress|expand|rephrase|simplify\b)\b/i },
  { type: "analytical", priority: 8, pattern: /\b(analy[sz]e|evaluate|assess|critique|review\s+(?:my|this|the)|breakdown|investigate|why\s+does|what\s+causes)\b/i },
  { type: "educational", priority: 7, pattern: /\b(explain|teach\s+me|how\s+does\s+\w+\s+work|what\s+is\s+(?:a\s+|an\s+|the\s+)?\w+|tutor\s+me|walk\s+me\s+through|describe\s+(?:how|why)|learn\s+about|understand)\b/i },
  { type: "conversational", priority: 7, pattern: /\b(act\s+as|roleplay|pretend\s+(?:you|to\s+be)|let'?s\s+play|simulate|be\s+my\s+(?:friend|partner|coach|opponent)|talk\s+(?:to|with)\s+me)\b/i },
  { type: "generative-writing", priority: 5, pattern: /\b(write\s+(?:a|an|the|some|me)|draft\s+(?:a|an|the)|compose\s+(?:a|an)|create\s+(?:a|an)\s+(?:blog|article|post|email|story|caption|copy|piece|essay|reply|tweet|thread))\b/i },
  // Lower-priority: bare framework / language nouns. Only fire if no other rule matched.
  { type: "generative-code", priority: 3, pattern: /\b(react(?:\s+app)?|vue|svelte|next\.?js|node\.?js|express|django|rails|flutter)\b/i },
];

export function detectTaskType(text: string): TaskType {
  const t = text.trim();
  if (!t) return "general";
  // Sort rules by priority descending — return the first matching rule.
  const rules = [...TASK_TYPE_RULES].sort((a, b) => b.priority - a.priority);
  for (const r of rules) {
    if (r.pattern.test(t)) return r.type;
  }
  // Generic "write X" fallback after the specific code/creative checks.
  if (/\bwrite\b|\bdraft\b|\bcompose\b/i.test(t)) return "generative-writing";
  return "general";
}

// ─── Topic extraction ─────────────────────────────────────────────────────

const TOPIC_STRIP_PREFIXES =
  /^(?:about\s+|on\s+|for\s+|me\s+(?:about|how\s+to)\s+|how\s+to\s+|why\s+|what\s+(?:is|are|do|does)\s+|the\s+)/i;

export function extractTopic(text: string, taskType: TaskType): string {
  let t = text.trim();
  // Strip imperative verbs at the start
  t = t.replace(
    /^(?:write|draft|compose|create|build|implement|explain|teach|tutor|describe|analyse|analyze|compare|evaluate|extract|find|identify|translate|convert|summarize|summarise|refactor|recommend|advise|brainstorm|ideate|generate|debug|fix|review|act|pretend|roleplay|simulate|walk\s+me\s+through|learn)\s+/i,
    ""
  );
  t = t.replace(/^(?:a|an|the|some|me|us|you)\s+/i, "");
  t = t.replace(TOPIC_STRIP_PREFIXES, "");
  // Cut at first connective that introduces constraints
  t = t.split(/\s+(?:it\s+should|that\s+is|in\s+a\s+way|with\s+the\s+goal|so\s+that|please|thanks|thank\s+you)\b/i)[0];
  t = t.replace(/[.,;:]\s*$/g, "").trim();
  // Limit length for display
  if (t.length > 80) t = t.slice(0, 77) + "…";
  return t || taskType.replace("-", " ");
}

// ─── Role inference (task-type aware) ─────────────────────────────────────

function inferRole(text: string, taskType: TaskType): string {
  const t = text.toLowerCase();

  // Task-type-specific overrides first.
  if (taskType === "generative-code") {
    if (/\b(security|vulnerab|exploit|owasp)\b/.test(t))
      return "a security-minded senior engineer who threat-models before writing code";
    if (/\b(performance|optimi[sz]e|fast|slow|latency)\b/.test(t))
      return "a senior engineer who profiles before optimizing";
    if (/\b(react|next\.?js|frontend|ui|css)\b/.test(t))
      return "a senior frontend engineer with strong opinions about accessibility and bundle size";
    if (/\b(api|backend|server|microservice|kubernetes|docker)\b/.test(t))
      return "a senior backend engineer who has shipped systems at scale";
    if (/\b(sql|database|query|postgres|mysql)\b/.test(t))
      return "a database engineer who reads EXPLAIN plans for fun";
    return "a senior software engineer who writes code reviewers actually thank you for";
  }
  if (taskType === "generative-writing") {
    if (/\b(blog|article|post|essay)\b/.test(t))
      return "a sharp writer who hooks the reader in the first line and earns the rest";
    if (/\b(email|reply|response|message)\b/.test(t))
      return "a thoughtful communicator who writes warm, direct, professional messages";
    if (/\b(tweet|thread|caption|hook|viral)\b/.test(t))
      return "a creator who understands short-form attention and writes with specificity";
    if (/\b(landing|copy|product|saas|marketing|headline|cta)\b/.test(t))
      return "a B2B copywriter who is allergic to buzzwords";
    return "a professional writer who writes for engaged readers, not search engines";
  }
  if (taskType === "educational") {
    if (/\b(kid|child|five[- ]year|10[- ]year|teen|teenager)\b/.test(t))
      return "a kind teacher who explains things through everyday analogies a kid would recognize";
    if (/\b(beginner|new|just\s+starting|never\s+(?:done|learned))\b/.test(t))
      return "a patient teacher who defines jargon inline and never assumes prior knowledge";
    if (/\b(math|algebra|calculus|equation|physics|chemistry)\b/.test(t))
      return "a math/science tutor who shows the working, never just the answer";
    if (/\b(language|spanish|japanese|french|german|hindi|mandarin)\b/.test(t))
      return "a friendly language partner who corrects gently and explains the rule briefly";
    return "an experienced teacher who breaks complex topics into simple, memorable steps";
  }
  if (taskType === "analytical")
    return "a thoughtful analyst who weighs evidence and states confidence levels";
  if (taskType === "decisional")
    return "a trusted advisor who pushes back on lazy reasoning instead of just agreeing";
  if (taskType === "extraction")
    return "a meticulous parser who only extracts what is actually there and flags ambiguity";
  if (taskType === "transformation")
    return "a careful editor who preserves meaning while shifting form";
  if (taskType === "creative")
    return "a generative thinker who produces many distinct options, not many reworded ones";
  if (taskType === "conversational")
    return "a thoughtful conversation partner who stays in character and respects pacing";

  // General fallback
  return "a domain expert on this topic with strong opinions and the experience to back them up";
}

// ─── Format inference (task-type aware) ───────────────────────────────────

function inferFormat(text: string, taskType: TaskType): string {
  const t = text.toLowerCase();
  if (/\bjson\b/.test(t))
    return "a JSON object only — no prose around it";
  if (taskType === "generative-code")
    return "a code block with the full implementation, then 2–3 lines of plain-English explanation, then edge cases to consider";
  if (taskType === "generative-writing") {
    if (/\b(email|reply|response|message)\b/.test(t))
      return "plain text — no markdown, no greeting fluff, end with one clear ask";
    if (/\b(thread|tweet)\b/.test(t))
      return "numbered tweets, each ≤ 240 chars, each tweet standalone";
    if (/\b(blog|article|essay|post)\b/.test(t))
      return "3–5 short paragraphs with a hook line and no fluff";
    return "3 short paragraphs with a clear opening line";
  }
  if (taskType === "analytical")
    return "a 1-sentence headline, then 3 bullet points of evidence, then the strongest counterargument, then a confidence rating (low/med/high)";
  if (taskType === "educational")
    return "open with one everyday analogy, then 3 short paragraphs (one idea each), end with a follow-up question to go deeper";
  if (taskType === "extraction")
    return "a JSON array of objects with consistent keys — no prose, no markdown wrapper";
  if (taskType === "transformation")
    return "the transformed content only — no prefatory commentary";
  if (taskType === "decisional")
    return "your recommendation (1 sentence), confidence rating, 3 key reasons, the strongest counterargument, and what would change your mind";
  if (taskType === "creative")
    return "a numbered list (8–10 items), each one line, each labeled by the mechanic it uses (contrarian / specific / counterintuitive / etc.), then mark your top 3";
  if (taskType === "conversational")
    return "in-character message, 2–3 sentences per turn, end inviting a response";
  if (/\b(compare|versus|\bvs\b|difference)\b/.test(t))
    return "a markdown table with criteria as rows and options as columns, then a 2-sentence recommendation";
  if (/\b(steps|guide|how\s*to|process|tutorial)\b/.test(t))
    return "a numbered step-by-step guide, each step under 25 words";
  if (/\b(list|options|items|examples)\b/.test(t))
    return "a numbered list, max 8 items, each one sentence";
  return "a short structured response: 1) the answer, 2) the reasoning, 3) what to do next";
}

function inferLength(text: string, taskType: TaskType): string {
  const t = text.toLowerCase();
  if (/\b(short|brief|concise|tldr|quick|one[- ]paragraph|one[- ]sentence)\b/.test(t)) return "under 120 words";
  if (/\b(detailed|comprehensive|thorough|in[- ]depth|exhaustive|long)\b/.test(t)) return "400–600 words";
  if (taskType === "generative-code") return "as long as the code requires — no padding in the explanation";
  if (taskType === "extraction") return "no length limit — return all matches";
  if (taskType === "creative") return "8–10 distinct options";
  return "under 250 words";
}

function inferAudienceLine(text: string, taskType: TaskType): string {
  const t = text.toLowerCase();
  if (/\bbeginner|new|just\s+starting|first\s+time|never\s+(done|learned)\b/.test(t))
    return "beginner — define jargon inline and use everyday analogies";
  if (/\bkid|child|five[- ]year|10[- ]year\b/.test(t))
    return "child — concrete examples only, no abstract concepts without a tangible parallel";
  if (/\b(senior|expert|advanced|experienced|principal|staff)\b/.test(t))
    return "expert — skip basics, use precise terminology, surface edge cases";
  if (taskType === "generative-code") return "engineering peers — assume comfort with the language and ecosystem";
  if (taskType === "educational") return "intermediate — skip the obvious, but explain anything truly advanced";
  return "intermediate — skip the obvious, but flag anything truly advanced";
}

// ─── Example generation ───────────────────────────────────────────────────

function generateExample(text: string, taskType: TaskType, topic: string): string | undefined {
  const t = text.toLowerCase();
  switch (taskType) {
    case "generative-code":
      return `Example response shape:
\`\`\`
// One-sentence summary of the approach
function example() {
  // implementation
}
\`\`\`
Then 2–3 lines explaining what the code does and which edge cases it handles.`;

    case "generative-writing": {
      if (/\b(email|reply|response|message)\b/.test(t))
        return `Example response shape:
Subject: [one-line subject — under 6 words]

[Greeting — short or none.]

[One-sentence context.]
[One-sentence ask or update.]
[Single clear next step.]

[Sign-off, your name]`;
      if (/\b(blog|article|essay|post)\b/.test(t))
        return `Example response shape:
**[Provocative headline about ${topic || "the topic"}]**

[Opening line — a specific scene, stat, or surprise.]

[Paragraph 1 — the reality.]
[Paragraph 2 — why it's happening.]
[Paragraph 3 — what to do about it.]

[Closing — one resonant line, not a summary.]`;
      if (/\b(thread|tweet)\b/.test(t))
        return `Example response shape:
1/ [Hook — specific number or contrarian claim, ≤ 12 words.]

2/ [The core insight in one sentence.]

3/ [Evidence — one concrete example.]

4/ [Implication — what this means for the reader.]

5/ [Call back to hook + soft CTA.]`;
      return `Example response shape:
[Hook — one sharp opening line.]

[Body paragraph 1 — the claim.]
[Body paragraph 2 — the support.]

[Closing — what the reader does next.]`;
    }

    case "analytical":
      return `Example response shape:
**Headline**: [your conclusion in one sentence]

**Evidence**:
- [Data point or observation #1]
- [Data point or observation #2]
- [Data point or observation #3]

**Counterargument**: [the strongest case against your conclusion]

**Confidence**: [low / medium / high] — [one-line reason]`;

    case "educational":
      return `Example response shape:
"Imagine [familiar everyday thing] — ${topic || "this concept"} works similarly. [One-sentence bridge.]"

[Paragraph 1 — the core idea, plain language.]
[Paragraph 2 — one mechanism or moving part.]
[Paragraph 3 — where it shows up in real life.]

**Want to go deeper?** [One follow-up question I could ask next.]`;

    case "extraction":
      return `Example response shape:
\`\`\`json
[
  { "item": "...", "category": "...", "context": "..." },
  { "item": "...", "category": "...", "context": "..." }
]
\`\`\`
If a field is uncertain, set it to null instead of guessing.`;

    case "transformation":
      return `Example response shape:
[The transformed content here — no prefatory commentary, no "Here is your..." opener.]`;

    case "decisional":
      return `Example response shape:
**Recommendation**: [A or B]
**Confidence**: [low / medium / high]

**Key reasons**:
1. [Reason 1]
2. [Reason 2]
3. [Reason 3]

**Strongest counterargument**: [the best case against this choice]
**What would change my mind**: [the new info that would flip the recommendation]`;

    case "creative":
      return `Example response shape:
1. [Idea] — [mechanic: contrarian | specific | counterintuitive | analogy]
2. [Idea] — [mechanic]
3. [Idea] — [mechanic]
…
8. [Idea] — [mechanic]

**Top 3 picks**: 1, 4, 7 — [one-line reason for each]`;

    case "conversational":
      return `Example response shape:
[In-character message, 2–3 sentences.]
[Optional action description in *italics*.]
[End on an invitation for the user's next turn.]`;

    default:
      return undefined;
  }
}

// ─── Task text cleanup ────────────────────────────────────────────────────

function cleanTaskText(text: string): { task: string; pulledConstraints: string[]; insights: Insight[] } {
  const insights: Insight[] = [];
  let task = text;
  const pulledConstraints: string[] = [];

  // Pull "it should be X and Y" → constraints, drop from task
  const matches = Array.from(task.matchAll(INLINE_CONSTRAINT_PATTERN));
  for (const m of matches) {
    const adjectives = m[1]
      .split(/\s+and\s+/i)
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean);
    for (const adj of adjectives) {
      // Skip obvious quality fillers handled below
      if (/^(good|nice|cool|great|awesome|interesting|engaging)$/i.test(adj)) continue;
      pulledConstraints.push(adj);
    }
  }
  if (matches.length > 0) {
    task = task.replace(INLINE_CONSTRAINT_PATTERN, "").replace(/\s{2,}/g, " ").trim();
    insights.push({
      kind: "rewrote",
      text: `Moved "${matches.map((m) => `it should be ${m[1]}`).join(", ")}" into constraints`,
      reason: 'Inline "it should be X" phrasing buries constraints in the task line. Promoted them to a constraints block so the model treats them as hard requirements.',
      improves: ["structure", "specificity"],
    });
  }

  // Drop quality fillers ("good", "nice", "great") — they tell the model nothing
  const fillerMatches = Array.from(task.matchAll(QUALITY_FILLER_PATTERN));
  if (fillerMatches.length > 0) {
    task = task.replace(QUALITY_FILLER_PATTERN, "").replace(/\s{2,}/g, " ").trim();
    insights.push({
      kind: "removed",
      text: `Quality filler ("${fillerMatches.map((m) => m[1]).join(", ")}")`,
      reason: 'Words like "good", "nice", "great" don\'t tell the model what to do. Replaced with concrete constraints.',
      improves: ["specificity"],
    });
  }

  // "something about X" → "about X"
  if (/\bsomething\s+about\b/i.test(task)) {
    task = task.replace(/\bsomething\s+about\b/gi, "about");
    insights.push({
      kind: "rewrote",
      text: '"something about" → "about"',
      reason: '"Something" hides what you actually want. Dropped so the topic stands alone.',
      improves: ["specificity"],
    });
  }

  // Trailing "in a way that is X" — keep but flag
  task = task.replace(/\s+(in\s+a\s+way\s+that\s+is\s+\w+(?:\s+and\s+\w+)*)/i, "");

  // Collapse whitespace, ensure capitalized and terminated
  task = task.replace(/\s+/g, " ").trim();
  if (task) task = task.charAt(0).toUpperCase() + task.slice(1);
  if (task && !/[.!?]$/.test(task)) task = task + ".";

  return { task, pulledConstraints, insights };
}

// ─── Main improvement function ────────────────────────────────────────────

export function improvePrompt(input: string): ImprovedPrompt {
  const original = (input ?? "").trim();
  const empty: ImprovedPrompt = {
    taskType: "general",
    topic: "",
    sections: {
      role: "",
      task: "",
      format: "",
      length: "",
      audience: "",
    },
    insights: [],
    scoreBefore: 0,
    scoreAfter: 0,
    changed: false,
  };
  if (!original) return empty;

  const insights: Insight[] = [];
  let task = original;

  // Detect task type from the ORIGINAL text (most signal)
  const taskType = detectTaskType(original);

  // Strip vague openers (cascading)
  for (let pass = 0; pass < 3; pass++) {
    let stripped = false;
    for (const opener of VAGUE_OPENERS) {
      const m = task.match(opener.pattern);
      if (m) {
        task = task.slice(m[0].length).trimStart();
        insights.push({
          kind: "removed",
          text: opener.label,
          reason: "Vague filler that didn't tell the model what to do.",
          improves: ["clarity", "specificity"],
        });
        stripped = true;
        break;
      }
    }
    if (!stripped) break;
  }

  // Strip trailing politeness
  for (const trail of POLITENESS_TRAILS) {
    const m = task.match(trail);
    if (m) {
      task = task.slice(0, task.length - m[0].length).trimEnd();
      insights.push({
        kind: "removed",
        text: m[1]?.trim() || "thanks",
        reason: "Politeness fluff doesn't help model quality — it just burns tokens.",
        improves: ["clarity"],
      });
      break;
    }
  }

  // Strip weak hedges
  for (const w of WEAK_PHRASES) {
    if (w.pattern.test(task)) {
      task = task.replace(w.pattern, "");
      insights.push({
        kind: "removed",
        text: w.label,
        reason: "Hedging makes the model give wishy-washy answers. Be direct.",
        improves: ["clarity", "specificity"],
      });
    }
  }

  // Resolve contradictions
  let resolvedConstraint: string | null = null;
  for (const c of CONTRADICTION_PAIRS) {
    if (c.a.test(task) && c.b.test(task)) {
      const droppedSrc = (c.keep === "a" ? c.b : c.a).source;
      const cleanupPattern = new RegExp(
        `(?:\\s+(?:and|but|or|also|yet|but\\s+also)\\s+)?${droppedSrc}|${droppedSrc}(?:\\s+(?:and|but|or|also|yet|but\\s+also)\\s+)?`,
        "i"
      );
      task = task.replace(cleanupPattern, " ").replace(/\s{2,}/g, " ").trim();
      resolvedConstraint = c.keep === "a" ? c.aLabel : c.bLabel;
      insights.push({
        kind: "rewrote",
        text: `Resolved "${c.aLabel}" vs "${c.bLabel}" contradiction`,
        reason: `You asked for both — kept "${resolvedConstraint}", dropped the other. Pick one and the model stops guessing.`,
        improves: ["clarity", "risk"],
      });
      break;
    }
  }

  // Smarter task cleanup
  const cleaned = cleanTaskText(task);
  task = cleaned.task;
  insights.push(...cleaned.insights);

  if (!task) {
    task = original.charAt(0).toUpperCase() + original.slice(1);
    if (!/[.!?]$/.test(task)) task += ".";
  }

  // Detect what's already in the original
  const hasRole = ROLE_PATTERN.test(original);
  const hasFormat = FORMAT_PATTERN.test(original);
  const hasLength = LENGTH_PATTERN.test(original);
  const hasAudience = AUDIENCE_PATTERN.test(original);

  // Build sections
  const role = hasRole ? extractRoleFromOriginal(original) : inferRole(original, taskType);
  if (!hasRole) {
    insights.push({
      kind: "added",
      text: `Role: "${role}"`,
      reason: "A clear role tells the model what perspective and expertise level to take.",
      improves: ["context"],
    });
  }

  const format = inferFormat(original, taskType);
  if (!hasFormat) {
    insights.push({
      kind: "added",
      text: `Output format: ${format}`,
      reason: "Without a format, you get unpredictable structure that's hard to parse or reuse.",
      improves: ["structure"],
    });
  }

  const length = inferLength(original, taskType);
  if (!hasLength && cleaned.pulledConstraints.length === 0 && !resolvedConstraint) {
    insights.push({
      kind: "added",
      text: `Length: ${length}`,
      reason: "Telling the model the target length prevents under- and over-shooting.",
      improves: ["structure"],
    });
  }

  // If we pulled constraints from "it should be X", they may carry length signal
  const lengthFromConstraint = cleaned.pulledConstraints.find((c) =>
    /\b(short|brief|concise|detailed|comprehensive|thorough|long)\b/i.test(c)
  );
  const finalLength = lengthFromConstraint
    ? lengthFromConstraint.match(/short|brief|concise/i)
      ? "under 120 words"
      : lengthFromConstraint.match(/detailed|comprehensive|thorough|long/i)
      ? "400–600 words"
      : length
    : length;

  const audience = inferAudienceLine(original, taskType);
  if (!hasAudience) {
    insights.push({
      kind: "added",
      text: `Audience: ${audience}`,
      reason: "The right answer for a beginner is very different from the right answer for an expert.",
      improves: ["context"],
    });
  }

  const topic = extractTopic(original, taskType);

  // Generate an example for medium/long prompts
  const wordsInOriginal = original.split(/\s+/).filter(Boolean).length;
  const example = wordsInOriginal > 4 ? generateExample(original, taskType, topic) : undefined;
  if (example) {
    insights.push({
      kind: "added",
      text: "Concrete output template",
      reason: "Showing the model the exact response shape (a one-shot example) consistently outperforms describing it in prose.",
      improves: ["structure", "context"],
    });
  }

  const safeguard =
    wordsInOriginal > 8
      ? `If anything in this prompt is ambiguous, ask before guessing. If you don't know something, say "I don't know" rather than making it up.`
      : undefined;
  if (safeguard) {
    insights.push({
      kind: "added",
      text: "Anti-hallucination safeguard",
      reason: "Explicit permission to ask (and to say \"I don't know\") prevents confident invention.",
      improves: ["risk"],
    });
  }

  const sections: ImprovedSections = {
    role,
    task,
    format,
    length: finalLength,
    audience,
    example,
    safeguard,
  };

  const improvedFlat = renderForModel({ sections, taskType }, "plain");
  const scoreBefore = lintPrompt(original).score;
  const scoreAfter = lintPrompt(improvedFlat).score;

  return {
    taskType,
    topic,
    sections,
    insights,
    scoreBefore,
    scoreAfter,
    changed: improvedFlat.trim() !== original.trim(),
  };
}

// Best-effort role extractor when the user already provided one.
function extractRoleFromOriginal(text: string): string {
  const m = text.match(/(?:act\s+as|you\s+are|imagine\s+you\s+are|pretend\s+you\s+are)\s+(?:a|an|the)?\s*([^.!?\n]+)/i);
  if (m) return m[1].trim();
  return "the role you've defined in the prompt";
}

// ─── Model-specific rendering ─────────────────────────────────────────────

export function renderForModel(
  p: { sections: ImprovedSections; taskType: TaskType },
  model: TargetModel
): string {
  const { sections } = p;
  if (model === "claude") return renderClaude(sections);
  if (model === "gpt") return renderGPT(sections);
  if (model === "gemini") return renderGemini(sections);
  return renderPlain(sections);
}

function renderClaude(s: ImprovedSections): string {
  const parts: string[] = [];
  if (s.role) parts.push(`<role>${s.role}</role>`);
  parts.push(`<task>\n${s.task}\n</task>`);
  parts.push(
    `<output_format>\n${s.format}\n</output_format>`
  );
  const constraints: string[] = [];
  if (s.length) constraints.push(`- Length: ${s.length}`);
  if (s.audience) constraints.push(`- Audience: ${s.audience}`);
  if (constraints.length) parts.push(`<constraints>\n${constraints.join("\n")}\n</constraints>`);
  if (s.example) parts.push(`<example>\n${s.example}\n</example>`);
  if (s.safeguard) parts.push(`<safeguard>\n${s.safeguard}\n</safeguard>`);
  return parts.join("\n\n");
}

function renderGPT(s: ImprovedSections): string {
  const parts: string[] = [];
  if (s.role) parts.push(`**Role**: You are ${s.role}.`);
  parts.push(`## Task\n${s.task}`);
  parts.push(`## Output format\n${s.format}`);
  const constraints: string[] = [];
  if (s.length) constraints.push(`- Length: ${s.length}`);
  if (s.audience) constraints.push(`- Audience: ${s.audience}`);
  if (constraints.length) parts.push(`## Constraints\n${constraints.join("\n")}`);
  if (s.example) parts.push(`## Example\n${s.example}`);
  if (s.safeguard) parts.push(`---\n${s.safeguard}`);
  return parts.join("\n\n");
}

function renderGemini(s: ImprovedSections): string {
  const lines: string[] = [];
  if (s.role) lines.push(`Role: ${s.role}.`);
  lines.push(`Task: ${s.task}`);
  lines.push(`Output: ${s.format}.`);
  if (s.length) lines.push(`Length: ${s.length}.`);
  if (s.audience) lines.push(`Audience: ${s.audience}.`);
  if (s.example) lines.push(`\nExpected shape:\n${s.example}`);
  if (s.safeguard) lines.push(`\n${s.safeguard}`);
  return lines.join("\n");
}

function renderPlain(s: ImprovedSections): string {
  const parts: string[] = [];
  if (s.role) parts.push(`Act as ${s.role}.`);
  parts.push(`Task: ${s.task}`);
  const constraints: string[] = [];
  if (s.format) constraints.push(`Format: ${s.format}.`);
  if (s.length) constraints.push(`Length: ${s.length}.`);
  if (s.audience) constraints.push(`Audience: ${s.audience}.`);
  if (constraints.length) parts.push(constraints.join("\n"));
  if (s.example) parts.push(s.example);
  if (s.safeguard) parts.push(s.safeguard);
  return parts.join("\n\n");
}

// ─── Backwards-compat shim ────────────────────────────────────────────────

export type AutoFixResult = {
  improved: string;
  insights: Insight[];
  changed: boolean;
};

export function improvePromptLocal(input: string): AutoFixResult {
  const p = improvePrompt(input);
  return {
    improved: renderForModel(p, "plain"),
    insights: p.insights,
    changed: p.changed,
  };
}
