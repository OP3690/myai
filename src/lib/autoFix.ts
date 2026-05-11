import type { Metric } from "./linter";

export type InsightKind = "removed" | "added" | "rewrote";

export type Insight = {
  kind: InsightKind;
  text: string;
  reason: string;
  improves: Metric[];
};

export type AutoFixResult = {
  improved: string;
  insights: Insight[];
  changed: boolean;
};

const VAGUE_OPENERS: { pattern: RegExp; label: string }[] = [
  { pattern: /^(?:hey\s+(?:ai|chatgpt|claude|bot|gpt|gemini),?\s+)/i, label: "AI greeting" },
  { pattern: /^(?:can\s+you\s+(?:please|kindly)?\s*)/i, label: '"can you please"' },
  { pattern: /^(?:could\s+you\s+(?:please|kindly)?\s*)/i, label: '"could you please"' },
  { pattern: /^(?:would\s+you\s+(?:please|kindly|mind)?\s*)/i, label: '"would you please"' },
  { pattern: /^(?:please\s+)/i, label: '"please"' },
  { pattern: /^(?:i\s+(?:need|want)\s+(?:some\s+)?(?:help\s+(?:with|on)|info\s+about))/i, label: '"i need help with"' },
  { pattern: /^(?:i\s+would\s+like\s+(?:to\s+know\s+|help\s+with\s+)?)/i, label: '"i would like"' },
  { pattern: /^(?:help\s+me\s+(?:with|on|to)\s+)/i, label: '"help me with"' },
  { pattern: /^(?:help\s+me\s+)(?=[a-z])/i, label: '"help me"' },
  { pattern: /^(?:tell\s+me\s+about)/i, label: '"tell me about"' },
];

const POLITENESS_TRAILS = [
  /\s*(thanks\s+(?:so\s+much|in\s+advance|a\s+lot))\s*[.!?]?\s*$/i,
  /\s*(thank\s+you(?:\s+(?:so\s+much|very\s+much|in\s+advance))?)\s*[.!?]?\s*$/i,
  /\s*(thanks(?:!|\.|,)?)\s*$/i,
  /\s*(ty)\s*[.!?]?\s*$/i,
  /\s*(appreciate\s+(?:it|the\s+help))\s*[.!?]?\s*$/i,
];

const WEAK_PHRASES: { pattern: RegExp; replacement: string; label: string }[] = [
  { pattern: /\b(?:maybe|perhaps)\s+/gi, replacement: "", label: 'hedge "maybe"' },
  { pattern: /\bif\s+possible[,]?\s*/gi, replacement: "", label: '"if possible"' },
  { pattern: /\btry\s+to\s+/gi, replacement: "", label: '"try to"' },
  { pattern: /\bsort\s+of\s+/gi, replacement: "", label: '"sort of"' },
  { pattern: /\bkind\s+of\s+/gi, replacement: "", label: '"kind of"' },
  { pattern: /\bi\s+(?:think|guess|feel|believe)\s+/gi, replacement: "", label: '"I think"' },
];

const ROLE_PATTERN = /\b(act\s+as|you\s+are\s+(?:a|an|the)|as\s+(?:a|an)\s+(?:senior|expert|professional)|imagine\s+you\s+are|pretend\s+you\s+are|role[: ]|persona[: ])\b/i;
const FORMAT_PATTERN = /\b(list|bullets?|table|json|yaml|xml|markdown|md|csv|paragraph|paragraphs|outline|bullet\s+points|step[- ]by[- ]step|numbered|code\s+block|format(?:ted)?|schema)\b/i;
const LENGTH_PATTERN = /\b\d+\s*(?:words?|sentences?|paragraphs?|lines?|bullets?|items?|steps?|tokens?|chars?)\b|\b(short|brief|concise|tldr|detailed|comprehensive|thorough|in[- ]depth|long|exhaustive|one[- ]sentence|one[- ]paragraph)\b/i;
const AUDIENCE_PATTERN = /\b(for\s+(?:a|an|my)\s+(?:beginner|expert|engineer|student|teacher|child|kid|five[- ]year[- ]old|5\s*year\s*old|non[- ]technical|developer|designer|manager|investor|audience)|explain\s+(?:it\s+)?(?:to|like))\b/i;
const EXAMPLE_PATTERN = /\b(example|examples|e\.g\.?|for instance|such as|like this:|input:|output:|sample)\b/i;

const CONTRADICTION_PAIRS: { a: RegExp; b: RegExp; keep: "a" | "b"; aLabel: string; bLabel: string }[] = [
  { a: /\b(short|brief|concise|tldr)\b/i, b: /\b(detailed|comprehensive|thorough|exhaustive|in[- ]depth|long)\b/i, keep: "a", aLabel: "concise", bLabel: "detailed" },
  { a: /\b(simple|simply|basic)\b/i, b: /\b(technical|advanced|expert|sophisticated)\b/i, keep: "a", aLabel: "simple", bLabel: "advanced" },
];

function inferRole(text: string): string {
  const t = text.toLowerCase();
  if (/\b(code|coding|programming|function|class|debug|bug|error|stack\s*trace|api|sql|database|query|script|terminal|command|regex|kubernetes|docker|react|node|python|typescript|javascript)\b/.test(t))
    return "a senior software engineer who writes code reviewers actually thank you for";
  if (/\b(blog|article|post|caption|headline|tweet|thread|copy|content|seo|landing\s*page|essay|paragraph|writing|writ(?:e|ten|er)\s+(?:about|on|a|an)?)\b/.test(t))
    return "a sharp professional writer who writes for engaged readers, not search engines";
  if (/\b(email|reply|response|message)\b/.test(t))
    return "a thoughtful communicator who writes warm, direct, professional messages";
  if (/\b(explain|teach|tutor|learn|study|exam|homework|lesson|understand)\b/.test(t))
    return "an experienced teacher who breaks complex topics into simple, memorable steps";
  if (/\b(startup|saas|business|marketing|sales|customer|product|launch|growth|revenue|pricing|investor|pitch)\b/.test(t))
    return "a seasoned operator who has shipped real products and made real bets";
  if (/\b(design|logo|ui|ux|brand|figma|wireframe|mockup|typography|color\s*palette)\b/.test(t))
    return "a senior product designer with strong opinions about clarity over decoration";
  if (/\b(math|algebra|calculus|equation|formula|physics|chemistry|science|biology|geometry|statistics)\b/.test(t))
    return "a patient subject-matter tutor who shows the working, not just the answer";
  if (/\b(legal|law|contract|agreement|liability|terms|nda)\b/.test(t))
    return "a careful advisor (note: not actual legal advice — flag anything that needs a real lawyer)";
  if (/\b(diet|workout|fitness|nutrition|sleep|meditation|anxiety|stress|mental\s*health|therapy)\b/.test(t))
    return "a thoughtful coach (not a medical professional — flag anything clinical)";
  if (/\b(dating|partner|relationship|friend|family|breakup|apology|crush)\b/.test(t))
    return "a wise friend (not a therapist) who helps me think clearly without judgement";
  if (/\b(language|japanese|spanish|french|german|mandarin|hindi|grammar|vocabulary|pronunciation)\b/.test(t))
    return "a friendly language partner who corrects errors gently and explains the rule briefly";
  if (/\b(youtube|tiktok|reel|short[- ]form|short\s+video|short\s+content|video\s+script|thumbnail|viral\s+hook|viral\s+video)\b/.test(t))
    return "a creator who understands hooks, retention, and how short-form actually works";
  return "an expert on this topic with strong opinions and the experience to back them up";
}

function inferFormat(text: string): { spec: string; mentions?: string } {
  const t = text.toLowerCase();
  if (/\bjson\b/.test(t))
    return { spec: "a JSON object — return only the JSON, no prose around it" };
  if (/\b(code|function|implementation|script)\b/.test(t))
    return { spec: "a code block with the full implementation, followed by 2–3 lines of plain-English explanation" };
  if (/\b(compare|comparison|versus|\bvs\b|difference)\b/.test(t))
    return { spec: "a markdown table comparing the options, then a 2-sentence recommendation" };
  if (/\b(steps|guide|how\s*to|process|tutorial|walk\s*through)\b/.test(t))
    return { spec: "a numbered step-by-step guide, each step under 25 words" };
  if (/\b(list|options|items|features|examples)\b/.test(t))
    return { spec: "a numbered list, max 8 items, each item one sentence" };
  if (/\b(explain|why|how\s+does|describe|analyze|analyse)\b/.test(t))
    return { spec: "a 1-paragraph summary, then 3 bullet points expanding the key ideas" };
  if (/\b(write|blog|article|essay|post)\b/.test(t))
    return { spec: "3 short paragraphs with a clear opening line and no fluff" };
  if (/\b(email|reply|response|message)\b/.test(t))
    return { spec: "plain text — no markdown, no greeting fluff, end with one clear ask" };
  return { spec: "a short structured answer — 1) the conclusion, 2) the reasoning, 3) what to do next" };
}

function inferLength(text: string): string {
  const t = text.toLowerCase();
  if (/\b(short|brief|concise|tldr|quick|one[- ]paragraph|one[- ]sentence)\b/.test(t)) return "under 120 words";
  if (/\b(detailed|comprehensive|thorough|in[- ]depth|exhaustive|long)\b/.test(t)) return "400–600 words";
  return "under 250 words";
}

function inferAudienceLine(text: string): string {
  const t = text.toLowerCase();
  if (/\bbeginner|new|just\s+starting|first\s+time|never\s+(done|learned)\b/.test(t))
    return "Audience: beginner — define jargon inline and use everyday analogies.";
  if (/\b(senior|expert|advanced|experienced)\b/.test(t))
    return "Audience: expert — skip the basics, use precise terminology, surface edge cases.";
  return "Audience: intermediate — skip the obvious, but flag anything truly advanced.";
}

function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function withTerminator(s: string): string {
  if (!s) return s;
  return /[.!?]$/.test(s) ? s : s + ".";
}

export function improvePromptLocal(input: string): AutoFixResult {
  const original = (input ?? "").trim();
  if (!original) {
    return { improved: "", insights: [], changed: false };
  }

  const insights: Insight[] = [];
  let task = original;

  // 1) Strip vague openers — cascade through multiple in sequence (e.g. "can you please help me with…")
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

  // 2) Strip trailing politeness
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

  // 3) Strip weak hedging phrases
  for (const w of WEAK_PHRASES) {
    if (w.pattern.test(task)) {
      task = task.replace(w.pattern, w.replacement);
      insights.push({
        kind: "removed",
        text: w.label,
        reason: "Hedging makes the model give wishy-washy answers. Be direct.",
        improves: ["clarity", "specificity"],
      });
    }
  }

  // 4) Resolve contradictions — strip the dropped word AND any orphaned connective ("and", "but also", etc.)
  for (const c of CONTRADICTION_PAIRS) {
    if (c.a.test(task) && c.b.test(task)) {
      const droppedSrc = (c.keep === "a" ? c.b : c.a).source;
      // Capture the contradiction word together with its surrounding connective so we don't leave "and but also" residue.
      const cleanupPattern = new RegExp(
        `(?:\\s+(?:and|but|or|also|yet|but\\s+also)\\s+)?${droppedSrc}|${droppedSrc}(?:\\s+(?:and|but|or|also|yet|but\\s+also)\\s+)?`,
        "i"
      );
      task = task.replace(cleanupPattern, " ").replace(/\s{2,}/g, " ").trim();
      insights.push({
        kind: "rewrote",
        text: `Resolved "${c.aLabel}" vs "${c.bLabel}" contradiction`,
        reason: `You asked for both — kept "${c.keep === "a" ? c.aLabel : c.bLabel}", dropped the other. Pick one and the model stops guessing.`,
        improves: ["clarity", "risk"],
      });
      break;
    }
  }

  // 5) Collapse whitespace + capitalize + terminate
  task = task.replace(/\s+/g, " ").trim();
  task = capitalizeFirst(task);
  task = withTerminator(task);

  if (!task) {
    // Edge case — original was nothing but politeness
    task = capitalizeFirst(withTerminator(original));
  }

  // 6) Check what's missing in the ORIGINAL prompt (so we don't double-add)
  const hasRole = ROLE_PATTERN.test(original);
  const hasFormat = FORMAT_PATTERN.test(original);
  const hasLength = LENGTH_PATTERN.test(original);
  const hasAudience = AUDIENCE_PATTERN.test(original);
  const hasExample = EXAMPLE_PATTERN.test(original);

  // 7) Build structured prompt
  const sections: string[] = [];

  if (!hasRole) {
    const role = inferRole(original);
    sections.push(`Act as ${role}.`);
    insights.push({
      kind: "added",
      text: `Role: "${role}"`,
      reason: "A clear role tells the model what perspective and expertise level to take.",
      improves: ["context"],
    });
  }

  sections.push(`Task: ${task}`);

  const constraints: string[] = [];
  if (!hasFormat) {
    const { spec } = inferFormat(original);
    constraints.push(`Format: ${spec}.`);
    insights.push({
      kind: "added",
      text: `Output format: ${spec}`,
      reason: "Without a format, you get unpredictable structure that's hard to parse or reuse.",
      improves: ["structure"],
    });
  }
  if (!hasLength) {
    const length = inferLength(original);
    constraints.push(`Length: ${length}.`);
    insights.push({
      kind: "added",
      text: `Length: ${length}`,
      reason: "Telling the model the target length prevents under- and over-shooting.",
      improves: ["structure"],
    });
  }
  if (!hasAudience) {
    constraints.push(inferAudienceLine(original));
    insights.push({
      kind: "added",
      text: "Audience line",
      reason: "The right answer for a beginner is very different from the right answer for an expert.",
      improves: ["context"],
    });
  }
  if (constraints.length) sections.push(constraints.join("\n"));

  // 8) Safeguard tail
  const wordsInOriginal = original.split(/\s+/).filter(Boolean).length;
  if (wordsInOriginal > 12) {
    sections.push(
      `If anything in this prompt is ambiguous, ask before guessing. If you don't know something, say "I don't know" rather than making it up.`
    );
    insights.push({
      kind: "added",
      text: "Anti-hallucination safeguard",
      reason: "Explicit permission to ask (and to say 'I don't know') prevents the model from confidently making things up.",
      improves: ["risk"],
    });
  }

  // 9) Example placeholder for longer tasks where it'd actually help
  if (!hasExample && wordsInOriginal > 18 && /\b(write|generate|create|build|draft|design|compose)\b/i.test(original)) {
    sections.push(
      `Example: <paste one short input → desired output pair here so the model can match the style>`
    );
    insights.push({
      kind: "added",
      text: "Example placeholder",
      reason: "Long generative tasks improve dramatically with one concrete input → output example.",
      improves: ["context", "specificity"],
    });
  }

  const improved = sections.join("\n\n");
  return {
    improved,
    insights,
    changed: improved.trim() !== original.trim(),
  };
}
