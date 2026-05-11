export type GlossaryEntry = {
  slug: string;
  term: string;
  short: string; // one-line definition
  alsoKnownAs?: string[];
  templateSlug?: string; // the canonical interactive template for this technique
  whenToUse: string[];
  whenNotToUse: string[];
  howItWorks: string[];
  pitfalls: string[];
  example: {
    bad: string;
    good: string;
  };
  origin?: string;
  related: string[]; // other glossary slugs
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    slug: "chain-of-thought",
    term: "Chain-of-Thought (CoT) Prompting",
    short:
      "Force the model to think step-by-step before answering. Dramatically improves accuracy on multi-step problems.",
    alsoKnownAs: ["CoT", "Let's think step by step"],
    templateSlug: "chain-of-thought-reasoning",
    whenToUse: [
      "Multi-step arithmetic, logic puzzles, or word problems.",
      "Anywhere the model is making confident-but-wrong leaps.",
      "When the answer depends on intermediate calculations or sub-decisions.",
      "Reasoning about code: trace, simulate, debug.",
    ],
    whenNotToUse: [
      "Simple lookups or factual questions where reasoning steps add no value.",
      "Creative writing — explicit reasoning can flatten the prose.",
      "Token-sensitive contexts where cost matters and the task is easy.",
    ],
    howItWorks: [
      "Models trained on instruction-following do better when forced to write intermediate steps before committing to a final answer.",
      "The act of generating reasoning tokens conditions the final answer on more deliberate context — like the model is talking itself through it.",
      "Variants: zero-shot CoT (\"Let's think step by step.\"), few-shot CoT (give example reasoning chains in the prompt), or scaffolded CoT (require specific stages like restate → known → unknown → bridge → answer).",
    ],
    pitfalls: [
      "Reasoning can be plausible but wrong — verify with a different method when stakes are high.",
      "Long chains burn tokens; if budget is tight, prefer scaffolded over open-ended chains.",
      "On simple problems, CoT can introduce errors that wouldn't have happened with a direct answer.",
    ],
    example: {
      bad: "What's 17% of 250?",
      good: "Solve step by step:\n1. Convert 17% to a decimal.\n2. Multiply by 250.\n3. State the answer.\n4. Verify by computing 10% + 7% separately and adding.",
    },
    origin: "Wei et al., 2022. Popularized by zero-shot CoT (Kojima et al., 2022).",
    related: ["tree-of-thoughts", "self-refine", "first-principles"],
  },
  {
    slug: "tree-of-thoughts",
    term: "Tree-of-Thoughts (ToT) Prompting",
    short:
      "Generate multiple reasoning branches per step, evaluate each, and prune. Beats single-path Chain-of-Thought on hard decisions.",
    alsoKnownAs: ["ToT", "Branch-and-prune reasoning"],
    templateSlug: "tree-of-thoughts",
    whenToUse: [
      "High-stakes decisions with multiple viable paths.",
      "Open-ended problems where the first answer is rarely the best.",
      "Strategy work: pricing, hiring, technical architecture.",
      "Tasks that benefit from optionality and reversibility analysis.",
    ],
    whenNotToUse: [
      "Tasks with one obviously correct answer.",
      "Quick chat or short factual questions.",
      "Anywhere the user just wants a direct opinion, not a tree of analyses.",
    ],
    howItWorks: [
      "At each reasoning step, the model is instructed to produce N candidate continuations (typically 3–5).",
      "Each branch is then evaluated against criteria — likelihood of success, cost of failure, optionality preserved.",
      "Weakest branches are pruned. Surviving branches branch again at the next step.",
      "The final answer is the path that survives the deepest while accumulating the strongest scores.",
    ],
    pitfalls: [
      "Burns tokens. The tree can blow up combinatorially if not pruned aggressively.",
      "Evaluation criteria must be specified clearly, or the model just picks its own first idea.",
      "Without forcing a final pick, ToT can end in option-paralysis with no actionable conclusion.",
    ],
    example: {
      bad: "Should I quit my job to start a SaaS?",
      good: "Explore 3 paths: (1) quit and go full-time, (2) build nights+weekends, (3) stay employed and angel-invest. Score each on success likelihood, downside, and optionality. Prune to top 2, branch into concrete sub-options, pick a winner.",
    },
    origin: "Yao et al., 2023 — \"Tree of Thoughts: Deliberate Problem Solving with Large Language Models.\"",
    related: ["chain-of-thought", "self-refine", "multi-persona-debate"],
  },
  {
    slug: "self-refine",
    term: "Self-Refine",
    short:
      "Generate → critique own output → revise → repeat. Pushes a model's output much closer to its capability ceiling.",
    alsoKnownAs: ["Self-critique loop", "Reflexion"],
    templateSlug: "self-refine-loop",
    whenToUse: [
      "Any generative task: writing, code, design, plans.",
      "When the first draft is acceptable but not great.",
      "Anywhere quality matters more than latency or cost.",
      "Inside agentic systems that have time to iterate.",
    ],
    whenNotToUse: [
      "Real-time chat where users wait for a response.",
      "Trivial tasks where the first draft is fine.",
      "Tight token budgets — self-refine roughly triples cost.",
    ],
    howItWorks: [
      "The model produces a first draft.",
      "It switches into a critique persona and lists specific weaknesses in the draft (not vague — \"this sentence is awkward because…\").",
      "It writes a revision plan addressing each weakness.",
      "It applies the plan, producing a new draft. Loop typically runs 3 iterations.",
      "Final output is the result of iteration N's revision.",
    ],
    pitfalls: [
      "If the critique voice is too gentle, the model just re-outputs the same draft slightly reworded.",
      "Without numbering iterations, the model may collapse the loop into one shot.",
      "Some models 'agree' with their own critiques on the surface but don't actually change the substance.",
    ],
    example: {
      bad: "Write a LinkedIn post about shipping fast.",
      good: "Write a LinkedIn post about shipping fast. After drafting, switch to a brutal-editor voice and find 3 specific weaknesses (point at exact sentences). Revise. Repeat twice more.",
    },
    origin: "Madaan et al., 2023 — \"Self-Refine: Iterative Refinement with Self-Feedback.\"",
    related: ["chain-of-thought", "tree-of-thoughts", "constitutional-ai"],
  },
  {
    slug: "multi-persona-debate",
    term: "Multi-Persona Debate / Council",
    short:
      "Simulate multiple distinct experts debating the question, then synthesize. Surfaces what a single persona would have missed.",
    alsoKnownAs: ["Multi-agent debate", "Expert panel"],
    templateSlug: "multi-persona-council",
    whenToUse: [
      "Decisions with multiple legitimate perspectives.",
      "Strategic or ethical questions where bias-checking matters.",
      "Brainstorming where you want range, not depth.",
      "Pre-commitment audits of plans and pitches.",
    ],
    whenNotToUse: [
      "Single-answer factual questions.",
      "Tasks where one expert clearly dominates the domain.",
      "When you need fast output — debates are token-hungry.",
    ],
    howItWorks: [
      "Define 3–5 personas with distinct cognitive biases (e.g. Skeptic, Pragmatist, Visionary, Cynic, Outsider).",
      "Round 1: each persona gives a brief opening position.",
      "Round 2: cross-examination — each persona challenges another.",
      "Round 3: rebuttals, with required concessions.",
      "A moderator (still the same model) synthesizes: the shared unstated assumption, the sharpest disagreements, and an integrated recommendation.",
    ],
    pitfalls: [
      "If personas are too similar, the debate is theater — output is a wash.",
      "Forcing concessions is essential or the model defends all sides equally.",
      "Without naming the shared assumption at the end, you miss the most valuable signal.",
    ],
    example: {
      bad: "What do you think of our new pricing?",
      good: "Convene 5 personas (Skeptic, CFO, Customer, Sales Lead, Outsider) to debate this pricing. Three rounds, each must concede a point. End with the assumption all 5 implicitly shared.",
    },
    origin: "Liang et al., 2023 — \"Encouraging Divergent Thinking in Large Language Models through Multi-Agent Debate.\"",
    related: ["tree-of-thoughts", "adversarial-prompting", "self-refine"],
  },
  {
    slug: "adversarial-prompting",
    term: "Adversarial / Red-Team Prompting",
    short:
      "Ask the model to attack your idea before defending it. Surfaces the failure modes before they ship.",
    alsoKnownAs: ["Red-team", "Devil's advocate"],
    templateSlug: "adversarial-red-team",
    whenToUse: [
      "Pre-launch audits of products, pitches, plans.",
      "Decision reviews where confirmation bias is likely.",
      "Security or risk assessment of any system or process.",
      "Writing — drafting the strongest counter-position before yours.",
    ],
    whenNotToUse: [
      "Emotional support contexts — the harsh framing is wrong here.",
      "Final-pass polish where you want to ship, not re-debate.",
      "Anywhere the model has already been overly negative.",
    ],
    howItWorks: [
      "Frame the model as a hostile analyst whose only loyalty is to truth.",
      "Forbid politeness and hedging up front.",
      "Ask for the kill shot first — the single most likely reason for failure.",
      "Then enumerate failure-mode categories: slow death, hidden assumption, competitor move, user revolt, regulatory landmine, team failure.",
      "End with the cheapest defense against the most likely failure mode.",
    ],
    pitfalls: [
      "Some models default to balance — 'on the other hand' creeps in. Explicitly forbid it.",
      "Without specifying categories, the critique becomes generic ('it might not work out').",
      "The output is meant to be hard to read. Don't soften it before sharing with the team.",
    ],
    example: {
      bad: "Review my startup pitch.",
      good: "Act as a hostile red-team analyst. Find the kill shot, the slow death, the hidden assumption, the competitor move, the user revolt, the regulatory landmine, and the team failure. End with the cheapest defense.",
    },
    origin: "Common practice in AI safety / red-team evaluation, popularized by Anthropic's Constitutional AI work.",
    related: ["pre-mortem", "multi-persona-debate", "cognitive-bias-audit"],
  },
  {
    slug: "pre-mortem",
    term: "Pre-Mortem Analysis",
    short:
      "Imagine the project failed 6 months from now. Work backwards from the failure to find the cause. Used at Amazon and NASA.",
    alsoKnownAs: ["Future-perfect failure analysis"],
    templateSlug: "pre-mortem",
    whenToUse: [
      "Before any high-investment project launch.",
      "When the team is overly optimistic and dismissing risks.",
      "Investment decisions, hiring choices, strategic pivots.",
      "Any plan where a 6–12 month outcome is the unit of analysis.",
    ],
    whenNotToUse: [
      "Reversible, low-cost actions where the analysis cost exceeds the project cost.",
      "Daily operations — pre-mortems are for big bets, not standing meetings.",
    ],
    howItWorks: [
      "Frame the model as writing the post-mortem from N months in the future, with the project already failed.",
      "Define failure clearly up front (e.g. \"<10 paying customers\", \"team disbanded\", \"shipped 3 months late\").",
      "Write a month-by-month timeline of disaster — what went wrong, when.",
      "Identify the earliest warning sign and the decision that locked failure in.",
      "Identify who, in retrospect, was raising the right concern that got dismissed.",
      "Snap back to today and list 3 concrete actions to take this week to make the failure less likely.",
    ],
    pitfalls: [
      "Without naming failure concretely, the analysis is generic.",
      "If month-by-month is skipped, you miss gradual-decay failures.",
      "If the exercise ends in the imagined future, it's theater. The 'this week' actions are what convert it into an intervention.",
    ],
    example: {
      bad: "Will my product launch succeed?",
      good: "It's 6 months post-launch and you have <1,000 active users. Write the post-mortem: month-by-month timeline, earliest warning sign, decision that locked failure in. Then snap back to today and list 3 actions for this week.",
    },
    origin: "Gary Klein, 2007. Adopted at Amazon (writing memos for failed launches before kickoff) and NASA.",
    related: ["adversarial-prompting", "cognitive-bias-audit", "first-principles"],
  },
];

export function getGlossary(slug: string): GlossaryEntry | undefined {
  return GLOSSARY.find((g) => g.slug === slug);
}
