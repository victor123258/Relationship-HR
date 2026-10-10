import type { FormStepDef, Question, Option } from "../types/form";

const LOVE_LANGUAGE_OPTIONS: Option[] = [
  { value: "words", label: "Words of Affirmation" },
  { value: "quality", label: "Quality Time" },
  { value: "touch", label: "Physical Touch" },
  { value: "acts", label: "Acts of Service" },
  { value: "gifts", label: "Gift Giving / Receiving" },
  { value: "all", label: "All of the above equally" },
];

const slider = (id: string, label: string): Question => ({
  id,
  label,
  type: "slider",
  required: true,
  min: 1,
  max: 10,
  sliderLabels: { low: "Needs work", mid: "Decent", high: "Elite" },
});

export const FORM_STEPS: FormStepDef[] = [
  {
    id: "personal",
    number: 1,
    title: "Personal Information",
    shortTitle: "Personal",
    subtitle: "The basics. Nothing you wouldn't put on a very honest dating profile.",
    questions: [
      { id: "p1", label: "Full name", type: "text", required: true, placeholder: "e.g. Alex Rivera", maxLength: 60 },
      { id: "p2", label: "Age", type: "number", required: true, min: 18, max: 120, placeholder: "18+", helper: "Applicants must be 18 or older." },
      { id: "p3", label: "Location (city / region)", type: "text", required: true, placeholder: "e.g. Portland, OR", maxLength: 80 },
      { id: "p4", label: "Occupation", type: "text", required: true, placeholder: "e.g. Graphic designer, student, recovering engineer", maxLength: 80 },
      {
        id: "p5",
        label: "Current relationship status",
        type: "select",
        required: true,
        options: [
          { value: "single", label: "Single" },
          { value: "complicated", label: "It's complicated" },
          { value: "broken_up", label: "Basically broken up" },
          { value: "open", label: "In an open relationship" },
          { value: "other", label: "Other (specify)" },
        ],
        conditional: {
          whenValues: ["other"],
          id: "p5_other",
          label: "Please specify",
          placeholder: "Briefly describe your situation",
          maxLength: 120,
        },
      },
      {
        id: "p6",
        label: "Do you have children?",
        type: "select",
        required: true,
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
        ],
        conditional: {
          whenValues: ["yes"],
          id: "p6_count",
          label: "How many?",
          type: "number",
          placeholder: "e.g. 2",
        },
      },
      {
        id: "p7",
        label: "Are you currently in a relationship or situationship?",
        type: "select",
        required: true,
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
          { value: "complicated", label: "It's complicated" },
          { value: "pnts", label: "Prefer not to say" },
        ],
      },
    ],
  },
  {
    id: "history",
    number: 2,
    title: "Relationship History",
    shortTitle: "History",
    subtitle: "Where you've been shapes where you're going. Honesty here is a green flag.",
    questions: [
      {
        id: "h1",
        label: "How long was your last significant relationship?",
        type: "select",
        required: true,
        options: [
          { value: "never", label: "Never had one" },
          { value: "lt6", label: "Less than 6 months" },
          { value: "m6_12", label: "6 months – 1 year" },
          { value: "y1_3", label: "1–3 years" },
          { value: "y3plus", label: "3+ years" },
        ],
      },
      { id: "h2", label: "What ended it? (if applicable)", type: "textarea", maxLength: 300, placeholder: "Optional. Share as much or as little as you like." },
      {
        id: "h3",
        label: "Are you over your ex?",
        type: "select",
        required: true,
        options: [
          { value: "completely", label: "Yes, completely" },
          { value: "mostly", label: "Mostly — still healing" },
          { value: "not_really", label: "No, not really" },
          { value: "check_page", label: "I still check their page sometimes", hint: "keeping tabs" },
        ],
      },
      {
        id: "h4",
        label: "Do you still communicate with your ex?",
        type: "select",
        required: true,
        options: [
          { value: "no", label: "No" },
          { value: "civil", label: "Occasionally, it's civil" },
          { value: "close", label: "Yes, we're close friends" },
        ],
        conditional: {
          whenValues: ["civil", "close"],
          id: "h4_explain",
          label: "Briefly explain",
          placeholder: "Context helps. One or two sentences is plenty.",
          maxLength: 200,
        },
      },
      { id: "h5", label: "What did your last relationship teach you?", type: "textarea", required: true, maxLength: 500, placeholder: "Real answers only. 'Nothing' is not an answer." },
    ],
  },
  {
    id: "emotional",
    number: 3,
    title: "Emotional Intelligence",
    shortTitle: "Emotional IQ",
    subtitle: "How you handle feelings — yours and theirs — when things get real.",
    questions: [
      {
        id: "e1",
        label: "When you're angry with your partner, what do you normally do?",
        type: "select",
        required: true,
        options: [
          { value: "calm", label: "Talk about it calmly" },
          { value: "space_first", label: "Need space first, then talk" },
          { value: "shutdown", label: "Shut down / go silent" },
          { value: "loud", label: "Get loud / say things I regret" },
          { value: "write_out", label: "Write it out (text / letter)" },
        ],
      },
      {
        id: "e2",
        label: "If your partner says “That thing you did hurt me,” your first response is:",
        type: "select",
        required: true,
        options: [
          { value: "sorry_more", label: "“I'm sorry — tell me more so I can understand”" },
          { value: "hear_you", label: "“I didn't mean it that way, but I hear you”" },
          { value: "but_you_too", label: "“But you also did…”" },
          { value: "too_sensitive", label: "“You're being too sensitive”" },
          { value: "need_moment", label: "“I need a moment to process this”" },
        ],
      },
      {
        id: "e3",
        label: "Can you communicate your feelings when upset?",
        type: "select",
        required: true,
        options: [
          { value: "clear_calm", label: "Yes, clearly and calmly" },
          { value: "time_then_open", label: "I need time, but I eventually open up" },
          { value: "withdraw", label: "I struggle with it — I tend to withdraw" },
          { value: "disappear", label: "I disappear for 3 business days", hint: "offline mode" },
        ],
      },
      {
        id: "e4",
        label: "How do you prefer to handle disagreements?",
        type: "select",
        required: true,
        options: [
          { value: "immediate", label: "Discuss immediately" },
          { value: "cooldown", label: "Cool down first, then revisit" },
          { value: "avoid", label: "Avoid conflict entirely" },
          { value: "seek_input", label: "Seek input from a trusted friend / therapist" },
          { value: "depends", label: "Depends on the situation" },
        ],
      },
    ],
  },
  {
    id: "communication",
    number: 4,
    title: "Communication Style",
    shortTitle: "Communication",
    subtitle: "Texting cadence, call comfort, and how you show up in each other's inbox.",
    questions: [
      {
        id: "c1",
        label: "Your partner messages you while you're busy. You:",
        type: "select",
        required: true,
        options: [
          { value: "reply_now", label: "Respond immediately anyway" },
          { value: "quick_ack", label: "Send a quick “I'm busy, talk soon” text" },
          { value: "when_free", label: "Read it and respond when free" },
          { value: "ignore", label: "Ignore until I feel like replying" },
          { value: "mood", label: "Depends on my mood, honestly" },
        ],
      },
      {
        id: "c2",
        label: "How often do you prefer to communicate with your partner daily?",
        type: "select",
        required: true,
        options: [
          { value: "throughout", label: "Throughout the day (ongoing conversation)" },
          { value: "checkins", label: "A few check-ins (morning, lunch, evening)" },
          { value: "morning_night", label: "Morning and night mainly" },
          { value: "important", label: "When something important comes up" },
          { value: "whenever", label: "Whenever I remember", hint: "casual" },
        ],
      },
      {
        id: "c3",
        label: "Are you comfortable with phone / video calls?",
        type: "select",
        required: true,
        options: [
          { value: "love_calls", label: "Yes, love them" },
          { value: "scheduled", label: "Fine with scheduled calls" },
          { value: "texting", label: "Prefer texting" },
          { value: "emergency", label: "Absolutely not, unless emergency" },
          { value: "depends_who", label: "Depends who's calling", hint: "screening" },
        ],
      },
      {
        id: "c4",
        label: "How do you express interest / affection through text?",
        type: "select",
        required: true,
        options: [
          { value: "memes_voice", label: "Lots of memes, voice notes, and reactions" },
          { value: "long_thoughtful", label: "Thoughtful long messages" },
          { value: "short_frequent", label: "Short but frequent check-ins" },
          { value: "in_person", label: "I'm not great over text — better in person" },
        ],
      },
    ],
  },
  {
    id: "dealbreakers",
    number: 5,
    title: "Dealbreakers Disclosure",
    shortTitle: "Dealbreakers",
    subtitle: "The section nobody wants to answer and everybody needs to. You both answer it — equally.",
    questions: [
      {
        id: "d1",
        label: "Have you ever cheated in a relationship?",
        type: "select",
        required: true,
        options: [
          { value: "never", label: "No, never" },
          { value: "regret", label: "Yes, and I deeply regret it" },
          { value: "more_than_once", label: "Yes, more than once" },
          { value: "not_cheating_if", label: "“I believe it's not cheating if…”", hint: "define it" },
        ],
      },
      {
        id: "d2",
        label: "Do you entertain other people's romantic advances while in a relationship?",
        type: "select",
        required: true,
        options: [
          { value: "shut_down", label: "No, I shut it down" },
          { value: "polite_boundaries", label: "I'm polite but set boundaries" },
          { value: "sometimes_attention", label: "Sometimes — I like the attention" },
          { value: "like_attention", label: "I just like attention", hint: "at least it's honest" },
        ],
      },
      {
        id: "d3",
        label: "Do you flirt with others while in a relationship?",
        type: "select",
        required: true,
        options: [
          { value: "no", label: "No" },
          { value: "told_i_do", label: "Not intentionally, but I'm told I do" },
          { value: "harmless", label: "Yes, but it's harmless" },
          { value: "unappreciated", label: "Only when I'm feeling unappreciated" },
        ],
      },
      {
        id: "d4",
        label: "Do you have anger management issues?",
        type: "select",
        required: true,
        options: [
          { value: "no", label: "No" },
          { value: "aware_working", label: "Occasionally — I'm aware and working on it" },
          { value: "heated", label: "I can get heated but I never get physical" },
          { value: "seeking_help", label: "Yes — I'm actively seeking help" },
        ],
      },
      {
        id: "d5",
        label: "How honest are you?",
        type: "select",
        required: true,
        options: [
          { value: "radical", label: "Radically honest — even when it's hard" },
          { value: "white_lies", label: "Honest about important things; white lies on small stuff" },
          { value: "appease", label: "I tell people what they want to hear" },
          { value: "everyone_lies", label: "Everyone lies — let's be real" },
        ],
      },
      {
        id: "d6",
        label: "What's your biggest red flag? Be honest.",
        type: "textarea",
        required: true,
        maxLength: 300,
        placeholder: "We all have them. What's yours?",
      },
    ],
  },
  {
    id: "self",
    number: 6,
    title: "Self-Assessment Ratings",
    shortTitle: "Self Ratings",
    subtitle: "Rate yourself honestly. Your partner is doing the same — the gaps (and matches) are the interesting part.",
    questions: [
      slider("s1", "Communication skills"),
      slider("s2", "Loyalty"),
      slider("s3", "Showing affection"),
      slider("s4", "Romantic effort"),
      slider("s5", "Patience"),
      slider("s6", "Emotional support"),
      slider("s7", "Consistency / reliability"),
      slider("s8", "Making my partner laugh"),
      slider("s9", "Planning dates / quality time"),
      { id: "s10", label: "What does being a good partner mean to you?", type: "textarea", maxLength: 500, placeholder: "Your personal definition, not a greeting-card quote." },
      { id: "s11", label: "What would you actively do to make your partner feel loved?", type: "textarea", maxLength: 500, placeholder: "Concrete actions beat abstract promises." },
    ],
  },
  {
    id: "financial",
    number: 7,
    title: "Financial & Responsibility",
    shortTitle: "Financial",
    subtitle: "Money talks cause more breakups than money itself. Let's see your philosophy.",
    questions: [
      {
        id: "f1",
        label: "Do you have a stable job / income?",
        type: "select",
        required: true,
        options: [
          { value: "employed", label: "Yes, employed" },
          { value: "self_employed", label: "Self-employed / freelancing" },
          { value: "between", label: "Currently between jobs" },
          { value: "student", label: "Student" },
          { value: "pnts", label: "Prefer not to say" },
        ],
      },
      {
        id: "f2",
        label: "Your philosophy on paying for dates:",
        type: "select",
        required: true,
        options: [
          { value: "cover", label: "I don't mind covering most dates" },
          { value: "turns", label: "We should take turns" },
          { value: "fifty_fifty", label: "Always 50/50" },
          { value: "suggester", label: "Whoever suggests the date pays" },
          { value: "partner_pays", label: "My partner can pay" },
        ],
      },
      {
        id: "f3",
        label: "How financially responsible would you say you are?",
        type: "select",
        required: true,
        options: [
          { value: "budget_save", label: "Very — I budget and save" },
          { value: "trying_tough", label: "Trying my best — some months are tough" },
          { value: "needs_prayer", label: "My bank account needs prayer", hint: "send help" },
          { value: "comfortable_no_plan", label: "Comfortable, but not great at planning" },
        ],
      },
      {
        id: "f4",
        label: "Is financial stability in a partner important to you?",
        type: "select",
        required: true,
        options: [
          { value: "very", label: "Very important" },
          { value: "trying_ok", label: "Somewhat — as long as they're trying" },
          { value: "love_enough", label: "Not really — love is enough" },
          { value: "build_together", label: "We can build together" },
        ],
      },
    ],
  },
  {
    id: "love",
    number: 8,
    title: "Love & Affection",
    shortTitle: "Love",
    subtitle: "How you give it, how you need it, and how much of it you want.",
    questions: [
      { id: "l1", label: "What is your PRIMARY love language?", type: "select", required: true, options: LOVE_LANGUAGE_OPTIONS },
      { id: "l2", label: "What is your SECONDARY love language?", type: "select", required: true, options: LOVE_LANGUAGE_OPTIONS },
      {
        id: "l3",
        label: "How affectionate are you?",
        type: "select",
        required: true,
        options: [
          { value: "very", label: "Very — I love hugs, hand-holding, cuddling" },
          { value: "private", label: "Moderately — in private mostly" },
          { value: "shy_warmup", label: "I'm shy but I warm up" },
          { value: "different_way", label: "Not very — I show love differently" },
          { value: "no_touch", label: "Please don't touch me randomly" },
        ],
      },
      {
        id: "l4",
        label: "How much reassurance do you need?",
        type: "select",
        required: true,
        options: [
          { value: "lot", label: "A lot — tell me you love me often" },
          { value: "some", label: "Some — especially during rough patches" },
          { value: "minimal", label: "Minimal — I'm secure in how I feel" },
          { value: "unsure", label: "I don't know — I've never thought about it" },
        ],
      },
      { id: "l5", label: "How do you prefer to RECEIVE love?", type: "textarea", maxLength: 300, placeholder: "Paint the picture: what does feeling loved look like for you?" },
    ],
  },
  {
    id: "jealousy",
    number: 9,
    title: "Jealousy & Boundaries",
    shortTitle: "Boundaries",
    subtitle: "Trust, privacy, and where the invisible lines are drawn.",
    questions: [
      {
        id: "j1",
        label: "How jealous are you, on a scale of 1–10?",
        type: "slider",
        required: true,
        min: 1,
        max: 10,
        sliderLabels: { low: "Not at all", mid: "Normal amount", high: "Very" },
      },
      {
        id: "j2",
        label: "Would you go through your partner's phone?",
        type: "select",
        required: true,
        options: [
          { value: "trust", label: "No — I trust them" },
          { value: "strong_reason", label: "Only if I had a strong reason" },
          { value: "transparency", label: "Yes — transparency is important" },
          { value: "everything", label: "I need to know everything at all times" },
        ],
      },
      {
        id: "j3",
        label: "Should your partner have close friends of the gender they're attracted to?",
        type: "select",
        required: true,
        options: [
          { value: "yes_trust", label: "Yes, absolutely — trust is key" },
          { value: "yes_boundaries", label: "Yes, as long as there are boundaries" },
          { value: "uncomfortable_try", label: "I'd be uncomfortable but I'd try" },
          { value: "not_appropriate", label: "No — I don't think that's appropriate" },
        ],
      },
      { id: "j4", label: "What boundaries are most important to you in a relationship?", type: "textarea", maxLength: 400, placeholder: "e.g. No contact with exes, location sharing, alone time…" },
    ],
  },
  {
    id: "intentions",
    number: 10,
    title: "Intentions & Commitment",
    shortTitle: "Intentions",
    subtitle: "Why you're both here — and whether 'here' is the same place.",
    questions: [
      {
        id: "i1",
        label: "Why are you filling this out?",
        type: "select",
        required: true,
        options: [
          { value: "serious", label: "I want a serious relationship" },
          { value: "exploring", label: "Exploring — open to what happens" },
          { value: "friendship", label: "Looking for a genuine friendship first" },
          { value: "marriage", label: "Marriage is the goal" },
          { value: "unknown", label: "I honestly don't know yet" },
          { value: "curious", label: "Just curious / for fun" },
        ],
      },
      { id: "i2", label: "Where do you see yourself in 2–3 years?", type: "textarea", maxLength: 400, placeholder: "Career, city, life stage — the honest sketch." },
      { id: "i3", label: "What does commitment mean to you?", type: "textarea", maxLength: 400, placeholder: "In practice, day to day. Not the dictionary version." },
      {
        id: "i4",
        label: "Are you genuinely willing to be loyal, honest, and consistent?",
        type: "select",
        required: true,
        options: [
          { value: "yes_100", label: "Yes — 100%" },
          { value: "yes_work", label: "Yes — but I know I'll need to work at it" },
          { value: "struggled", label: "I want to be, but I've struggled in the past" },
          { value: "think_honestly", label: "I need to think about that honestly" },
        ],
      },
    ],
  },
  {
    id: "accountability",
    number: 11,
    title: "Accountability & Growth",
    shortTitle: "Accountability",
    subtitle: "Being wrong is inevitable. What you do next is the whole ballgame.",
    questions: [
      {
        id: "a1",
        label: "Can you apologize without adding “but you also…”?",
        type: "select",
        required: true,
        options: [
          { value: "own_fully", label: "Yes — I own my mistakes fully" },
          { value: "working", label: "I'm working on it" },
          { value: "struggle", label: "I struggle with this, honestly" },
          { value: "feel_attacked", label: "I already feel attacked by this question", hint: "oof" },
        ],
      },
      {
        id: "a2",
        label: "When your partner gives you constructive feedback, you:",
        type: "select",
        required: true,
        options: [
          { value: "listen_improve", label: "Listen and try to improve" },
          { value: "defensive_then_around", label: "Get defensive initially, but come around" },
          { value: "take_personally", label: "Take it personally" },
          { value: "shut_down", label: "Shut down" },
        ],
      },
      {
        id: "a3",
        label: "Are you willing to go to couples therapy / counseling if needed?",
        type: "select",
        required: true,
        options: [
          { value: "absolutely", label: "Yes, absolutely" },
          { value: "consider", label: "I'd consider it" },
          { value: "probably_not", label: "Probably not" },
          { value: "no_therapy", label: "I don't believe in therapy" },
        ],
      },
      {
        id: "a4",
        label: "How do you handle being wrong?",
        type: "select",
        required: true,
        options: [
          { value: "admit_apologize", label: "Admit it and apologize" },
          { value: "admit_eventually", label: "Admit it eventually" },
          { value: "deflect", label: "Deflect" },
          { value: "rarely_wrong", label: "I'm rarely wrong", hint: "sure" },
        ],
      },
    ],
  },
  {
    id: "initiative",
    number: 12,
    title: "Initiative & Effort",
    shortTitle: "Effort",
    subtitle: "Relationships run on effort the way phones run on charge. What's your battery habits?",
    questions: [
      {
        id: "n1",
        label: "“Let's plan a date” means you:",
        type: "select",
        required: true,
        options: [
          { value: "research_book", label: "Research and book something I know they'll love" },
          { value: "options_together", label: "Suggest 2–3 options and decide together" },
          { value: "ask_them", label: "Ask them what they want to do" },
          { value: "easy_whatever", label: "“I'm easy — whatever you want”", hint: "the classic" },
          { value: "wait_them", label: "Wait for them to plan it" },
        ],
      },
      {
        id: "n2",
        label: "How often should partners have intentional quality time?",
        type: "select",
        required: true,
        options: [
          { value: "daily", label: "Daily" },
          { value: "few_week", label: "A few times a week" },
          { value: "weekly", label: "Weekly date night" },
          { value: "natural", label: "Whenever it happens naturally" },
          { value: "alone_time", label: "I need a lot of alone time" },
        ],
      },
      {
        id: "n3",
        label: "If your partner had a terrible day, you would:",
        type: "select",
        required: true,
        options: [
          { value: "comfort_showup", label: "Show up with their favorite comfort (food, activity, etc.)" },
          { value: "talk_through", label: "Call / text to talk it through" },
          { value: "give_space", label: "Give them space unless they ask for help" },
          { value: "figure_out", label: "Not sure — I'd figure it out in the moment" },
        ],
      },
    ],
  },
  {
    id: "reflection",
    number: 13,
    title: "Final Reflection",
    shortTitle: "Reflection",
    subtitle: "The open-book portion. These answers appear side-by-side in the final report.",
    questions: [
      { id: "r1", label: "Why should your partner feel good about this match?", type: "textarea", required: true, maxLength: 500, placeholder: "Make the case for the two of you." },
      { id: "r2", label: "One thing you can genuinely promise in a relationship:", type: "textarea", required: true, maxLength: 300, placeholder: "A real one. You'll both read this." },
      { id: "r3", label: "Something you would NEVER do to a partner:", type: "textarea", required: true, maxLength: 300, placeholder: "Draw your hardest line." },
      { id: "r4", label: "Describe your idea of a perfect date:", type: "textarea", maxLength: 400, placeholder: "From start to finish. Details welcome." },
      { id: "r5", label: "After an argument, before going to bed, you would:", type: "textarea", maxLength: 300, placeholder: "What's your move?" },
      { id: "r6", label: "How would you help fix your partner's terrible day?", type: "textarea", maxLength: 300, placeholder: "Practical magic." },
      { id: "r7", label: "What are your true intentions going into this?", type: "textarea", required: true, maxLength: 500, placeholder: "Last chance to be completely straight." },
      { id: "r8", label: "One thing about yourself your partner should know upfront:", type: "textarea", required: true, maxLength: 400, placeholder: "The footnote that should really be a headline." },
    ],
  },
];

export const TOTAL_STEPS = FORM_STEPS.length;

const questionIndex = new Map<string, Question>();
const optionLabelIndex = new Map<string, Map<string, string>>();
FORM_STEPS.forEach((step) =>
  step.questions.forEach((q) => {
    questionIndex.set(q.id, q);
    if (q.options) {
      optionLabelIndex.set(q.id, new Map(q.options.map((o) => [o.value, o.label])));
    }
  })
);

export function getQuestion(id: string): Question | undefined {
  return questionIndex.get(id);
}

export function getOptionLabel(questionId: string, value: string | number | undefined): string {
  if (value === undefined || value === null || value === "") return "—";
  const v = String(value);
  return optionLabelIndex.get(questionId)?.get(v) ?? v;
}

export function getStepForQuestion(id: string): FormStepDef | undefined {
  return FORM_STEPS.find((s) => s.questions.some((q) => q.id === id));
}
