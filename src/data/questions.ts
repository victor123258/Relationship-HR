import type { FormSection } from "../types";

/**
 * FORM RH-1312 — MUTUAL COMPATIBILITY APPLICATION
 * Both applicants answer the identical form. Gender neutral. No judges.
 */
export const SECTIONS: FormSection[] = [
  {
    id: "personal",
    num: 1,
    code: "PI",
    title: "PERSONAL INFORMATION",
    blurb: "Standard intake. State facts only. The department accepts all varieties of human.",
    questions: [
      { id: "s1_name", label: "Full name", type: "text", required: true, placeholder: "e.g. Jordan Ellis" },
      { id: "s1_age", label: "Age", type: "number", required: true, placeholder: "18+" },
      { id: "s1_location", label: "Location", type: "text", required: true, placeholder: "City, Country" },
      { id: "s1_occupation", label: "Occupation", type: "text", required: true, placeholder: "What do you do?" },
      {
        id: "s1_status", label: "Current relationship status", type: "select", required: true, wide: true,
        options: [
          { value: "single", label: "Single" },
          { value: "complicated", label: "Complicated" },
          { value: "broken-up", label: '"Basically broken up"' },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "s1_children", label: "Children?", type: "select", required: true,
        options: [
          { value: "none", label: "No" },
          { value: "one", label: "Yes — 1" },
          { value: "two", label: "Yes — 2" },
          { value: "three-plus", label: "Yes — 3+" },
        ],
      },
      {
        id: "s1_situationship", label: "Currently in a relationship / situationship?", type: "select", required: true,
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
          { value: "complicated", label: "It's complicated" },
        ],
      },
    ],
  },
  {
    id: "history",
    num: 2,
    code: "HX",
    title: "RELATIONSHIP HISTORY",
    blurb: "Past performance is not destiny, but the department reads the archives anyway.",
    questions: [
      {
        id: "s2_length", label: "Length of your last relationship?", type: "select", required: true,
        options: [
          { value: "lt3m", label: "Less than 3 months" },
          { value: "3-12m", label: "3–12 months" },
          { value: "1-3y", label: "1–3 years" },
          { value: "3y-plus", label: "3+ years" },
          { value: "never", label: "Never been in one" },
        ],
      },
      {
        id: "s2_over_ex", label: "Are you over your ex?", type: "select", required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "check-page", label: "I still check their page sometimes" },
        ],
      },
      {
        id: "s2_talk_ex", label: "Do you still communicate with your ex?", type: "select", required: true,
        options: [
          { value: "no", label: "No" },
          { value: "occasionally", label: "Yes — occasionally" },
          { value: "regularly", label: "Yes — regularly" },
        ],
      },
      { id: "s2_why_end", label: "Why did it end?", type: "textarea", wide: true, required: true, placeholder: "The honest version, not the group-chat version." },
      { id: "s2_lesson", label: "What did your last relationship teach you?", type: "textarea", wide: true, required: true, placeholder: "One real lesson." },
    ],
  },
  {
    id: "emotional",
    num: 3,
    code: "EQ",
    title: "EMOTIONAL INTELLIGENCE",
    blurb: "How you behave at your worst matters more than how you behave at brunch.",
    questions: [
      {
        id: "s3_angry", label: "When angry with your partner, what do you normally do?", type: "select", required: true, wide: true,
        options: [
          { value: "talk-out", label: "Talk it out calmly" },
          { value: "space-then-talk", label: "Take space, then talk" },
          { value: "go-quiet", label: "Go quiet until it passes" },
          { value: "raise-voice", label: "Raise my voice / say things I regret" },
        ],
      },
      {
        id: "s3_hurt", label: "Your partner tells you something you did hurt them. Your response?", type: "select", required: true, wide: true,
        options: [
          { value: "listen-apologize", label: "Listen and apologize" },
          { value: "explain-then-apologize", label: "Explain my intentions, then apologize" },
          { value: "get-defensive", label: "Get defensive" },
          { value: "too-sensitive", label: "Tell them they're too sensitive" },
        ],
      },
      {
        id: "s3_upset", label: "Can you communicate when you're upset?", type: "select", required: true, wide: true,
        options: [
          { value: "absolutely", label: "Absolutely" },
          { value: "time-communicate", label: "I need time, but I communicate" },
          { value: "disappear", label: "I disappear for 3 business days" },
        ],
      },
      {
        id: "s3_disagree", label: "How do you handle disagreements?", type: "select", required: true, wide: true,
        options: [
          { value: "debate-fair", label: "Debate fairly and resolve" },
          { value: "compromise", label: "Compromise quickly" },
          { value: "avoid", label: "Avoid them" },
          { value: "win", label: "Win at all costs" },
        ],
      },
    ],
  },
  {
    id: "communication",
    num: 4,
    code: "CM",
    title: "COMMUNICATION",
    blurb: "The department notes that 'k' is not a complete sentence.",
    questions: [
      {
        id: "s4_busy", label: "Your partner messages while you're busy. You:", type: "select", required: true, wide: true,
        options: [
          { value: "ignore", label: "Ignore it" },
          { value: "tell-later", label: "Tell them I'm busy & respond later" },
          { value: "quick-text", label: 'Quick "I\'m busy" text' },
          { value: "mood", label: "Depends on my mood" },
        ],
      },
      {
        id: "s4_freq", label: "Preferred communication frequency", type: "select", required: true, wide: true,
        options: [
          { value: "all-day", label: "All day" },
          { value: "throughout", label: "Throughout the day" },
          { value: "morning-evening", label: "Morning & evening" },
          { value: "when-remember", label: "Whenever I remember" },
        ],
      },
      {
        id: "s4_calls", label: "Comfortable with phone / video calls?", type: "select", required: true, wide: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "depends", label: "Depends who's calling" },
        ],
      },
    ],
  },
  {
    id: "dealbreakers",
    num: 5,
    code: "DX",
    title: "DEALBREAKERS DISCLOSURE",
    blurb: "Mandatory honesty zone. Lying here voids the warranty of everything else you wrote.",
    questions: [
      {
        id: "s5_cheat", label: "Do you cheat?", type: "select", required: true, wide: true,
        options: [
          { value: "no", label: "No" },
          { value: "sometimes", label: "Sometimes" },
          { value: "not-cheating", label: '"I believe it\'s not cheating if…"', flag: true },
        ],
      },
      {
        id: "s5_entertain", label: "Do you entertain others while in a relationship?", type: "select", required: true, wide: true,
        options: [
          { value: "no", label: "No" },
          { value: "sometimes", label: "Sometimes" },
          { value: "attention", label: '"I just like attention"', flag: true },
        ],
      },
      {
        id: "s5_flirt", label: "Do you flirt with others?", type: "select", required: true,
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
          { value: "bored", label: "Only when I'm bored" },
        ],
      },
      {
        id: "s5_anger", label: "Anger issues?", type: "select", required: true,
        options: [
          { value: "no", label: "No" },
          { value: "sometimes", label: "Sometimes" },
          { value: "working-on-it", label: "Yes — working on it" },
        ],
      },
      {
        id: "s5_lie", label: "Do you lie?", type: "select", required: true,
        options: [
          { value: "never", label: "Never" },
          { value: "sometimes", label: "Sometimes" },
          { value: "everyone-lies", label: "Everyone lies" },
        ],
      },
      { id: "s5_biggest_flag", label: "Your biggest red flag (self-declared)", type: "text", wide: true, required: false, placeholder: "Everyone has one. Naming yours is a green flag.", hint: "Optional — but honesty scores points with the department." },
    ],
  },
  {
    id: "ratings",
    num: 6,
    code: "SR",
    title: "SELF-RATINGS",
    blurb: "Rate yourself honestly, 1–10. Inflated scores are detected at co-review.",
    questions: [
      { id: "s6_comm", label: "Communication", type: "slider", required: true },
      { id: "s6_loyalty", label: "Loyalty", type: "slider", required: true },
      { id: "s6_affection", label: "Affection", type: "slider", required: true },
      { id: "s6_romance", label: "Romance", type: "slider", required: true },
      { id: "s6_patience", label: "Patience", type: "slider", required: true },
      { id: "s6_support", label: "Emotional support", type: "slider", required: true },
      { id: "s6_consistency", label: "Consistency", type: "slider", required: true },
      { id: "s6_humor", label: "Making my partner laugh", type: "slider", required: true },
      { id: "s6_dates", label: "Planning dates", type: "slider", required: true },
      { id: "s6_good_partner", label: "What does being a good partner mean to you?", type: "textarea", wide: true, required: true, placeholder: "Your personal definition." },
      { id: "s6_make_loved", label: "What would you do to make your partner feel loved?", type: "textarea", wide: true, required: true, placeholder: "Specific beats generic." },
    ],
  },
  {
    id: "financial",
    num: 7,
    code: "FN",
    title: "FINANCIAL & RESPONSIBILITY",
    blurb: "Romance is free. Everything else on the date has a price. Disclose accordingly.",
    questions: [
      {
        id: "s7_job", label: "Do you have a job / income?", type: "select", required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "looking", label: "Currently looking" },
        ],
      },
      {
        id: "s7_dates", label: "Paying for dates:", type: "select", required: true, wide: true,
        options: [
          { value: "dont-mind", label: "I don't mind paying", short: "Flexible" },
          { value: "take-turns", label: "We take turns", short: "Take turns" },
          { value: "fifty-fifty", label: "50/50 always", short: "50/50" },
          { value: "partner-pays", label: "Partner can pay", short: "Partner pays" },
        ],
      },
      {
        id: "s7_responsible", label: "Are you financially responsible?", type: "select", required: true, wide: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "trying", label: "Trying my best" },
          { value: "needs-prayer", label: "My bank account needs prayer" },
        ],
      },
    ],
  },
  {
    id: "love",
    num: 8,
    code: "LV",
    title: "LOVE & AFFECTION",
    blurb: "Identify your dialect of love so the other applicant doesn't need a translator.",
    questions: [
      {
        id: "s8_love_lang", label: "Primary love language", type: "select", required: true, wide: true,
        options: [
          { value: "words", label: "Words of affirmation", short: "Words" },
          { value: "quality", label: "Quality time", short: "Quality Time" },
          { value: "touch", label: "Physical touch", short: "Touch" },
          { value: "service", label: "Acts of service", short: "Service" },
          { value: "gifts", label: "Gifts", short: "Gifts" },
          { value: "all", label: "All of the above", short: "All" },
        ],
      },
      {
        id: "s8_affection", label: "Affection level", type: "select", required: true, wide: true,
        options: [
          { value: "very", label: "Very affectionate" },
          { value: "moderate", label: "Moderately affectionate" },
          { value: "shy", label: "I'm shy" },
          { value: "dont-touch", label: "Please don't touch me" },
        ],
      },
      {
        id: "s8_reassurance", label: "How much reassurance do you need?", type: "select", required: true, wide: true,
        options: [
          { value: "constant", label: "Constant reassurance, please" },
          { value: "now-and-then", label: "A check-in now and then" },
          { value: "rarely", label: "Rarely — I'm secure" },
          { value: "give-more", label: "I give it more than I need it" },
        ],
      },
    ],
  },
  {
    id: "jealousy",
    num: 9,
    code: "JB",
    title: "JEALOUSY & BOUNDARIES",
    blurb: "Declare your security clearance requirements before access is granted.",
    questions: [
      { id: "s9_jealousy", label: "Jealousy level (1 = unbothered, 10 = private investigator)", type: "slider", required: true, wide: true },
      {
        id: "s9_phone", label: "Would you go through your partner's phone?", type: "select", required: true, wide: true,
        options: [
          { value: "no", label: "No" },
          { value: "reason", label: "If I have a reason" },
          { value: "everything", label: "Yes — I need to know everything" },
        ],
      },
      {
        id: "s9_friends", label: "Should your partner have opposite-sex friends?", type: "select", required: true, wide: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "depends", label: "Depends on the friendship" },
        ],
      },
      { id: "s9_boundaries", label: "Boundaries you'd expect?", type: "textarea", wide: true, required: false, placeholder: "e.g. no 2am 'just friends' calls…", hint: "Optional, but boundaries said out loud are cheaper than boundaries discovered." },
    ],
  },
  {
    id: "intentions",
    num: 10,
    code: "IT",
    title: "INTENTIONS",
    blurb: "State your business with this department. Time-wasting is a billable offense.",
    questions: [
      {
        id: "s10_why", label: "Why are you here?", type: "select", required: true, wide: true,
        options: [
          { value: "serious", label: "Serious relationship", short: "Serious" },
          { value: "casual", label: "Casual", short: "Casual" },
          { value: "friendship", label: "Friendship", short: "Friendship" },
          { value: "marriage", label: "Marriage eventually", short: "Marriage" },
          { value: "dont-know", label: "Don't know", short: "Unsure" },
          { value: "curious", label: "Just curious", short: "Curious" },
        ],
      },
      { id: "s10_years", label: "Where do you see yourself in 2–3 years?", type: "text", wide: true, required: true, placeholder: "One sentence is enough." },
      { id: "s10_commitment", label: "What does commitment mean to you?", type: "textarea", wide: true, required: true, placeholder: "Define the word before you sign for it." },
      {
        id: "s10_loyal", label: "Willing to be loyal, honest and consistent?", type: "select", required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "thinking", label: "Need to think" },
        ],
      },
    ],
  },
  {
    id: "accountability",
    num: 11,
    code: "AC",
    title: "ACCOUNTABILITY",
    blurb: "One question. The shortest section and the heaviest.",
    questions: [
      {
        id: "s11_apology", label: 'Can you apologize without saying "but you…"?', type: "select", required: true, wide: true,
        options: [
          { value: "yes", label: "Yes", short: "Clean apology" },
          { value: "no", label: "No", short: "Avoids it" },
          { value: "attacked", label: "I already feel attacked", short: "Feels attacked" },
        ],
      },
    ],
  },
  {
    id: "initiative",
    num: 12,
    code: "IV",
    title: "INITIATIVE",
    blurb: "Effort is a language too. Show your fluency level.",
    questions: [
      {
        id: "s12_plan", label: '"Plan a date" means:', type: "select", required: true, wide: true,
        options: [
          { value: "book", label: "Book something I know they'll love" },
          { value: "questions", label: "Ask 14 questions until they plan it" },
          { value: "easy", label: '"I\'m easy — whatever you want"' },
        ],
      },
    ],
  },
  {
    id: "reflection",
    num: 13,
    code: "RF",
    title: "FINAL REFLECTION",
    blurb: "Open-book essay portion. Answers stay sealed inside the report envelope.",
    questions: [
      { id: "f_choose", label: "Why should your partner choose this match?", type: "textarea", wide: true, required: false, placeholder: "Make your case." },
      { id: "f_promise", label: "One thing you can promise?", type: "textarea", wide: true, required: false, placeholder: "Only promise what survives a bad week." },
      { id: "f_never", label: "Something you'd NEVER do to your partner?", type: "textarea", wide: true, required: false, placeholder: "Your hard line." },
      { id: "f_perfect_date", label: "Your idea of a perfect date?", type: "textarea", wide: true, required: false, placeholder: "Paint the picture." },
      { id: "f_argument", label: "What would you do after an argument, before bed?", type: "textarea", wide: true, required: false, placeholder: "The 11pm protocol." },
      { id: "f_bad_day", label: "How would you fix your partner's terrible day?", type: "textarea", wide: true, required: false, placeholder: "Emergency response plan." },
      { id: "f_intentions", label: "Your intentions in this relationship?", type: "textarea", wide: true, required: false, placeholder: "Final statement for the record." },
      { id: "f_should_know", label: "One thing about you your partner should know?", type: "textarea", wide: true, required: false, placeholder: "The footnote that matters." },
    ],
  },
];

export const REQUIRED_IDS: string[] = SECTIONS.flatMap((s) =>
  s.questions.filter((q) => q.required).map((q) => q.id)
);

const OPTION_INDEX = new Map<string, Map<string, string>>();
for (const s of SECTIONS) {
  for (const q of s.questions) {
    if (q.options) OPTION_INDEX.set(q.id, new Map(q.options.map((o) => [o.value, o.label])));
  }
}

export function labelOf(qid: string, value: string | number | undefined): string {
  if (value === undefined) return "—";
  const m = OPTION_INDEX.get(qid);
  const label = m?.get(String(value));
  return label ?? String(value);
}

export function shortOf(qid: string, value: string | number | undefined): string {
  if (value === undefined) return "—";
  for (const s of SECTIONS) {
    for (const q of s.questions) {
      if (q.id === qid && q.options) {
        const o = q.options.find((x) => x.value === value);
        if (o) return o.short ?? o.label;
      }
    }
  }
  return String(value);
}
