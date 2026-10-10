import type { AnswerMap } from "../types/form";

export const DEMO_CODE = "SAMPLE";
export const DEMO_NAME_A = "Alex Rivera";
export const DEMO_NAME_B = "Jordan Lee";

/**
 * Realistic demo personas. Intentionally crafted so the report shows:
 * strong values & emotional alignment, a communication-cadence friction,
 * a jealousy gap, and one values-conflict flag (couples therapy views).
 */
export const SAMPLE_ANSWERS_A: AnswerMap = {
  // 1 — personal
  p1: DEMO_NAME_A,
  p2: 28,
  p3: "Portland, OR",
  p4: "Graphic designer",
  p5: "single",
  p6: "no",
  p7: "no",
  // 2 — history
  h1: "y1_3",
  h2: "We wanted different things long-term — amicable, but it ran its course.",
  h3: "mostly",
  h4: "civil",
  h4_explain: "We share a friend group, so we keep it friendly. Nothing more.",
  h5: "That love without communication is just guessing. I learned to say what I need instead of hoping someone reads my mind.",
  // 3 — emotional
  e1: "space_first",
  e2: "hear_you",
  e3: "time_then_open",
  e4: "cooldown",
  // 4 — communication
  c1: "when_free",
  c2: "morning_night",
  c3: "texting",
  c4: "short_frequent",
  // 5 — dealbreakers
  d1: "never",
  d2: "polite_boundaries",
  d3: "told_i_do",
  d4: "aware_working",
  d5: "white_lies",
  d6: "I can be passive when I'm overwhelmed. I retreat instead of saying I need a minute, and it reads as coldness.",
  // 6 — self assessment
  s1: 7, s2: 9, s3: 6, s4: 7, s5: 6, s6: 8, s7: 8, s8: 7, s9: 6,
  s10: "Showing up consistently. Being the same person on a bad Tuesday as on a good Saturday. Remembering the small things they mention once.",
  s11: "Make their coffee the way they like it without being asked. Send the song that reminded me of them. Defend them in rooms they're not in.",
  // 7 — financial
  f1: "employed",
  f2: "turns",
  f3: "trying_tough",
  f4: "trying_ok",
  // 8 — love
  l1: "quality",
  l2: "words",
  l3: "private",
  l4: "some",
  l5: "Undivided attention. Phone down, eyes up. An afternoon with no agenda where we're just... around each other on purpose.",
  // 9 — jealousy
  j1: 4,
  j2: "strong_reason",
  j3: "yes_boundaries",
  j4: "No secret relationships with exes, no flirty DMs, and if something feels off we say it out loud instead of snooping.",
  // 10 — intentions
  i1: "serious",
  i2: "Same city, better apartment, dog maybe. Work I don't hate. Someone to split groceries and streaming passwords with — permanently.",
  i3: "Choosing the same person every day, including on the days it would be easier not to. It's a verb, not a feeling.",
  i4: "yes_work",
  // 11 — accountability
  a1: "working",
  a2: "defensive_then_around",
  a3: "absolutely",
  a4: "admit_eventually",
  // 12 — initiative
  n1: "options_together",
  n2: "few_week",
  n3: "talk_through",
  // 13 — reflection
  r1: "Because I'm past the games phase of my life. I'll communicate, I'll show up, and I'll actually read this report instead of skimming it.",
  r2: "I will always tell you the truth, even when a comforting lie would be easier for both of us.",
  r3: "I would never use someone's insecurities against them in an argument. Ever.",
  r4: "Farmers market in the morning, cook something ambitious together that slightly fails, laugh about it, then a long walk with nowhere to be. Ending with terrible reality TV and zero shame.",
  r5: "Say 'I'm still upset but I love you and we're okay' before sleep. Never let the silence be the last thing between us at night.",
  r6: "Pick up their favorite takeout, queue their comfort show, and give them the floor to vent — no fixing unless they ask for it.",
  r7: "To find something real and unhurried. I'm not collecting matches; I'm looking for my person, and I'm willing to be measured by that standard.",
  r8: "I go quiet when I'm processing. It's not punishment and it's not about you — I've just learned words I say too fast are usually the wrong ones.",
};

export const SAMPLE_ANSWERS_B: AnswerMap = {
  // 1 — personal
  p1: DEMO_NAME_B,
  p2: 27,
  p3: "Portland, OR",
  p4: "Registered nurse",
  p5: "single",
  p6: "no",
  p7: "no",
  // 2 — history
  h1: "m6_12",
  h2: "Different love languages, mostly. We liked each other a lot and understood each other a little.",
  h3: "completely",
  h4: "no",
  h5: "That I shrink my needs to seem easygoing, then resent it later. I'm done auditioning for the role of 'low maintenance'.",
  // 3 — emotional
  e1: "calm",
  e2: "sorry_more",
  e3: "time_then_open",
  e4: "cooldown",
  // 4 — communication
  c1: "reply_now",
  c2: "throughout",
  c3: "love_calls",
  c4: "memes_voice",
  // 5 — dealbreakers
  d1: "never",
  d2: "shut_down",
  d3: "no",
  d4: "no",
  d5: "radical",
  d6: "I over-function. I take care of everything until I'm exhausted, then I get quietly resentful that nobody noticed.",
  // 6 — self assessment
  s1: 9, s2: 9, s3: 8, s4: 8, s5: 7, s6: 7, s7: 7, s8: 8, s9: 8,
  s10: "Being curious about your partner forever. Never deciding you already know everything about them and going on autopilot.",
  s11: "Learn their tells. Notice the mood shift before they say a word. Keep a mental list of their favorites and deploy it on bad days.",
  // 7 — financial
  f1: "employed",
  f2: "fifty_fifty",
  f3: "needs_prayer",
  f4: "love_enough",
  // 8 — love
  l1: "touch",
  l2: "quality",
  l3: "very",
  l4: "lot",
  l5: "Physical closeness and little check-ins through the day. A hand on my shoulder when you walk past says more than a paragraph.",
  // 9 — jealousy
  j1: 8,
  j2: "transparency",
  j3: "yes_boundaries",
  j4: "Full transparency about who you're texting. I don't need passwords, I need to never feel like I should ask for them.",
  // 10 — intentions
  i1: "serious",
  i2: "Travel nursing for a year, then settling somewhere with good light and bad traffic. In a relationship that's already talked about forever out loud.",
  i3: "Being someone's safe place and letting them be mine. Saying the hard thing instead of the convenient thing.",
  i4: "yes_100",
  // 11 — accountability
  a1: "own_fully",
  a2: "listen_improve",
  a3: "no_therapy",
  a4: "admit_apologize",
  // 12 — initiative
  n1: "research_book",
  n2: "few_week",
  n3: "comfort_showup",
  // 13 — reflection
  r1: "Because I'll love loudly and loyally. You'll never wonder where you stand with me — I say it, show it, and repeat.",
  r2: "I will never make you guess how I feel. If something's wrong, you'll hear it from me first, kindly.",
  r3: "I would never go through someone's phone behind their back. Dignity matters, even on the worst day.",
  r4: "Sunrise hike with coffee in thermoses, back in town for a greasy breakfast, then a bookstore crawl where we pick a book for each other. Home, blanket fort, movie we both mock.",
  r5: "Roll over, take their hand, and say 'we're on the same team'. Arguments end before sleep, even if the resolution has to wait for morning.",
  r6: "Soup, their favorite blanket, and me running interference with the outside world until they're ready to re-enter it.",
  r7: "To build something worth writing home about. I did the casual era; I'm here for the keep-each-other era.",
  r8: "I feel things at full volume. When I'm happy it's obvious, and when I'm hurt it's obvious. I'll never make you decode me.",
};
