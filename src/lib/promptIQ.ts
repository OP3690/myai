export type IQOption = {
  label: string;
  correct: boolean;
  explainer?: string;
};

export type IQQuestion = {
  id: string;
  prompt: string;
  scenario?: string;
  options: IQOption[];
  /** One-line concept the question tests. */
  tests: string;
};

export const QUESTIONS: IQQuestion[] = [
  {
    id: "role",
    prompt: "You want ChatGPT to write technical documentation for a senior backend engineer audience. Which opener does the model best?",
    options: [
      {
        label: "\"Write technical documentation about caching.\"",
        correct: false,
        explainer: "Generic — no role, no audience, no format. The model defaults to a Wikipedia-style overview.",
      },
      {
        label: "\"Act as a senior backend engineer who has shipped distributed systems. Write a technical doc on caching for engineers comfortable with Redis.\"",
        correct: true,
        explainer: "Specific role + specific audience = output calibrated to the reader.",
      },
      {
        label: "\"Please be an expert and write some great technical documentation about caching, thanks!\"",
        correct: false,
        explainer: "Politeness fluff + vague \"expert\" + vague \"great\" — every word here is wasted.",
      },
      {
        label: "\"You are the world's best technical writer. Write about caching.\"",
        correct: false,
        explainer: "Superlatives don't help; specificity does.",
      },
    ],
    tests: "Role + audience specificity",
  },
  {
    id: "contradiction",
    prompt: "Which of these prompts has a contradiction the model will silently split-the-difference on?",
    options: [
      {
        label: "\"Write a short summary of the meeting notes.\"",
        correct: false,
        explainer: "Clear and consistent.",
      },
      {
        label: "\"Write a short but detailed summary of the meeting notes.\"",
        correct: true,
        explainer: "\"Short\" and \"detailed\" contradict. The model produces mush. Pick one.",
      },
      {
        label: "\"Write a 200-word summary of the meeting notes.\"",
        correct: false,
        explainer: "Hard length constraint — best practice.",
      },
      {
        label: "\"Write a detailed summary covering action items.\"",
        correct: false,
        explainer: "Specific scope, no contradiction.",
      },
    ],
    tests: "Spotting contradictions",
  },
  {
    id: "cot",
    prompt: "On a multi-step math word problem, which single addition most improves accuracy on GPT-4 / Claude?",
    options: [
      {
        label: "\"Make sure you get the right answer.\"",
        correct: false,
        explainer: "Telling the model to be correct doesn't help — it already thinks it's correct.",
      },
      {
        label: "\"Show your reasoning step by step before giving the final answer.\"",
        correct: true,
        explainer: "Chain-of-Thought. Single highest-ROI move on reasoning tasks.",
      },
      {
        label: "\"Be confident in your answer.\"",
        correct: false,
        explainer: "Confidence isn't the issue — the model is too confident already. You want it to slow down and show work.",
      },
      {
        label: "\"Use proper math notation.\"",
        correct: false,
        explainer: "Notation is cosmetic; reasoning is the bottleneck.",
      },
    ],
    tests: "When to apply Chain-of-Thought",
  },
  {
    id: "format",
    prompt: "You need ChatGPT to produce data your code will parse. The most reliable way to lock the shape is:",
    options: [
      {
        label: "Ask politely for clean output.",
        correct: false,
        explainer: "Politeness doesn't shape output.",
      },
      {
        label: "Provide one example input → expected JSON output, then ask for the next.",
        correct: true,
        explainer: "Few-shot prompting with an explicit shape is the most reliable format-locker.",
      },
      {
        label: "Tell the model to be careful.",
        correct: false,
        explainer: "Vague instructions get vague output.",
      },
      {
        label: "Use ALL CAPS to emphasize JSON.",
        correct: false,
        explainer: "Caps don't help. Some tokenizers handle them worse.",
      },
    ],
    tests: "Few-shot prompting for structure",
  },
  {
    id: "claude-syntax",
    prompt: "Claude was trained with heavy use of XML-tagged sections. Which is the most Claude-native prompt format?",
    options: [
      {
        label: "Markdown headings (## Task, ## Output format).",
        correct: false,
        explainer: "Markdown headings are ChatGPT's preferred format.",
      },
      {
        label: "Plain prose paragraphs.",
        correct: false,
        explainer: "Works, but loses Claude's structural advantage.",
      },
      {
        label: "<role>...</role> <task>...</task> <output_format>...</output_format>",
        correct: true,
        explainer: "Claude responds best to XML-tagged sections. Anthropic trained heavily on this.",
      },
      {
        label: "JSON-shaped instructions.",
        correct: false,
        explainer: "Works but cumbersome compared to XML tags.",
      },
    ],
    tests: "Per-model syntax preferences",
  },
  {
    id: "hallucination",
    prompt: "Which addition cuts hallucinations the most on knowledge-heavy questions?",
    options: [
      {
        label: "\"Be accurate.\"",
        correct: false,
        explainer: "Models already think they're accurate.",
      },
      {
        label: "\"If you don't know something, say 'I don't know' rather than guessing. If anything is ambiguous, ask first.\"",
        correct: true,
        explainer: "Explicit permission to refuse + ask is the highest-ROI anti-hallucination move.",
      },
      {
        label: "\"Cite Wikipedia for every fact.\"",
        correct: false,
        explainer: "Models will fabricate Wikipedia URLs. Citation alone doesn't reduce hallucinations.",
      },
      {
        label: "\"Use only verified information.\"",
        correct: false,
        explainer: "Vague — the model thinks all its info is verified.",
      },
    ],
    tests: "Anti-hallucination patterns",
  },
  {
    id: "length",
    prompt: "Which length constraint produces the most consistent output across runs?",
    options: [
      {
        label: "\"Keep it brief.\"",
        correct: false,
        explainer: "\"Brief\" means anything from 20 to 200 words depending on the model's mood.",
      },
      {
        label: "\"Concise but thorough.\"",
        correct: false,
        explainer: "Contradiction. Pick one.",
      },
      {
        label: "\"Under 120 words.\"",
        correct: true,
        explainer: "Hard numbers beat soft adjectives every time.",
      },
      {
        label: "\"Short.\"",
        correct: false,
        explainer: "Even worse than \"brief\" — single-word constraints are essentially unconstrained.",
      },
    ],
    tests: "Hard vs. soft constraints",
  },
  {
    id: "decision",
    prompt: "You ask the AI \"Should I quit my job to start a SaaS?\" — what's the single best framing addition?",
    options: [
      {
        label: "\"Be encouraging.\"",
        correct: false,
        explainer: "Encouragement is the failure mode you want to avoid — it'll just agree with you.",
      },
      {
        label: "\"Do not be diplomatic. Push back on lazy reasoning. List 3 things I'm underweighting and 2 questions that would change your answer.\"",
        correct: true,
        explainer: "Pre-bakes the anti-sycophancy. Forces actual analysis.",
      },
      {
        label: "\"Tell me what to do.\"",
        correct: false,
        explainer: "Models default to wishy-washy when asked to decide. Direct prompts trigger more direct refusals or sycophancy.",
      },
      {
        label: "\"Be neutral.\"",
        correct: false,
        explainer: "Neutrality produces a list-of-considerations answer that doesn't actually help.",
      },
    ],
    tests: "Anti-sycophancy framing",
  },
  {
    id: "decompose",
    prompt: "You give the AI a 4-deliverable task: \"Write a blog, design 3 hero images, write a launch email, and a tweet thread.\" The model does the first one well and skims the rest. Best fix?",
    options: [
      {
        label: "Use ALL CAPS for emphasis.",
        correct: false,
        explainer: "Doesn't help.",
      },
      {
        label: "Decompose into a chain: separate prompts for each deliverable, run them sequentially, paste prior outputs as context.",
        correct: true,
        explainer: "Task decomposition consistently beats one-shot on multi-deliverable asks. Use our /chunker decomposer.",
      },
      {
        label: "Add \"Make sure to do all 4 well.\"",
        correct: false,
        explainer: "The model already thinks it did. Doesn't help.",
      },
      {
        label: "Add more context about why you need all four.",
        correct: false,
        explainer: "Context helps, but won't solve the attention-dilution problem of multi-task prompts.",
      },
    ],
    tests: "When to decompose multi-step tasks",
  },
  {
    id: "self-refine",
    prompt: "Your AI-generated draft is okay but not great. Which approach gives the biggest quality boost?",
    options: [
      {
        label: "Ask the same model to \"make it better\".",
        correct: false,
        explainer: "Too vague — the model often returns the same draft slightly reworded.",
      },
      {
        label: "Generate → switch to a brutal-editor voice → find 3 specific weaknesses with quotes → revise. Repeat 2 more times.",
        correct: true,
        explainer: "Self-Refine loop. Pushes models from ~30% to ~80% of their capacity on creative tasks.",
      },
      {
        label: "Regenerate with the same prompt.",
        correct: false,
        explainer: "You get lateral variance, not improvement.",
      },
      {
        label: "Add \"This needs to be amazing\" to the original prompt.",
        correct: false,
        explainer: "Adjectives don't move the needle. Process does.",
      },
    ],
    tests: "Self-Refine pattern",
  },
];

export type IQResult = {
  band: "novice" | "intermediate" | "advanced" | "expert";
  label: string;
  blurb: string;
  topPercent: number;
};

export function bandForScore(score: number): IQResult {
  if (score >= 90)
    return {
      band: "expert",
      label: "🧠 Prompt-engineering expert",
      blurb:
        "You've internalized the patterns. You know when CoT helps and when it hurts. You spot contradictions in seconds. You're calibrating Claude's XML and ChatGPT's markdown without thinking.",
      topPercent: 5,
    };
  if (score >= 70)
    return {
      band: "advanced",
      label: "⚡ Advanced prompter",
      blurb:
        "You write better prompts than 80% of people who use AI daily. The structure is solid. The next level is per-model nuance and multi-step decomposition.",
      topPercent: 20,
    };
  if (score >= 40)
    return {
      band: "intermediate",
      label: "🛠 Working prompter",
      blurb:
        "You know the basics. Role, format, length. The next big unlocks: Chain-of-Thought, few-shot examples, and anti-hallucination framing.",
      topPercent: 50,
    };
  return {
    band: "novice",
    label: "🌱 Just getting started",
    blurb:
      "Good news: every pattern you missed is on this site, and the auto-fixer applies them for you. Spend 10 minutes with the glossary and you'll jump to Working Prompter.",
    topPercent: 100,
  };
}
