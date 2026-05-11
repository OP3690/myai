export type Platform = "chatgpt" | "claude" | "gemini" | "grok" | "cursor" | "copilot";

export type TemplateCategory =
  | "techniques"
  | "learning"
  | "coding"
  | "productivity"
  | "business"
  | "content"
  | "relationships"
  | "health"
  | "fun";

export type Template = {
  slug: string;
  title: string;
  tagline: string;
  category: TemplateCategory;
  beforePrompt: string;
  betterPrompt: string;
  whyItWorks: string[];
  platforms: Platform[];
  tags: string[];
  advanced?: boolean;
  viral?: boolean;
  technique?: string;
};

export const CATEGORY_LABEL: Record<TemplateCategory, string> = {
  techniques: "Advanced Techniques",
  learning: "Learning",
  coding: "Coding",
  productivity: "Productivity",
  business: "Business",
  content: "Content",
  relationships: "Relationships",
  health: "Health",
  fun: "Fun",
};

export const CATEGORY_EMOJI: Record<TemplateCategory, string> = {
  techniques: "⚡",
  learning: "📚",
  coding: "💻",
  productivity: "🧠",
  business: "💼",
  content: "🎬",
  relationships: "❤️",
  health: "🧘",
  fun: "🎮",
};

export const TEMPLATES: Template[] = [
  // ════════════════════════════════════════════════════════════════════
  // ADVANCED TECHNIQUES — cutting-edge prompt engineering patterns
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "chain-of-thought-reasoning",
    title: "Chain-of-Thought Forced Reasoning",
    tagline: "Make the model show its work before answering — dramatic accuracy gain on multi-step problems.",
    category: "techniques",
    advanced: true,
    technique: "Chain-of-Thought (CoT)",
    beforePrompt: "What's the answer to <complex question>?",
    betterPrompt:
      "Act as a careful problem-solver. I will give you a complex question. Do NOT answer immediately.\n\nProblem:\n<PASTE PROBLEM HERE>\n\nFollow this exact protocol:\n\n1. **Restate the problem** in your own words in one sentence. (Verifies you understood it.)\n2. **List what you know** — every fact in the problem, as bullet points.\n3. **List what you don't know** — every unknown, as bullet points.\n4. **Identify the bridge** — the relationship that connects knowns to unknowns.\n5. **Reason step-by-step** — number each step. At each step, state what you're computing/deducing and why this is the right next step.\n6. **Sanity check** — pick ONE step and verify it with a different method.\n7. **State the answer** in one sentence.\n8. **Confidence**: low / medium / high, with the strongest reason you might be wrong.\n\nIf at step 4 you realise the problem is under-specified, STOP and ask the clarifying question instead of guessing.",
    whyItWorks: [
      "Forcing explicit steps catches arithmetic and logic errors that intuition would miss.",
      "The 'what you don't know' bullet is the most-skipped step in human reasoning — and where most errors originate.",
      "The sanity check with a different method is the single move that doubles answer accuracy on complex problems.",
      "Permission to stop and ask kills the 'confidently wrong' failure mode.",
    ],
    platforms: ["claude", "chatgpt", "gemini", "grok"],
    tags: ["reasoning", "accuracy", "math", "logic"],
  },
  {
    slug: "tree-of-thoughts",
    title: "Tree-of-Thoughts Decision Brancher",
    tagline: "Explore 3 branches per decision, prune ruthlessly, beat one-shot answers.",
    category: "techniques",
    advanced: true,
    technique: "Tree-of-Thoughts (ToT)",
    beforePrompt: "What should I do about <X>?",
    betterPrompt:
      "Act as a strategic thinker using Tree-of-Thoughts reasoning.\n\nDecision: <STATE THE DECISION>\nConstraints: <TIME, BUDGET, RISK TOLERANCE, NON-NEGOTIABLES>\nWhat success looks like in 12 months: <DEFINE>\n\nProtocol — work this out in writing, do not jump to a final answer:\n\n**Level 1 — Generate 3 distinct paths.**\nFor each path: one sentence, plus its core mechanism. Paths should be genuinely different (not three flavours of the same idea).\n\n**Level 2 — Evaluate each Level-1 path.**\nFor each: score 1–10 on (a) likelihood of success, (b) cost of failure, (c) optionality (does it preserve future moves?). Show your reasoning, not just the score.\n\n**Prune** to the top 2 paths.\n\n**Level 3 — Branch each surviving path** into 2 concrete sub-options.\nFor each sub-option: the single decisive question that would tell us if this is the right move.\n\n**Pick a winner.**\n- The chosen path + sub-option.\n- Why this beat the others (be specific — not 'highest score').\n- The one piece of new information that would change the answer.\n- The next 72-hour action.\n\nDo not be diplomatic. Pick.",
    whyItWorks: [
      "Most decision prompts get a single-path answer. ToT systematically explores alternatives.",
      "Three evaluation axes (success / failure cost / optionality) beat 'pros and cons' — optionality is what most amateurs miss.",
      "Forcing a pruning step is the only way to escape 'option-paralysis' output.",
      "The 'one piece of new info that would flip this' is the kill question for any decision.",
    ],
    platforms: ["claude", "chatgpt", "gemini"],
    tags: ["strategy", "decision", "branching", "tree-of-thoughts"],
  },
  {
    slug: "self-refine-loop",
    title: "Self-Refine — Generate → Critique → Revise (×3)",
    tagline: "The single move that makes any output 2× better. Used in agentic systems.",
    category: "techniques",
    advanced: true,
    technique: "Self-Refine",
    beforePrompt: "Write me <X>.",
    betterPrompt:
      "Act as both author and editor in a Self-Refine loop.\n\nTask: <PASTE THE GENERATION TASK>\nQuality bar: <e.g. 'sounds like it was written by a person who has done this for 10 years'>\n\nRun this loop **exactly 3 times**:\n\n**Iteration N:**\n1. **Draft N** — write the full output.\n2. **Critique N** — switch to a brutal editor's voice. List the 3 most specific weaknesses of Draft N. Not 'could be clearer' — point at the exact sentence and explain what's wrong.\n3. **Revision plan N** — for each weakness, the precise change you'll make.\n4. Print a one-line scoreline: \"Iteration N — drafted ✓, critiqued ✓, ready for revision.\"\n\nAfter 3 iterations, print:\n- **Final output** (the result of iteration 3's revision plan applied).\n- **What changed across iterations** — 2–3 lines comparing v1 to v3.\n- **What's still imperfect** — 1 honest line.\n\nDo not abandon the loop early because 'this draft is good enough'. Run all 3.",
    whyItWorks: [
      "Single-shot output uses ~30% of a model's capacity. Self-refine pushes closer to 80%.",
      "Forcing a brutal critique voice (different from the writer) breaks the model out of its first-draft attractor.",
      "Numbering iterations and printing scoreline prevents the model from cheating by collapsing the loop.",
      "Honest 'still imperfect' line at the end keeps the output from over-claiming.",
    ],
    platforms: ["claude", "chatgpt", "gemini"],
    tags: ["self-refine", "iteration", "quality", "agents"],
  },
  {
    slug: "multi-persona-council",
    title: "Multi-Persona Expert Council",
    tagline: "Simulate 5 experts arguing — get a richer answer than any one expert could produce.",
    category: "techniques",
    advanced: true,
    technique: "Multi-Persona Debate",
    beforePrompt: "What do you think about <X>?",
    betterPrompt:
      "Simulate a panel of 5 distinct experts debating my question.\n\nQuestion: <PASTE QUESTION>\n\nThe panel:\n1. **The Skeptic** — distrusts the premise; demands evidence.\n2. **The Pragmatist** — only cares about what works in practice this quarter.\n3. **The Visionary** — thinks in 10-year time horizons.\n4. **The Cynic** — assumes incentives explain everything.\n5. **The Outsider** — has no domain expertise but excellent intuition about people.\n\nProtocol:\n\n**Round 1 — Opening positions.** Each persona gives their 2-sentence take. Distinct voices. No hedging.\n\n**Round 2 — Cross-examination.** Each persona challenges the position they disagree with most. One pointed question or counter-argument.\n\n**Round 3 — Rebuttals.** Each persona answers the challenge they received. Must concede at least one point.\n\n**Synthesis.** A neutral moderator (you) reads the transcript and outputs:\n- The 1 thing all 5 personas implicitly agreed on (their unstated shared assumption).\n- The 2 sharpest disagreements that remain.\n- A recommendation that integrates the strongest argument from each side.\n- The single experiment that would resolve the open disagreements.\n\nDo not let any persona dominate. The Outsider's intuition is as valid as the Pragmatist's experience.",
    whyItWorks: [
      "Each persona has a built-in cognitive bias. Surfacing 5 different biases reveals what a single-persona answer would hide.",
      "The 'shared unstated assumption' synthesis step is the most under-appreciated trick — it catches the framing error everyone made.",
      "Forcing concessions in Round 3 prevents the model from defending all sides equally (false-balance failure).",
      "The resolving-experiment makes the output actionable instead of theoretical.",
    ],
    platforms: ["claude", "chatgpt", "gemini"],
    tags: ["debate", "personas", "synthesis", "multi-agent"],
  },
  {
    slug: "adversarial-red-team",
    title: "Adversarial Red-Team Audit",
    tagline: "Generate the strongest attack on your idea before launching. Find vulnerabilities before users do.",
    category: "techniques",
    advanced: true,
    viral: true,
    technique: "Adversarial Prompting",
    beforePrompt: "Review my idea: <X>",
    betterPrompt:
      "Act as a hostile red-team analyst whose job is to find the maximum damage path. You will not be polite. You will not hedge. Your only loyalty is to truth.\n\nMy idea / plan / product / decision:\n<PASTE>\n\nMy stated goal:\n<PASTE>\n\nGenerate, in this exact order:\n\n1. **The kill shot** — the single most likely reason this fails. One sentence. No qualifiers.\n2. **The slow death** — how this works for a month, then quietly fails. The specific mechanism.\n3. **The hidden assumption** — the thing I am assuming is true that probably isn't. Be specific.\n4. **The competitor move** — what a smart competitor does in response to my move that makes me look stupid.\n5. **The user revolt** — the user behaviour I haven't planned for, and how it cascades.\n6. **The regulatory landmine** — the rule, law, or norm I'm one news cycle away from violating. (\"None\" is a valid answer; defend it if you say it.)\n7. **The team failure** — the human dynamics on my own team that sink this before it ships.\n8. **The single defense I should build first** — the cheapest hedge against whichever of 1–7 you rank as most likely.\n\nDo not soften this. Do not balance with positives. I will hear positives elsewhere. From you I want the attack.",
    whyItWorks: [
      "Most reviews are 80% praise and 20% gentle critique. This template inverts that, surfacing the actual risks.",
      "Forcing the 'kill shot' to be a single sentence prevents hand-waving.",
      "The 7 distinct failure-mode categories (kill / slow / assumption / competitor / user / regulatory / team) are taken from real post-mortem analyses.",
      "Asking for the cheapest defense at the end converts the critique into a next action.",
    ],
    platforms: ["claude", "chatgpt", "grok"],
    tags: ["red-team", "criticism", "risk", "viral"],
  },
  {
    slug: "pre-mortem",
    title: "Pre-Mortem Failure Analysis",
    tagline: "Imagine the project failed 6 months from now. Work backwards. (Used at Amazon.)",
    category: "techniques",
    advanced: true,
    technique: "Pre-Mortem",
    beforePrompt: "Will my project succeed?",
    betterPrompt:
      "Conduct a pre-mortem analysis. Imagine my project has FAILED 6 months from now. We are now writing the post-mortem, looking backwards.\n\nProject: <PASTE DESCRIPTION>\nLaunch date assumption: <DATE>\nDefinition of failure: <e.g. \"<10 paying customers\", \"team disbanded\", \"shipped late and broken\">\n\nWrite the post-mortem from 6 months in the future:\n\n1. **The headline** — one sentence summarizing why we failed.\n2. **Timeline of disaster** — month-by-month, what went wrong:\n   - Month 1: …\n   - Month 2: …\n   - Month 3: …\n   - Month 4: …\n   - Month 5: …\n   - Month 6 (failure recognised): …\n3. **The earliest warning sign we ignored** — the specific moment when we could have caught this.\n4. **The decision that locked the failure in** — the single point of no return.\n5. **Who saw it coming** — which team member or stakeholder, in retrospect, was raising the right concern that we dismissed.\n6. **The cheap intervention we didn't make** — the small action in Month 1 that would have prevented this.\n\nNow snap back to today. The post-mortem above is FICTIONAL but plausible. List the 3 concrete things I should change THIS WEEK to make this exact failure mode less likely.",
    whyItWorks: [
      "Pre-mortems exploit a known psychological asymmetry: humans are vastly better at explaining failure than predicting it.",
      "Forcing a month-by-month timeline catches gradual decay that single-point analysis misses.",
      "'Who saw it coming' surfaces team-dynamics risk that purely strategic analysis misses.",
      "Ending with 'this week' actions turns the exercise from theatre into intervention.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["pre-mortem", "risk", "strategy", "amazon"],
  },
  {
    slug: "first-principles-decomposer",
    title: "First-Principles Decomposer",
    tagline: "Break the problem down to atomic facts. Rebuild from atoms. Catch the assumption everyone missed.",
    category: "techniques",
    advanced: true,
    technique: "First Principles",
    beforePrompt: "Why is <X> hard?",
    betterPrompt:
      "Use first-principles reasoning on this problem. Strip it to atoms before answering.\n\nProblem: <PASTE>\n\nProtocol:\n\n**Stage 1 — Decomposition.** Break the problem into its atomic components. For each component, classify it as:\n- **Fact** (verifiable, not in dispute)\n- **Assumption** (we are treating it as true but could verify)\n- **Belief** (a value judgment or convention, not a fact)\n- **Unknown** (we don't have this info)\n\nList every component. Be ruthless — if something can't be classified, it's probably a fuzzy intuition that needs sharpening.\n\n**Stage 2 — Assumption audit.** Take every Assumption from Stage 1. For each:\n- What evidence supports it?\n- What would falsify it?\n- Is it actually a Belief in disguise?\n\nMark any assumption that fails this audit as **\"NEEDS VERIFICATION\"**.\n\n**Stage 3 — Reconstruction.** Build the answer using only:\n- Facts from Stage 1\n- Verified assumptions\n- Explicitly stated beliefs (with their warrant)\n\nIgnore any \"received wisdom\" that didn't survive Stage 2.\n\n**Stage 4 — The hidden constraint.** State the single unstated rule that everyone tackling this problem accepts without justification. Is it actually a rule? What happens if we discard it?\n\nThis is where first-principles thinking earns its keep.",
    whyItWorks: [
      "The Fact/Assumption/Belief/Unknown classification is a forcing function — it makes you separate things humans constantly confuse.",
      "Assumption audit catches the 'everyone-knows-X' failure that breaks more projects than technical limits.",
      "The 'hidden constraint' question is the one Elon Musk talks about — and the one most prompts never reach.",
      "Ignoring 'received wisdom' is what unlocks counterintuitive answers.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["first-principles", "reasoning", "strategy"],
  },
  {
    slug: "cognitive-bias-audit",
    title: "Cognitive Bias Pre-Decision Audit",
    tagline: "Run your decision through 8 named biases. Catch your own blindspot before you commit.",
    category: "techniques",
    advanced: true,
    technique: "Bias Audit",
    beforePrompt: "Help me decide between X and Y.",
    betterPrompt:
      "Before I make this decision, audit my reasoning for cognitive biases.\n\nMy decision: <DESCRIBE>\nMy current leaning: <A or B>\nMy stated reasons:\n- <REASON 1>\n- <REASON 2>\n- <REASON 3>\n\nRun this decision through each of the 8 biases below. For each:\n- Is this bias present in my reasoning? Y / N / Maybe.\n- If yes/maybe, the specific phrase or reasoning step where it appears.\n- The corrective question I should ask myself.\n\nBiases:\n\n1. **Confirmation bias** — am I weighting evidence that supports my leaning more than evidence against it?\n2. **Anchoring** — has a number / first impression / initial estimate locked in my range?\n3. **Availability** — am I generalising from one memorable recent example?\n4. **Sunk cost** — am I valuing this option because I've already invested in it?\n5. **Status quo bias** — am I picking the safer option by default rather than on merit?\n6. **Optimism bias** — am I assuming the upside hits and the downside doesn't?\n7. **Social proof / authority** — am I leaning this way because of who else does?\n8. **Loss aversion** — am I weighting the loss-from-changing more than the gain-from-changing?\n\nAfter the audit, give me:\n- The 1 bias most likely distorting my judgement.\n- A reframe of the decision that controls for it.\n- The single piece of information that would let me decide cleanly.\n\nDo not soften. The point of this exercise is to find my blindspot.",
    whyItWorks: [
      "Most decision frameworks ignore the human running them. Bias audits center the user as the bug.",
      "Forcing a Y/N/Maybe per bias prevents the model from hedging with 'maybe a little'.",
      "Asking for the corrective question (not just the bias name) makes the audit actionable.",
      "Ending with a reframe + missing-info question converts the audit into a clean next step.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["decision", "bias", "self-audit"],
  },
  {
    slug: "personality-forensics",
    title: "AI Personality Forensics",
    tagline: "Paste 3 of your texts/posts/emails. Get a personality profile so accurate it's uncomfortable.",
    category: "techniques",
    advanced: true,
    viral: true,
    technique: "Stylometric Inference",
    beforePrompt: "What is my personality?",
    betterPrompt:
      "Act as a forensic personality analyst. I will paste 3 writing samples I produced under different conditions. Read for signal, not content.\n\nSample 1 (recent message to a friend):\n<PASTE>\n\nSample 2 (recent professional email or post):\n<PASTE>\n\nSample 3 (an opinion or rant I wrote when I was annoyed):\n<PASTE>\n\nProtocol — do NOT analyse what I said, analyse HOW I say things.\n\nLook for:\n- Sentence length distribution and rhythm.\n- Use of qualifiers, hedges, intensifiers.\n- Specificity vs. abstraction.\n- Where I cluster nouns vs. verbs.\n- How I handle disagreement (avoidance, engagement, deflection).\n- What I leave UNSAID — what someone with my topic would normally mention but I skip.\n\nOutput, in this exact structure:\n\n1. **Three things I clearly care about** (inferred from emphasis, not content).\n2. **Three things I quietly worry about** (inferred from hedges, qualifications, what gets re-stated).\n3. **My communication style in one sentence.**\n4. **What I optimise for** — speed / clarity / being liked / being right / control / connection — pick the top 2 with the evidence.\n5. **The personality trait I broadcast vs. the one I actually have** — if there's a gap, name it.\n6. **The job / role I'd thrive in based on this signal** (not based on what I said).\n7. **The single sentence that gave you the most signal.**\n\nBe specific. Generic horoscope-style readings are a failure of this prompt — quote my actual words as evidence.",
    whyItWorks: [
      "Reading for HOW vs. what is the actual skill of personality inference — and what makes the output feel uncomfortably accurate.",
      "Three samples across contexts (friend/professional/annoyed) triangulate signal that a single sample can't.",
      "The 'broadcast vs. actual' gap question is the one no horoscope reveals.",
      "Forcing the model to quote evidence kills generic 'you are creative and ambitious' output.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["personality", "viral", "forensics", "shareable"],
  },
  {
    slug: "algorithm-whisperer",
    title: "Algorithm Whisperer",
    tagline: "Will this post go viral? Decode why the algorithm shows or hides it. (TikTok, Twitter, LinkedIn, Reels.)",
    category: "techniques",
    advanced: true,
    viral: true,
    technique: "Adversarial Reverse-Engineering",
    beforePrompt: "Will this post get reach?",
    betterPrompt:
      "Act as a senior algorithmic-recommender engineer who has shipped ranking systems. Reverse-engineer how the algorithm will treat my post.\n\nPlatform: <TIKTOK / TWITTER-X / LINKEDIN / INSTAGRAM-REELS / YOUTUBE-SHORTS>\nMy account stats (approx): <FOLLOWERS, AVG VIEWS, AVG ENGAGEMENT RATE>\nMy niche / what the algorithm has historically classified me as: <DESCRIBE>\nPost / draft:\n<PASTE FULL TEXT + DESCRIBE VISUALS / VIDEO IF APPLICABLE>\n\nAnalyse, in this order:\n\n1. **Signals the algorithm will read in the first 3 seconds / first 50 chars** — be specific about which features.\n2. **The implicit topic cluster** the algorithm will assign this to — and whether it matches my historical cluster (cluster drift = ranking penalty on most platforms).\n3. **Engagement-rate prediction**: above / at / below my baseline. Reason in one sentence.\n4. **The single biggest \"hold-time\" risk** — the moment a viewer is most likely to bounce.\n5. **The viral-trigger probability** — pick one: (a) high, has a sharable mechanic; (b) medium, niche resonance; (c) low, professionally fine but algorithmically average. Defend the rating.\n6. **The 3 specific edits** I should make to maximise reach without changing the message:\n   - Edit 1: <what + why>\n   - Edit 2: <what + why>\n   - Edit 3: <what + why>\n7. **The thing I should NOT change**, even though it looks risky — and why removing it would hurt more than help.\n\nDo not flatter the post. If it's going to underperform, say so plainly and tell me whether to ship it anyway.",
    whyItWorks: [
      "Algorithmic ranking is a real engineering domain — naming the engineer's role triggers more accurate analysis.",
      "Per-platform specificity is critical: TikTok / Twitter / LinkedIn algorithms have different feature weights, and conflating them produces useless advice.",
      "The 'thing I should NOT change' question prevents over-editing posts into algorithmic mush.",
      "Asking for hold-time risk catches the 'great post, bad opening' pattern.",
      "Above/at/below baseline framing produces a calibrated prediction instead of generic praise.",
    ],
    platforms: ["claude", "chatgpt", "grok"],
    tags: ["algorithm", "viral", "social", "growth"],
  },

  // LEARNING
  {
    slug: "explain-like-im-5",
    title: "Explain Like I'm 5",
    tagline: "Take any complex topic, get a kid-friendly explanation that actually sticks.",
    category: "learning",
    beforePrompt: "Explain quantum physics",
    betterPrompt:
      "Act as a science teacher for curious 5-year-olds.\n\nExplain quantum physics in 4 short paragraphs, using:\n- everyday analogies (toys, food, animals)\n- no jargon — if you must use a term, define it inline\n- one surprising fact a kid would find cool\n\nEnd with one question I could ask to learn more.",
    whyItWorks: [
      "Sets a specific role (\"science teacher for 5-year-olds\") so the model knows the register.",
      "Constrains the output (4 paragraphs) so it's not a wall of text.",
      "Specifies the style (analogies, no jargon) so it's actually understandable.",
      "Ends with a follow-up hook to extend the conversation.",
    ],
    platforms: ["chatgpt", "claude", "gemini", "grok"],
    tags: ["education", "kids", "explain", "ELI5"],
  },
  {
    slug: "step-by-step-math-solver",
    title: "Step-by-Step Math Solver",
    tagline: "Get math help that teaches the method, not just the answer.",
    category: "learning",
    beforePrompt: "Solve this algebra problem: 3x + 7 = 22",
    betterPrompt:
      "Act as a patient algebra tutor.\n\nI need to solve: 3x + 7 = 22\n\nFor each step:\n1. State the goal of that step (e.g. \"isolate the variable\")\n2. Show the math\n3. Explain WHY in one sentence\n\nDo NOT skip any steps, even obvious ones. End with a one-line summary of the technique used so I can apply it to similar problems.",
    whyItWorks: [
      "Forces a teaching mindset, not a calculator response.",
      "Numbered structure makes each step easy to follow.",
      "The 'why' in each step turns the answer into a transferable skill.",
    ],
    platforms: ["chatgpt", "claude", "gemini"],
    tags: ["math", "algebra", "tutor", "study"],
  },
  {
    slug: "language-conversation-partner",
    title: "Language Conversation Partner",
    tagline: "Practice a language with a patient friend who corrects you naturally.",
    category: "learning",
    beforePrompt: "Help me learn Spanish",
    betterPrompt:
      "You are a friendly Spanish conversation partner. My level: A2 (intermediate beginner).\n\nRules for our chat:\n- Reply ONLY in Spanish, except when correcting me.\n- After each of my messages, before your reply, add a short note in English: \"Correction: <what I said wrong, with the fix>\" or \"All good!\".\n- Keep your replies to 2–3 sentences so I can keep up.\n- Use the topic: ordering food at a restaurant.\n\nStart by greeting me and asking what kind of restaurant I'd like to visit.",
    whyItWorks: [
      "Sets the level so vocabulary is appropriate.",
      "Gives a clear rule for corrections — turns chat into structured practice.",
      "Caps reply length so the user isn't overwhelmed.",
      "Provides a scenario so the conversation doesn't stall.",
    ],
    platforms: ["chatgpt", "claude", "gemini"],
    tags: ["language", "spanish", "speaking", "tutor"],
  },

  // CODING
  {
    slug: "debug-my-code",
    title: "Debug My Code",
    tagline: "Get a root-cause analysis, not just a patch.",
    category: "coding",
    beforePrompt: "fix this bug:\n\n<paste code>",
    betterPrompt:
      "Act as a senior engineer doing a code review.\n\nHere's code that's misbehaving (description: <DESCRIBE BEHAVIOR — what you expected vs. what you got>):\n\n```<lang>\n<paste code>\n```\n\nDo NOT immediately write the fix. First:\n1. Identify the root cause in one short sentence.\n2. Explain why this bug surfaces (the underlying mechanism).\n3. List any other places in the code where the same kind of bug could exist.\n4. THEN suggest the minimal fix.\n\nIf you need more context to be sure, ask before guessing.",
    whyItWorks: [
      "Stops the model from jumping to a 'fix' that just masks the bug.",
      "Asks for the underlying mechanism — that's where real engineering value comes from.",
      "The 'other places' check generalises the lesson.",
      "Permission to ask for context prevents hallucinated fixes.",
    ],
    platforms: ["claude", "chatgpt", "cursor", "copilot"],
    tags: ["debug", "code review", "root cause"],
  },
  {
    slug: "refactor-legacy-code",
    title: "Refactor Legacy Code",
    tagline: "Improve readability without secretly changing behavior.",
    category: "coding",
    beforePrompt: "refactor this code",
    betterPrompt:
      "Act as a staff engineer. Refactor the following code for readability and maintainability, with the following hard constraints:\n\n- Preserve the exact public API — no rename or signature change.\n- Preserve runtime behaviour — no functional changes.\n- Do not introduce new dependencies.\n- Add comments only where the WHY is non-obvious; never repeat the code in English.\n\nFor each change you make, list it in a short bulleted summary at the top with one-line justification.\n\nCode:\n```<lang>\n<paste code>\n```",
    whyItWorks: [
      "Hard constraints prevent the model from 'helpfully' breaking things.",
      "The change summary at the top gives you a diff-free way to review intent.",
      "Comment rule prevents over-commenting noise.",
    ],
    platforms: ["claude", "chatgpt", "cursor"],
    tags: ["refactor", "code quality"],
  },
  {
    slug: "regex-generator",
    title: "Regex Generator",
    tagline: "Get a regex with explanation, edge cases, and a test plan.",
    category: "coding",
    beforePrompt: "give me a regex for emails",
    betterPrompt:
      "Generate a regex that matches: <DESCRIBE PRECISELY — e.g. \"US phone numbers in (xxx) xxx-xxxx format only\">.\n\nDeliver:\n1. The regex, in <FLAVOR — JS/Python/Go/PCRE> syntax.\n2. A one-line plain-English description.\n3. A breakdown of each group/character class.\n4. 5 strings that should match.\n5. 5 strings that look similar but should NOT match (and why).\n\nIf my requirement is ambiguous, list the ambiguities before giving the regex.",
    whyItWorks: [
      "Forces the model to enumerate edge cases — most regex bugs live in the 'should NOT match' set.",
      "Explicit flavor avoids subtle regex-engine differences.",
      "The breakdown teaches you, not just solves the problem.",
    ],
    platforms: ["claude", "chatgpt", "cursor"],
    tags: ["regex", "validation"],
  },

  // PRODUCTIVITY
  {
    slug: "daily-planner",
    title: "Daily Planner",
    tagline: "Convert a chaotic todo list into a realistic day.",
    category: "productivity",
    beforePrompt: "make a schedule for my day",
    betterPrompt:
      "Act as a focused productivity coach who respects deep work.\n\nMy day: <START_TIME> to <END_TIME>.\nMy energy peaks: <e.g. morning>.\nTasks for today:\n- <TASK 1> — est. <X> min — priority <high/med/low>\n- <TASK 2> — est. <X> min — priority <high/med/low>\n- <TASK 3> — ...\n\nBuild a time-blocked schedule with these rules:\n- Hardest / highest-priority work goes in my energy peak.\n- 5-min buffer between blocks.\n- One 30-min unscheduled block as a slack buffer.\n- Output as a markdown table: time | block | task.\n\nAt the end, list anything you'd cut if I lose 90 minutes.",
    whyItWorks: [
      "Personalises around the user's energy curve — beats a generic schedule.",
      "Asks for priorities so the cut list at the end actually makes sense.",
      "Built-in buffer slot makes the plan survive contact with reality.",
    ],
    platforms: ["chatgpt", "claude", "gemini"],
    tags: ["schedule", "time blocking", "planning"],
  },
  {
    slug: "professional-email-writer",
    title: "Professional Email Writer",
    tagline: "Replies that are clear, polite, and human — not corporate slop.",
    category: "productivity",
    beforePrompt: "write a reply to this email:\n<paste>",
    betterPrompt:
      "Write a reply to the email below.\n\nTone: <warm but direct / firm / apologetic / etc.>\nMy goal: <e.g. push the meeting to next week without burning the relationship>.\nLength: under 120 words.\nFormat: plain text, no markdown.\n\nRules:\n- No filler phrases like \"I hope this finds you well\".\n- One clear ask if there is one — at the end.\n- Sound like a person, not a customer-service bot.\n\nEmail:\n<paste original>",
    whyItWorks: [
      "Tone + goal + length = no guessing for the model.",
      "Explicit anti-patterns (\"no filler\") eliminate corporate slop.",
      "Single clear ask at the end maximises response rate.",
    ],
    platforms: ["chatgpt", "claude"],
    tags: ["email", "writing", "communication"],
  },
  {
    slug: "decision-maker",
    title: "Decision Maker",
    tagline: "Compare options without the model just agreeing with you.",
    category: "productivity",
    advanced: true,
    beforePrompt: "should I take this job?",
    betterPrompt:
      "Help me decide between these options. Your job is to push back where I'm being lazy, not just validate me.\n\nDecision: <STATE THE DECISION>.\nMy gut leaning: <A or B>.\n\nOption A: <describe — pros and cons as you see them>\nOption B: <describe — pros and cons as you see them>\n\nDo this:\n1. List 3 things I'm probably underweighting.\n2. List 3 things I'm probably overweighting.\n3. Ask 2 questions that would change your answer.\n4. THEN give your recommendation and your confidence (low/med/high).\n\nDo not flatter me.",
    whyItWorks: [
      "Explicit anti-sycophancy instruction — without it, most models just agree.",
      "Asks the model to model YOUR blind spots, not just the abstract pros/cons.",
      "Returning with questions is honest — it reveals what's actually decision-critical.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["decision", "thinking", "advisor"],
  },

  // BUSINESS
  {
    slug: "startup-idea-validator",
    title: "Startup Idea Validator",
    tagline: "Pressure-test an idea before you build it.",
    category: "business",
    advanced: true,
    beforePrompt: "is this a good startup idea: <idea>",
    betterPrompt:
      "Act as a skeptical seed-stage investor. I am pitching you the following idea. Do NOT be encouraging — be useful.\n\nIdea: <DESCRIBE IDEA in 2–3 sentences>\nTarget customer: <WHO>\nWhy now: <WHY THIS WORKS NOW>\n\nReply with:\n1. The strongest reason this could be a $100M business.\n2. The 3 most likely reasons it dies in year 1.\n3. The single experiment I should run this week to learn the most for the least money.\n4. Comparable startups (alive or dead) and what we should learn from each.\n5. A score 1–10 on whether you'd take a meeting, with one-line reason.",
    whyItWorks: [
      "Explicit 'do not be encouraging' breaks the model's default flattery.",
      "Forces an actionable next step (the experiment), not just analysis.",
      "Comparables ground the answer in reality, not hype.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["startup", "validation", "investor"],
  },
  {
    slug: "landing-page-copy",
    title: "SaaS Landing Page Copy",
    tagline: "Hero copy that explains what you sell in one breath.",
    category: "business",
    beforePrompt: "write landing page copy for my SaaS",
    betterPrompt:
      "Act as a B2B SaaS copywriter who's allergic to buzzwords.\n\nProduct: <ONE-SENTENCE WHAT IT DOES>\nWho it's for: <ROLE / COMPANY SIZE>\nTop 3 problems we solve: <P1> / <P2> / <P3>\nWhat competitors do badly: <ONE LINE>\n\nWrite:\n1. A 6-word headline.\n2. A 1-sentence subheadline (under 20 words).\n3. A 3-bullet \"what you get\" list (each bullet starts with a verb).\n4. A primary CTA button label (under 4 words).\n\nNo \"revolutionize\", \"empower\", \"seamless\", \"cutting-edge\", or \"AI-powered\".\nNo emojis. No exclamation marks.",
    whyItWorks: [
      "Banned-words list kills lazy buzzword copy.",
      "Tight word counts force clarity.",
      "Customer-problem framing produces copy that sells, not describes.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["landing page", "copywriting", "saas"],
  },
  {
    slug: "cold-outreach-email",
    title: "Cold Outreach Email",
    tagline: "An email that actually gets a reply.",
    category: "business",
    beforePrompt: "write a cold sales email to <person>",
    betterPrompt:
      "Write a cold outreach email. Goal: get a 20-minute intro call, not close a sale.\n\nAbout me: <ONE LINE WHO I AM + COMPANY>\nWhat we do: <ONE LINE>\nWhy I'm reaching out to THIS person specifically: <SPECIFIC OBSERVATION about them or their company>\nWhat's in it for them: <ONE LINE>\n\nRules:\n- Subject line under 6 words.\n- Body under 90 words.\n- No \"I hope this email finds you well\".\n- No links, no attachments.\n- Open with the specific observation, not me.\n- End with ONE soft yes/no question.\n\nReturn: subject + body, nothing else.",
    whyItWorks: [
      "Specific observation as the opener is the only honest reason to cold-email.",
      "Hard word cap mirrors what executives actually read.",
      "Soft yes/no ask removes friction from replying.",
    ],
    platforms: ["chatgpt", "claude"],
    tags: ["sales", "outreach", "email"],
  },

  // CONTENT
  {
    slug: "viral-hook-generator",
    title: "Viral Hook Generator",
    tagline: "10 first-line options for short-form video.",
    category: "content",
    beforePrompt: "give me hooks for my video about X",
    betterPrompt:
      "Generate 10 first-line hooks for a short-form video.\n\nTopic: <TOPIC>\nAudience: <WHO they are and what they care about>\nThe one insight viewers will leave with: <INSIGHT>\nPlatform: <TikTok / Reels / Shorts>\n\nFor each hook:\n- Max 10 words.\n- Either a contrarian claim, a curiosity gap, or a specific number.\n- Must imply the insight without spoiling it.\n- No emojis. No \"in this video\". No \"let me tell you\".\n\nFormat: numbered list. After each hook, add a one-line note on which mechanic it uses (contrarian / curiosity / specificity).",
    whyItWorks: [
      "10 options gives you a real spread to pick from.",
      "Three mechanic types prevent the model from giving you 10 of the same.",
      "Banned phrases kill cliché openers.",
    ],
    platforms: ["chatgpt", "claude", "grok"],
    tags: ["video", "social", "hook", "viral"],
  },
  {
    slug: "tweet-rewriter",
    title: "Tweet Rewriter",
    tagline: "Take a mediocre tweet and make it shareable.",
    category: "content",
    beforePrompt: "make this tweet better:\n<tweet>",
    betterPrompt:
      "Rewrite this tweet to maximise meaningful engagement (replies, not just likes).\n\nOriginal: <PASTE TWEET>\n\nDeliver 4 variants:\n1. Sharper / more specific — tighten language, add a concrete number or example.\n2. Contrarian — flip the framing.\n3. Story-led — start with a one-line scene.\n4. Question-led — end with a question that begs a reply.\n\nRules: under 240 chars each. No emojis. No hashtags. No threads. Plain text.\n\nFor each, add a 1-line note on who the audience for THAT version is.",
    whyItWorks: [
      "Four variants force the model to explore mechanics, not regurgitate.",
      "\"Replies, not likes\" goal aligns with actual reach.",
      "Audience note helps you pick the right one for your followers.",
    ],
    platforms: ["chatgpt", "claude", "grok"],
    tags: ["twitter", "social", "rewrite"],
  },
  {
    slug: "youtube-script-writer",
    title: "YouTube Script Writer",
    tagline: "8-minute video script with retention beats baked in.",
    category: "content",
    beforePrompt: "write me a youtube script about X",
    betterPrompt:
      "Write a YouTube script for an 8-minute video. Audience watches at 1.5x speed and is hostile to filler.\n\nTopic: <TOPIC>\nThe one thing viewers will know by the end: <THE INSIGHT>\nMy on-camera style: <CONVERSATIONAL / TEACHY / DEADPAN / etc.>\n\nStructure:\n- 0:00–0:15  Hook + the promise (no \"in this video we will...\")\n- 0:15–0:45  Why this matters in their life — one specific scene\n- 0:45–6:00  3–4 chapters delivering the insight, each ending with a payoff\n- 6:00–7:30  The contrarian take or counterargument\n- 7:30–8:00  Concrete next action + soft CTA\n\nWrite as spoken word, in my voice. Mark [VISUAL] cues inline.\n\nAdd a list of 5 thumbnail-text options after the script.",
    whyItWorks: [
      "Timestamps with explicit beats force retention-focused structure.",
      "\"Spoken word\" mode kills LinkedIn-style writing.",
      "Thumbnail options are usually the bottleneck — solving them in the same prompt saves a round trip.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["youtube", "script", "video"],
  },

  // RELATIONSHIPS
  {
    slug: "difficult-conversation-helper",
    title: "Difficult Conversation Helper",
    tagline: "Plan a hard talk without sounding like a script.",
    category: "relationships",
    beforePrompt: "help me talk to my partner about <issue>",
    betterPrompt:
      "Act as a thoughtful friend, not a therapist. I'm planning a difficult conversation.\n\nWho with: <PERSON + relationship to me>\nThe issue: <ONE LINE>\nWhat I want from the conversation: <THE OUTCOME, not the venting>\nWhat I'm worried about: <THE SPECIFIC FEAR>\n\nHelp me prepare:\n1. One sentence I could open with that names the issue without blame.\n2. The 2 most likely defensive reactions and a calm response to each.\n3. A question I should ask them to understand THEIR side before defending mine.\n4. One concrete thing I should NOT say, however tempting.\n5. A graceful exit line if it goes sideways.\n\nKeep it human. No therapy-speak (\"I-statements\", \"hold space\", etc.).",
    whyItWorks: [
      "Outcome-focused (\"what I want\") prevents drift into venting.",
      "Defensive-reactions section is the rehearsal most people skip.",
      "Banning therapy-speak keeps language realistic.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["relationships", "communication", "conflict"],
  },
  {
    slug: "apology-message",
    title: "Sincere Apology Message",
    tagline: "An apology that doesn't smell of ChatGPT.",
    category: "relationships",
    beforePrompt: "write an apology to my friend",
    betterPrompt:
      "Help me draft an apology message.\n\nWho I'm apologising to: <RELATIONSHIP>\nWhat I did: <SPECIFIC ACTION, plainly>\nWhy it was wrong: <THE IMPACT ON THEM, in their words>\nWhat I'm going to do differently: <CONCRETE BEHAVIOR change>\n\nRules:\n- Acknowledge the impact before the intent.\n- No \"I'm sorry IF\" or \"I'm sorry BUT\".\n- No paragraph of self-justification.\n- Sound like me texting them — short, plain, not formal.\n- Under 80 words.\n\nDo not ask them for forgiveness. Leave that to them.",
    whyItWorks: [
      "Banning 'if' / 'but' kills non-apologies.",
      "\"Impact before intent\" is the actual difference between a real apology and a fake one.",
      "Removing the forgiveness ask shows respect.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["apology", "relationships", "message"],
  },

  // HEALTH
  {
    slug: "anxiety-calmer",
    title: "Anxiety Calmer",
    tagline: "Talk yourself down without toxic positivity.",
    category: "health",
    beforePrompt: "I'm anxious about <X>",
    betterPrompt:
      "I'm feeling anxious about: <SPECIFIC WORRY>.\n\nDo NOT do these things:\n- Tell me to \"breathe\" or \"meditate\".\n- List 10 grounding techniques.\n- Be relentlessly positive.\n- Recommend a professional unless this sounds like a crisis.\n\nDo this:\n1. Reflect what you're hearing in 2 sentences so I feel understood.\n2. Ask me ONE clarifying question.\n3. Help me separate what I can control from what I can't — concretely, in this situation.\n4. Suggest one small action I could take in the next 10 minutes — physical, not mental.\n5. End with one sentence putting this in perspective without minimising it.",
    whyItWorks: [
      "Banning generic wellness advice prevents the model from going onto autopilot.",
      "The control / no-control sort is the actual cognitive move that reduces anxiety.",
      "A 10-minute physical action interrupts rumination loops.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["anxiety", "mental health", "support"],
  },
  {
    slug: "fitness-planner",
    title: "Fitness Plan Builder",
    tagline: "A realistic plan you'll actually follow.",
    category: "health",
    beforePrompt: "make me a workout plan",
    betterPrompt:
      "Build me a 4-week strength training plan.\n\nMe: <AGE>, <CURRENT FITNESS — beginner/intermediate/advanced>, <ANY INJURIES>.\nGoal: <1 line — e.g. \"build noticeable muscle\" or \"get stronger without the gym\">.\nEquipment: <home dumbbells / full gym / bodyweight only>.\nTime per session: <MINUTES>.\nDays per week: <NUMBER>.\n\nFor each week:\n- List exercises in a table: name | sets × reps | rest | one-line form cue\n- Mark which days are which muscle groups\n- Include 1 deload week if the plan is 4+ weeks\n\nRules:\n- Compound lifts before isolation.\n- No more than 4 exercises per session.\n- Tell me ONE measurable thing I should track week-to-week.\n- If anything in my profile is unsafe (e.g. injury + heavy compound), flag it.",
    whyItWorks: [
      "Time + equipment constraints make the plan realistic, not aspirational.",
      "Form cues prevent injury when the user is reading without a trainer.",
      "One tracked metric keeps motivation high.",
      "Safety flag check catches the obvious mistakes.",
    ],
    platforms: ["chatgpt", "claude", "gemini"],
    tags: ["fitness", "workout", "strength"],
  },

  // FUN
  {
    slug: "ai-dungeon-master",
    title: "AI Dungeon Master",
    tagline: "Run a short solo D&D session.",
    category: "fun",
    beforePrompt: "let's play D&D",
    betterPrompt:
      "Run a short solo D&D-style adventure with me.\n\nMy character: <NAME, CLASS, ONE-LINE BACKSTORY>.\nVibe: <e.g. \"low fantasy, morally grey, dry humor\">.\nSession length: <NUMBER> turns total.\n\nRules of play:\n- You describe the scene in 3–6 sentences.\n- End each scene with: \"What do you do?\"\n- Resolve actions with a clear, simple d20 roll — tell me the DC.\n- Track my HP and one resource (mana / arrows / etc.) at the end of each turn.\n- If I try something stupid, let it fail — funny is better than fair.\n\nStart with the inciting incident, not a backstory dump.",
    whyItWorks: [
      "Vibe + length up front sets expectations.",
      "Simple d20 resolution avoids the model inventing inconsistent systems.",
      "HP / resource tracking gives stakes.",
      "\"Let stupid fail\" makes the game funny instead of bland.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["roleplay", "dnd", "games"],
  },
  {
    slug: "roast-my-resume",
    title: "Roast My Resume",
    tagline: "A friendly, useful roast of your CV.",
    category: "fun",
    viral: true,
    beforePrompt: "review my resume:\n<paste>",
    betterPrompt:
      "Roast my resume like a hiring manager who's mildly amused but actually wants to help.\n\nResume:\n<PASTE>\n\nTarget role: <ROLE>\nTone: dry, observational, no insults about the person.\n\nDo this:\n1. ONE devastating one-liner about the resume's biggest weakness.\n2. The 3 phrases that sound like everyone else's resume — replace each.\n3. The thing on this resume I should be LEADING with but buried.\n4. The single edit that would most improve callback rate.\n5. End with one genuine compliment.",
    whyItWorks: [
      "Roast framing breaks polite filler — you actually learn something.",
      "Specific instructions (the buried thing, the cliché phrases) give actionable edits, not 'fluff is bad'.",
      "Compliment at the end keeps it usable feedback, not just funny.",
    ],
    platforms: ["claude", "chatgpt", "grok"],
    tags: ["resume", "career", "fun"],
  },

  // === Added in Phase 2 ===

  // LEARNING
  {
    slug: "quiz-me-until-i-master-it",
    title: "Quiz Me Until I Master It",
    tagline: "AI tutor that drills you until weak spots disappear.",
    category: "learning",
    beforePrompt: "quiz me on <topic>",
    betterPrompt:
      "Act as an exam coach. Quiz me on: <TOPIC>. My level: <BEGINNER / INTERMEDIATE / ADVANCED>.\n\nRules of play:\n- Ask ONE question at a time, then wait for my answer.\n- After each answer, score it (correct / partially correct / wrong) and explain in 1–2 sentences.\n- Track a running mental list of my weak sub-topics. Re-ask similar questions until I get them right 2× in a row.\n- Mix question types: definition, application, edge case, tricky multiple-choice.\n- After every 5 questions, give a 2-line progress summary and the topics I still need to drill.\n\nStart with a difficulty calibration question.",
    whyItWorks: [
      "Spaced repetition on YOUR weak spots beats a flat quiz.",
      "One question at a time matches how humans actually learn.",
      "Difficulty calibration tunes the rest of the session to your real level.",
    ],
    platforms: ["claude", "chatgpt", "gemini"],
    tags: ["study", "quiz", "exam", "tutor"],
  },
  {
    slug: "exam-revision-generator",
    title: "Exam Revision Generator",
    tagline: "Turn a syllabus into a tight, time-boxed revision plan.",
    category: "learning",
    beforePrompt: "help me revise for my exam",
    betterPrompt:
      "Build me a revision plan.\n\nExam: <EXAM NAME, DATE>\nTime I have: <NUMBER> days × <HOURS> per day\nTopics covered (paste syllabus): <PASTE>\nMy strongest 2 topics: <X, Y>\nMy weakest 2 topics: <P, Q>\n\nGive me:\n1. A day-by-day plan in a markdown table: day | topic | sub-topic | minutes | type (read/quiz/practice)\n2. Weakest topics scheduled twice — once early, once near the end.\n3. A 1-page cheat-sheet outline I should make for the most question-heavy topics.\n4. The single highest-yield topic I should NOT skip.\n\nKeep the daily total within my available time. Don't over-schedule.",
    whyItWorks: [
      "Weak-topic double-pass matches retention research.",
      "Time-boxed schedule respects reality, not aspiration.",
      "Cheat-sheet outline + highest-yield call-out gives the panic-day plan.",
    ],
    platforms: ["chatgpt", "claude", "gemini"],
    tags: ["exam", "study", "revision"],
  },

  // CODING
  {
    slug: "explain-stack-trace",
    title: "Explain This Stack Trace",
    tagline: "Decode a stack trace into the actual bug, in plain English.",
    category: "coding",
    beforePrompt: "explain this error:\n<paste>",
    betterPrompt:
      "Act as a senior engineer debugging with me.\n\nStack/error trace:\n```\n<PASTE>\n```\n\nLanguage / framework: <e.g. Node 20, Next.js 14>\nWhat I was doing when it happened: <ACTION>\n\nDo this in order:\n1. Translate the trace into ONE plain-English sentence: \"You're trying to X but Y.\"\n2. The likely root cause (not just the symptom).\n3. The 2 lines I should look at first, and what to check in each.\n4. The most common reason this exact error happens in this framework.\n5. A minimal repro I can try in isolation to confirm.\n\nIf the trace isn't enough to diagnose, tell me exactly what extra context you need.",
    whyItWorks: [
      "Forces the model to separate symptom from cause.",
      "Pointing at the 2 most-suspicious lines is the actual debugging skill.",
      "Permission to ask for context kills hallucinated answers.",
    ],
    platforms: ["claude", "chatgpt", "cursor", "copilot"],
    tags: ["debug", "stack trace", "error"],
  },
  {
    slug: "sql-query-optimizer",
    title: "SQL Query Optimizer",
    tagline: "Make a slow query fast — with the reasoning shown.",
    category: "coding",
    beforePrompt: "optimize this SQL:\n<paste>",
    betterPrompt:
      "Act as a database engineer. Optimize this query.\n\nQuery:\n```sql\n<PASTE>\n```\n\nDB engine + version: <e.g. Postgres 15>\nTable size (approx rows): <e.g. users ~50M, orders ~200M>\nCurrent execution time: <MS or unknown>\nWhat the query is supposed to return: <PLAIN ENGLISH>\n\nDeliver:\n1. The optimized query.\n2. A bullet list of EVERY change you made, with one-line reason each.\n3. Any indexes I should add (CREATE INDEX statements).\n4. The expected complexity / cost change (e.g. \"seq scan → index scan, O(N) → O(log N)\").\n5. Anything that depends on assumptions you can't verify — list those explicitly.",
    whyItWorks: [
      "Schema and engine info change the right answer drastically — required up front.",
      "Per-change reasoning lets you spot a wrong assumption fast.",
      "Index CREATE statements are the highest-leverage line in the answer.",
    ],
    platforms: ["claude", "chatgpt", "cursor"],
    tags: ["sql", "database", "performance"],
  },
  {
    slug: "api-documentation-generator",
    title: "API Documentation Generator",
    tagline: "Turn raw code into clean, copy-paste-ready API docs.",
    category: "coding",
    beforePrompt: "document this api",
    betterPrompt:
      "Generate API documentation for the following endpoint(s).\n\nCode:\n```<lang>\n<PASTE>\n```\n\nOutput format: Markdown with these sections for EACH endpoint:\n1. **Method + path** (one line)\n2. **What it does** (one sentence, plain English)\n3. **Auth** required (yes/no, type)\n4. **Request** — params/body, with example JSON and which fields are required.\n5. **Response** — example 200 body, example error responses with status codes.\n6. **Edge cases** — anything that returns differently than you'd expect.\n7. **Example curl** — copy-paste runnable.\n\nIf there's behavior you can't infer from the code (rate limits, side effects), list it under \"Assumptions to verify\".",
    whyItWorks: [
      "Sectioned output makes it useful as actual docs, not just a paragraph.",
      "Runnable curl is the single thing API consumers want most.",
      "Explicit assumptions section makes the doc safe to publish.",
    ],
    platforms: ["claude", "chatgpt", "cursor"],
    tags: ["api", "documentation"],
  },

  // PRODUCTIVITY
  {
    slug: "meeting-summarizer",
    title: "Meeting Summarizer",
    tagline: "Turn a meeting transcript into an action-first summary.",
    category: "productivity",
    beforePrompt: "summarize this meeting:\n<paste>",
    betterPrompt:
      "Summarize this meeting. The reader will not have time to read the transcript.\n\nTranscript:\n<PASTE>\n\nDeliver, in this exact order:\n1. **Decisions made** — bullet list, each one sentence.\n2. **Action items** — table: owner | action | due date (use \"?\" if not stated).\n3. **Open questions / things we punted** — bullet list.\n4. **One-paragraph context** (so a new reader understands what the meeting was about).\n\nKeep names anonymous if the transcript has full names — use initials only.\nDo NOT include a generic 'here is what was discussed' wrap-up.",
    whyItWorks: [
      "Decisions and actions first matches what readers actually need.",
      "Initials-only is a sensible privacy default.",
      "Banning generic wrap-up prevents fluff at the bottom.",
    ],
    platforms: ["claude", "chatgpt", "gemini"],
    tags: ["meeting", "summary", "notes"],
  },
  {
    slug: "linkedin-post-writer",
    title: "LinkedIn Post Writer",
    tagline: "Write a LinkedIn post that doesn't sound like LinkedIn.",
    category: "productivity",
    beforePrompt: "write a linkedin post about <topic>",
    betterPrompt:
      "Write a LinkedIn post.\n\nTopic: <TOPIC>\nThe one insight readers should take away: <THE INSIGHT>\nMy voice: <e.g. direct, dry, builder-mode — not motivational-speaker>\nLength: 5–8 short lines.\n\nRules:\n- Open with a specific scene, number, or contrarian claim. NOT a question.\n- One short line per idea — generous whitespace.\n- No emojis. No #hashtags. No \"thoughts?\" at the end.\n- End with the insight stated plainly, not as a moral.\n- Don't write like a LinkedIn coach. Write like a person.\n\nThen give 3 alternative opening lines I could swap in.",
    whyItWorks: [
      "Banned-patterns list kills the worst LinkedIn tropes.",
      "Three opening-line variants let you A/B without re-prompting.",
      "Specific scene/number opener consistently outperforms the rhetorical-question opener.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["linkedin", "writing", "social"],
  },

  // BUSINESS
  {
    slug: "high-ctr-headlines",
    title: "High-CTR Headlines",
    tagline: "10 headline options for an ad, post, or article.",
    category: "business",
    beforePrompt: "give me 10 headlines for <topic>",
    betterPrompt:
      "Generate 10 headlines.\n\nProduct / topic: <ONE-LINE WHAT IT IS>\nReader: <WHO they are, what they care about>\nThe single thing readers will get: <THE PROMISE>\nChannel: <e.g. Google ad, Twitter, blog SEO>\n\nRules:\n- Max 9 words per headline.\n- Each headline uses ONE of these mechanics — label which: contrarian claim, specific number, identity hook (\"For X\"), curiosity gap, problem statement, before-after.\n- No emojis. No clickbait that doesn't deliver. No \"the ultimate guide to\".\n- After the list, mark the top 3 you'd ship and why in one short line each.",
    whyItWorks: [
      "Mechanic labels force variety — 10 distinct angles, not 10 reworded variants.",
      "Self-pick of top 3 saves a round trip.",
      "Word cap mirrors actual ad real estate.",
    ],
    platforms: ["chatgpt", "claude"],
    tags: ["headlines", "copywriting", "marketing"],
  },
  {
    slug: "customer-persona-builder",
    title: "Customer Persona Builder",
    tagline: "A persona document that's actually useful for product decisions.",
    category: "business",
    beforePrompt: "create a customer persona for <product>",
    betterPrompt:
      "Build a customer persona for: <PRODUCT / SERVICE>\nTarget segment: <SPECIFIC SEGMENT, not 'small businesses'>\n\nDeliver, in this order:\n1. **One-line summary** (\"<role> who <pain> and <goal>\")\n2. **A day in their life** — 4 short bullets, time-stamped.\n3. **Top 3 pains** — each with a verbatim quote they'd actually say.\n4. **What they've tried before us** — and why it didn't work.\n5. **What they read / who they trust** — channels and voices, specific.\n6. **The trigger event** — what makes them search for a solution this week.\n7. **The objection that kills the deal** — and how we'd answer it.\n\nUse only details that would be plausibly true for THIS segment. Do not invent demographics that don't matter for the product.",
    whyItWorks: [
      "Verbatim quotes are gold for copywriting — most personas skip them.",
      "Trigger-event + objection are the actual sales-critical pieces.",
      "\"Things they tried before\" gives you positioning vs. competitors.",
    ],
    platforms: ["claude", "chatgpt"],
    tags: ["persona", "marketing", "research"],
  },

  // CONTENT
  {
    slug: "carousel-post-writer",
    title: "Instagram / LinkedIn Carousel Writer",
    tagline: "10 slides of content that doesn't feel like ChatGPT wrote it.",
    category: "content",
    beforePrompt: "write a carousel about <topic>",
    betterPrompt:
      "Write a 10-slide carousel.\n\nTopic: <TOPIC>\nAudience: <WHO, what they currently believe>\nThe insight they'll have by slide 10: <INSIGHT>\nVoice: <e.g. confident, no-fluff, slightly contrarian>\n\nSlide-by-slide rules:\n- Slide 1: hook — max 8 words, no question.\n- Slides 2–8: one idea per slide, max 2 lines of text.\n- Slide 9: the contrarian or surprising point.\n- Slide 10: the takeaway + a soft CTA.\n\nFor each slide, give me:\n- Headline (the big text on the slide)\n- Body (the 1–2 lines of supporting text)\n- [VISUAL] cue in brackets (what should be on the slide besides text)\n\nNo emojis. No hashtags inside the slides.",
    whyItWorks: [
      "Per-slide format prevents the 'wall of text on slide 1' mistake.",
      "Visual cues turn the prompt into a designable brief.",
      "Reserving the contrarian slide for #9 mirrors how carousels actually go viral.",
    ],
    platforms: ["chatgpt", "claude"],
    tags: ["carousel", "social", "linkedin", "instagram"],
  },
  {
    slug: "thread-from-article",
    title: "Twitter Thread from an Article",
    tagline: "Compress a long article into a 7-tweet thread that earns clicks.",
    category: "content",
    beforePrompt: "turn this into a twitter thread:\n<paste>",
    betterPrompt:
      "Compress the following article into a 7-tweet thread.\n\nArticle:\n<PASTE>\n\nGoal: get clicks BACK to the original article. The thread should make the reader want the rest.\n\nRules:\n- Tweet 1: hook — max 12 words, specific scene or number, no question.\n- Tweets 2–6: one substantive insight each, 240 chars max, no \"continued in next tweet\" framing — each tweet stands alone.\n- Tweet 7: the strongest payoff from the article + a soft 'full article here' line.\n- No emojis. No hashtags. No \"a thread 🧵\" preamble. No \"like and follow\".\n\nBefore the thread, give me the SINGLE sentence from the article that should NOT be in the thread (the one you want them to click to read).",
    whyItWorks: [
      "The 'don't include this line' instruction creates the curiosity gap for clickthrough.",
      "Hard 'each tweet stands alone' rule prevents the bad pattern of cliffhangers in the middle.",
      "Banning thread-bro clichés makes the output ship-ready.",
    ],
    platforms: ["chatgpt", "claude", "grok"],
    tags: ["twitter", "thread", "social"],
  },

  // FUN
  {
    slug: "roast-my-prompt",
    title: "Roast My Prompt",
    tagline: "Funny analysis of why your prompt is bad — then fix it.",
    category: "fun",
    viral: true,
    beforePrompt: "review my prompt:\n<paste>",
    betterPrompt:
      "Roast the following prompt like a dry, slightly amused prompt-engineering critic.\n\nPrompt:\n<PASTE>\n\nFor the target model: <e.g. Claude / ChatGPT / Gemini>\n\nDo this:\n1. ONE devastating one-liner observation.\n2. The 3 specific things this prompt is missing.\n3. The single phrase in it that is doing the most damage.\n4. A rewritten version that actually works.\n5. End with one line of genuine encouragement.\n\nTone: observational, dry, no insults about the person.",
    whyItWorks: [
      "Roast framing breaks polite filler and reveals real weaknesses.",
      "Concrete asks (the 3 missing things, the one damaging phrase) give the user a checklist.",
      "Rewrite at the end converts entertainment into a usable prompt.",
    ],
    platforms: ["chatgpt", "claude", "grok"],
    tags: ["prompt", "roast", "fun"],
  },
];

export function getTemplate(slug: string): Template | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function getTemplatesByCategory(c: TemplateCategory): Template[] {
  return TEMPLATES.filter((t) => t.category === c);
}
