import type { AnswerMap } from "../types/form";
import type {
  CategoryBreakdownRow,
  CategoryKey,
  QuestionContribution,
  ReportInput,
  ScoringResult,
  StatusTone,
} from "../types/report";
import { CATEGORIES, QUESTION_RULES, categoryMax, type QuestionRule } from "./scoring-rules";
import { FORM_STEPS, getOptionLabel, getQuestion } from "../data/questions";
import { CATEGORY_STARTERS, FLAG_STARTERS, GENERAL_STARTERS } from "../data/conversation-starters";
import { clamp, isSubstantiveText, truncate } from "./utils";

/* ------------------------------------------------------------------ */
/* Atomic scorers                                                      */
/* ------------------------------------------------------------------ */

function sliderPoints(delta: number): number {
  if (delta <= 1) return 8;
  if (delta === 2) return 5;
  if (delta === 3) return 2;
  if (delta === 4) return 0;
  if (delta <= 6) return -5;
  return -10;
}

function num(v: unknown, fallback = 5): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : v === undefined ? "" : String(v);
}

function ordinalPoints(rule: QuestionRule, a: string, b: string): number {
  const order = rule.order ?? [];
  const ia = order.indexOf(a);
  const ib = order.indexOf(b);
  if (ia === -1 || ib === -1) return Math.round(rule.max * 0.5);
  const dist = Math.abs(ia - ib);
  const frac = 1 - dist / Math.max(1, order.length - 1);
  return Math.round(rule.max * frac);
}

function loveLanguagePoints(a1: string, b1: string, a2: string, b2: string, max: number): number {
  if (!a1 || !b1) return Math.round(max * 0.5);
  if (a1 === b1) return max;
  if (a1 === "all" || b1 === "all") return max - 1;
  if (a1 === b2 || b1 === a2) return max - 2;
  return Math.round(max * 0.4);
}

interface FlagDef {
  key: string;
  message: string;
}

/* ------------------------------------------------------------------ */
/* Display helpers                                                     */
/* ------------------------------------------------------------------ */

const TEXT_IDS = new Set(
  FORM_STEPS.flatMap((s) => s.questions.filter((q) => q.type === "textarea" || q.type === "text").map((q) => q.id))
);

function displayAnswer(id: string, answers: AnswerMap): string {
  const v = answers[id];
  if (v === undefined || v === "") return "—";
  const q = getQuestion(id);
  if (q?.type === "slider") return `${v}/10`;
  if (q?.type === "select") return truncate(getOptionLabel(id, v), 44);
  if (TEXT_IDS.has(id)) return isSubstantiveText(v) ? truncate(str(v), 60) : "Minimal response";
  return truncate(str(v), 44);
}

const HEADLINES: Record<CategoryKey, string[]> = {
  communication: ["c2", "s1"],
  emotional: ["e3", "s6"],
  values: ["i1", "h3"],
  financial: ["f2", "f3"],
  love: ["l1", "l3"],
  boundaries: ["j2", "d1"],
  accountability: ["a1", "a3"],
};

function categorySummary(category: CategoryKey, answers: AnswerMap): string {
  return HEADLINES[category]
    .map((id) => {
      const q = getQuestion(id);
      if (!q) return "";
      const v = answers[id];
      if (v === undefined || v === "") return "—";
      if (q.type === "slider") return `${id === "s6" ? "Support" : id === "s1" ? "Skills" : "Rating"} ${v}/10`;
      return truncate(getOptionLabel(id, v), 26);
    })
    .join(" · ");
}

/* ------------------------------------------------------------------ */
/* Stance scoring (per-person radar overlay)                           */
/* ------------------------------------------------------------------ */

function stanceValue(rule: QuestionRule, answers: AnswerMap): number {
  const v = answers[rule.id];
  switch (rule.kind) {
    case "slider":
      return clamp((num(v, 5) - 1) / 9, 0, 1);
    case "ordinal": {
      const order = rule.order ?? [];
      const idx = order.indexOf(str(v));
      if (idx === -1) return 0.6;
      return 1 - idx / Math.max(1, order.length - 1);
    }
    case "categorical": {
      const map: Record<string, number> = {
        memes_voice: 0.85,
        long_thoughtful: 1,
        short_frequent: 0.8,
        in_person: 0.7,
      };
      return map[str(v)] ?? 0.75;
    }
    case "lovelang":
      return str(v) === "all" ? 1 : 0.8;
    case "lovesecondary":
      return 0.8;
    case "text":
      return isSubstantiveText(v) ? 0.9 : str(v).trim() === "" ? 0.55 : 0.4;
    default:
      return 0.6;
  }
}

/* ------------------------------------------------------------------ */
/* Main engine                                                         */
/* ------------------------------------------------------------------ */

export function computeCompatibility(input: ReportInput): ScoringResult {
  const { answersA, answersB } = input;

  const rawByCat = Object.fromEntries(CATEGORIES.map((c) => [c.key, 0])) as Record<CategoryKey, number>;
  const maxByCat = Object.fromEntries(CATEGORIES.map((c) => [c.key, categoryMax(c.key)])) as Record<CategoryKey, number>;
  const detailsByCat = Object.fromEntries(CATEGORIES.map((c) => [c.key, [] as QuestionContribution[]])) as Record<CategoryKey, QuestionContribution[]>;

  const synergy: string[] = [];
  const friction: string[] = [];
  const flags: FlagDef[] = [];

  let engagementGapDetected = false;

  const addDetail = (category: CategoryKey, d: QuestionContribution) => detailsByCat[category].push(d);

  /* ---------------- Per-question scoring ---------------- */

  for (const rule of QUESTION_RULES) {
    const q = getQuestion(rule.id);
    const label = q ? truncate(q.label, 60) : rule.id;
    let points = 0;
    let note = "";

    switch (rule.kind) {
      case "slider": {
        const a = num(answersA[rule.id]);
        const b = num(answersB[rule.id]);
        const delta = Math.abs(a - b);
        points = sliderPoints(delta);
        note =
          delta <= 1 ? "Nearly identical self-rating" :
          delta <= 3 ? "Close alignment" :
          delta <= 4 ? "Noticeable gap" :
          delta >= 7 ? "Major discrepancy" : "Significant gap";
        if (delta >= 7) {
          friction.push(
            `A major gap in self-rated “${label}” (${a}/10 vs ${b}/10) — worth understanding each other's self-perception here.`
          );
        }
        break;
      }
      case "ordinal": {
        const a = str(answersA[rule.id]);
        const b = str(answersB[rule.id]);
        points = ordinalPoints(rule, a, b);
        note = a === b ? "Exact match" : points >= rule.max * 0.6 ? "Compatible" : points >= rule.max * 0.34 ? "Some distance" : "Divergent views";
        break;
      }
      case "categorical": {
        const a = str(answersA[rule.id]);
        const b = str(answersB[rule.id]);
        points = a === b ? rule.max : Math.round(rule.max * 0.4);
        note = a === b ? "Exact match" : "Different styles — workable";
        break;
      }
      case "lovelang": {
        const a1 = str(answersA.l1), b1 = str(answersB.l1);
        const a2 = str(answersA.l2), b2 = str(answersB.l2);
        points = loveLanguagePoints(a1, b1, a2, b2, rule.max);
        note =
          a1 === b1 ? "Same primary language" :
          a1 === b2 || b1 === a2 ? "Primary matches secondary" :
          a1 === "all" || b1 === "all" ? "One partner speaks every language" :
          "Different primary languages";
        break;
      }
      case "lovesecondary": {
        const a2 = str(answersA.l2), b2 = str(answersB.l2);
        const a1 = str(answersA.l1), b1 = str(answersB.l1);
        if (a2 === b2) { points = rule.max; note = "Same secondary language"; }
        else if (a2 === b1 || b2 === a1) { points = rule.max - 1; note = "Crosses with primary"; }
        else if (a2 === "all" || b2 === "all" || a1 === "all" || b1 === "all") { points = rule.max - 1; note = "Flexible love languages"; }
        else { points = 2; note = "Different secondary languages"; }
        break;
      }
      case "text": {
        const a = answersA[rule.id];
        const b = answersB[rule.id];
        const aSub = isSubstantiveText(a);
        const bSub = isSubstantiveText(b);
        if (aSub && bSub) { points = rule.max; note = "Both answered thoughtfully"; }
        else if (aSub !== bSub) {
          points = Math.round(rule.max * 0.4);
          note = "Uneven depth of reflection";
          if (!engagementGapDetected) engagementGapDetected = true;
        } else { points = Math.round(rule.max * 0.5); note = "Both kept it brief"; }
        break;
      }
    }

    rawByCat[rule.category] += points;
    addDetail(rule.category, {
      questionId: rule.id,
      questionLabel: label,
      answerA: displayAnswer(rule.id, answersA),
      answerB: displayAnswer(rule.id, answersB),
      points,
      maxPoints: rule.max,
      note,
    });
  }

  /* ---------------- Complementary bonuses ---------------- */

  const bonus = (cat: CategoryKey, pts: number, line: string, qid: string) => {
    rawByCat[cat] += pts;
    synergy.push(line);
    const q = getQuestion(qid);
    detailsByCat[cat].push({
      questionId: `${qid}-bonus`,
      questionLabel: `Complementary fit: ${q ? truncate(q.label, 44) : qid}`,
      answerA: "",
      answerB: "",
      points: pts,
      maxPoints: pts,
      note: "Bonus",
    });
  };

  const aL1 = str(answersA.l1), bL1 = str(answersB.l1);
  const aL3 = str(answersA.l3), bL3 = str(answersB.l3);
  const aL4 = str(answersA.l4), bL4 = str(answersB.l4);

  if ((aL1 === "touch" && bL3 === "very") || (bL1 === "touch" && aL3 === "very")) {
    bonus("love", 12, "Beautiful fit: one partner's primary language is physical touch, and the other is naturally very affectionate.", "l1");
  }
  if ((aL1 === "words" && bL4 === "lot") || (bL1 === "words" && aL4 === "lot")) {
    bonus("love", 10, "Strong fit: one partner needs frequent verbal reassurance, and the other leads with words of affirmation.", "l1");
  }
  if ((aL1 === "acts" && str(answersB.n1) === "research_book") || (bL1 === "acts" && str(answersA.n1) === "research_book")) {
    bonus("love", 10, "Strong fit: one partner feels loved through acts of service, and the other plans thoughtful dates proactively.", "n1");
  }
  if ((str(answersA.e3) === "time_then_open" && str(answersB.e4) === "cooldown") ||
      (str(answersB.e3) === "time_then_open" && str(answersA.e4) === "cooldown")) {
    bonus("emotional", 10, "Compatible conflict styles: one needs a beat before opening up, and the other naturally cools down before revisiting.", "e3");
  }
  if (aL4 === "lot" && bL4 === "lot") {
    bonus("love", 8, "You both value frequent reassurance — neither of you will feel needy for asking.", "l4");
  }
  if ((str(answersA.a1) === "own_fully" && str(answersB.a2) === "listen_improve") ||
      (str(answersB.a1) === "own_fully" && str(answersA.a2) === "listen_improve")) {
    bonus("accountability", 10, "One owns mistakes fully while the other listens and improves — a strong repair dynamic.", "a1");
  }

  /* ---------------- Dealbreaker flag detection ---------------- */

  const bothIn = (ids: [string, string], setA: string[], setB: string[]) =>
    (setA.includes(str(answersA[ids[0]])) && setB.includes(str(answersB[ids[1]]))) ||
    (setA.includes(str(answersB[ids[0]])) && setB.includes(str(answersA[ids[1]])));

  if (str(answersA.d1) === "not_cheating_if" || str(answersB.d1) === "not_cheating_if") {
    flags.push({ key: "cheating_definition", message: "One partner's definition of cheating may differ significantly from the other's." });
  }
  if (str(answersA.d2) === "like_attention" || str(answersB.d2) === "like_attention") {
    flags.push({ key: "outside_attention", message: "Differing views on engaging with romantic attention outside the relationship." });
  }
  if (bothIn(["e3", "e3"], ["clear_calm"], ["disappear"])) {
    flags.push({ key: "emotional_communication_gap", message: "A significant gap exists in how you communicate during emotional difficulty." });
  }
  if (bothIn(["j2", "j2"], ["trust"], ["everything"])) {
    flags.push({ key: "privacy_expectations", message: "Very different expectations around privacy and transparency." });
  }
  if (bothIn(["i1", "i1"], ["serious", "marriage"], ["curious", "unknown"])) {
    flags.push({ key: "intention_gap", message: "Your relationship intentions appear to be at different levels of seriousness." });
  }
  if (bothIn(["a3", "a3"], ["absolutely"], ["no_therapy"])) {
    flags.push({ key: "therapy_views", message: "Different perspectives on seeking professional support for the relationship." });
  }
  if (str(answersA.i4) === "think_honestly" || str(answersB.i4) === "think_honestly") {
    flags.push({ key: "commitment_readiness", message: "One partner is uncertain about their readiness for commitment — an honest conversation would be valuable." });
  }

  /* ---------------- Red-flag cross-referencing ---------------- */

  const aD4 = str(answersA.d4), bD4 = str(answersB.d4);
  if (aD4 !== "no" && bD4 !== "no" && aD4 && bD4) {
    synergy.push("Both of you openly acknowledge working on emotional regulation — mutual self-awareness is a genuine asset.");
  } else if ((aD4 === "seeking_help" || aD4 === "heated") !== (bD4 === "seeking_help" || bD4 === "heated") && (aD4 === "seeking_help" || aD4 === "heated" || bD4 === "seeking_help" || bD4 === "heated")) {
    friction.push("There's a difference in self-reported anger management — discussing this openly could build trust.");
  }

  if (engagementGapDetected) {
    friction.push("One partner appears to have invested more reflection in their written responses — this might simply reflect different processing styles, and is worth a gentle conversation.");
  }

  /* ---------------- Category rollups ---------------- */

  const categoryScores = {} as Record<CategoryKey, number>;
  const personAStance = {} as Record<CategoryKey, number>;
  const personBStance = {} as Record<CategoryKey, number>;

  for (const cat of CATEGORIES) {
    const raw = rawByCat[cat.key];
    categoryScores[cat.key] = clamp(Math.round((raw / maxByCat[cat.key]) * 100), 0, 100);

    const rules = QUESTION_RULES.filter((r) => r.category === cat.key);
    const meanOf = (answers: AnswerMap) =>
      rules.reduce((s, r) => s + stanceValue(r, answers), 0) / Math.max(1, rules.length);
    personAStance[cat.key] = Math.round(meanOf(answersA) * 100);
    personBStance[cat.key] = Math.round(meanOf(answersB) * 100);
  }

  /* ---------------- Synergy & friction from category scores ---------------- */

  const CATEGORY_SYNERGY: Record<CategoryKey, string> = {
    communication: "Your communication rhythms are closely aligned — expect fewer “why did you leave me on read” moments.",
    emotional: "You process and respond to emotions in remarkably compatible ways.",
    values: "Your core values and intentions point in the same direction.",
    financial: "You share a very similar philosophy on money, dates, and responsibility.",
    love: "The way you each give and receive love is strongly in sync.",
    boundaries: "Your boundaries, privacy expectations, and trust levels are well matched.",
    accountability: "You both take ownership and growth seriously — a rare and valuable combination.",
  };

  const CATEGORY_FRICTION: Record<CategoryKey, string> = {
    communication: "Your preferred communication rhythms differ — agreeing on expectations early will prevent misunderstandings.",
    emotional: "Your conflict-resolution styles differ somewhat — establishing a shared approach could strengthen your connection.",
    values: "Your stated intentions aren't fully aligned yet — clarity now prevents confusion later.",
    financial: "Your money philosophies differ somewhat — aligning on a system early keeps it from becoming a stressor.",
    love: "Your love languages differ — this is an opportunity to learn each other's needs rather than a problem.",
    boundaries: "There's a gap in jealousy levels or boundary expectations — discussing this early will help you both feel secure.",
    accountability: "You differ on feedback and repair styles — agree on how you'll handle being wrong before you need to.",
  };

  for (const cat of CATEGORIES) {
    const score = categoryScores[cat.key];
    if (score >= 80) synergy.push(CATEGORY_SYNERGY[cat.key]);
    else if (score < 60) friction.push(CATEGORY_FRICTION[cat.key]);
  }

  /* Specific alignment synergies */
  if (str(answersA.i1) === str(answersB.i1) && ["serious", "marriage"].includes(str(answersA.i1))) {
    synergy.unshift("Both of you are here with serious, committed intentions — the most important box is ticked.");
  }
  if (str(answersA.f2) === str(answersB.f2)) {
    synergy.push("You even agree on who pays for dates — a classic stress point, already settled.");
  }
  if (Math.abs(num(answersA.s2) - num(answersB.s2)) <= 1) {
    synergy.push("Your loyalty self-ratings are nearly identical.");
  }
  if (Math.abs(num(answersA.j1, 3) - num(answersB.j1, 3)) <= 2) {
    synergy.push("Your jealousy levels are closely matched — no one's the “jealous one” here.");
  }
  if (Math.abs(num(answersA.j1, 3) - num(answersB.j1, 3)) >= 4) {
    friction.push(`There's a gap in self-reported jealousy (${num(answersA.j1, 3)}/10 vs ${num(answersB.j1, 3)}/10) — talking about boundaries early will help you both feel secure.`);
  }

  /* ---------------- Overall score with flag capping ---------------- */

  let overall = CATEGORIES.reduce((sum, c) => sum + categoryScores[c.key] * c.weight, 0);
  if (flags.length === 1) overall = Math.min(overall, 75);
  if (flags.length >= 2) overall = Math.min(overall, 60);
  const overallScore = Math.round(overall);

  /* ---------------- Conversation starters ---------------- */

  const starters: string[] = [];
  const frictionCats = CATEGORIES.filter((c) => categoryScores[c.key] < 65).sort((a, b) => categoryScores[a.key] - categoryScores[b.key]);
  for (const cat of frictionCats) {
    const options = CATEGORY_STARTERS[cat.key];
    if (options && options.length) starters.push(options[0]);
    if (starters.length >= 4) break;
  }
  for (const flag of flags) {
    const s = FLAG_STARTERS[flag.key];
    if (s && !starters.includes(s)) starters.push(s);
    if (starters.length >= 6) break;
  }
  for (const g of GENERAL_STARTERS) {
    if (starters.length >= 5 && flags.length === 0) break;
    if (starters.length >= 6) break;
    if (!starters.includes(g) && starters.length < Math.max(4, Math.min(6, 3 + flags.length + frictionCats.length))) {
      starters.push(g);
    }
  }

  /* ---------------- Status label ---------------- */

  let statusLabel: string;
  let statusTone: StatusTone;
  if (flags.length >= 3) {
    statusLabel = "SIGNIFICANT VALUES DIFFERENCES — DEEP CONVERSATION NEEDED";
    statusTone = "low";
  } else if (overallScore >= 90) {
    statusLabel = "EXCELLENT ALIGNMENT — STRONG FOUNDATION FOR A RELATIONSHIP";
    statusTone = "excellent";
  } else if (overallScore >= 70) {
    statusLabel = "GOOD MATCH — SOLID BASE WITH ROOM FOR GROWTH";
    statusTone = "good";
  } else if (overallScore >= 50) {
    statusLabel = "MODERATE MATCH — IMPORTANT AREAS TO DISCUSS";
    statusTone = "moderate";
  } else if (overallScore >= 30) {
    statusLabel = "LOW ALIGNMENT — MAJOR DIFFERENCES DISCOVERED";
    statusTone = "low";
  } else {
    statusLabel = "MINIMAL ALIGNMENT — FUNDAMENTAL INCOMPATIBILITIES PRESENT";
    statusTone = "minimal";
  }

  /* ---------------- Category breakdown rows ---------------- */

  const categoryRows: CategoryBreakdownRow[] = CATEGORIES.map((cat) => ({
    key: cat.key,
    label: cat.label,
    weight: cat.weight,
    alignment: categoryScores[cat.key],
    personASummary: categorySummary(cat.key, answersA),
    personBSummary: categorySummary(cat.key, answersB),
    details: detailsByCat[cat.key],
  }));

  /* Dedupe while preserving order */
  const dedupe = (arr: string[]) => [...new Set(arr)];

  return {
    overallScore,
    categoryScores,
    personScores: { A: personAStance, B: personBStance },
    categoryRows,
    dealbreakerFlags: flags.map((f) => f.message),
    synergyHighlights: dedupe(synergy).slice(0, 7),
    frictionPoints: dedupe(friction).slice(0, 6),
    conversationStarters: dedupe(starters).slice(0, 6),
    statusLabel,
    statusTone,
    hasValuesConflict: flags.length > 0,
  };
}
