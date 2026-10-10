import type {
  AnswerValue,
  CategoryRow,
  FlagItem,
  Participant,
  RatingPair,
  ReportResult,
  ReportTone,
} from "../types";
import { labelOf, shortOf } from "../data/questions";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const num = (v: AnswerValue | undefined, d = 5): number =>
  typeof v === "number" && !Number.isNaN(v) ? v : d;

const str = (v: AnswerValue | undefined, d = ""): string =>
  typeof v === "string" ? v : d;

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const round = (n: number) => Math.round(n);

const avg = (...ns: number[]) => ns.reduce((a, b) => a + b, 0) / ns.length;

const statusOf = (alignment: number): CategoryRow["status"] =>
  alignment >= 80 ? "good" : alignment >= 55 ? "warn" : "bad";

const toneColor = (v: number): number => clamp(100 - Math.abs(v) * 12, 12, 100);

/* ------------------------------------------------------------------ */
/* Pair matrices                                                       */
/* ------------------------------------------------------------------ */

function pairScore(a: string, b: string, table: Record<string, number>, dflt = 60): number {
  if (a === b) return 100;
  const key1 = `${a}|${b}`;
  const key2 = `${b}|${a}`;
  if (table[key1] !== undefined) return table[key1];
  if (table[key2] !== undefined) return table[key2];
  return dflt;
}

const DATES_PAIR: Record<string, number> = {
  "dont-mind|take-turns": 88,
  "dont-mind|fifty-fifty": 85,
  "dont-mind|partner-pays": 80,
  "take-turns|fifty-fifty": 72,
  "take-turns|partner-pays": 55,
  "fifty-fifty|partner-pays": 38,
};

const AFFECTION_PAIR: Record<string, number> = {
  "very|moderate": 82,
  "very|shy": 58,
  "very|dont-touch": 22,
  "moderate|shy": 68,
  "moderate|dont-touch": 36,
  "shy|dont-touch": 44,
};

const INTENTIONS_PAIR: Record<string, number> = {
  "serious|marriage": 90,
  "serious|friendship": 40,
  "serious|casual": 22,
  "serious|curious": 30,
  "marriage|casual": 18,
  "marriage|friendship": 42,
  "marriage|curious": 28,
  "casual|friendship": 74,
  "casual|curious": 70,
  "friendship|curious": 78,
  "serious|dont-know": 52,
  "marriage|dont-know": 50,
  "casual|dont-know": 58,
};

const PHONE_PAIR: Record<string, number> = {
  "no|reason": 75,
  "no|everything": 25,
  "reason|everything": 45,
};

const FRIENDS_PAIR: Record<string, number> = {
  "yes|depends": 80,
  "no|depends": 55,
  "yes|no": 30,
};

const FREQ_ORDER = ["all-day", "throughout", "morning-evening", "when-remember"];

const SCORE_MAPS: Record<string, Record<string, number>> = {
  s4_busy: { ignore: 25, "tell-later": 100, "quick-text": 90, mood: 50 },
  s3_upset: { absolutely: 100, "time-communicate": 82, disappear: 18 },
  s3_hurt: { "listen-apologize": 100, "explain-then-apologize": 76, "get-defensive": 32, "too-sensitive": 8 },
  s10_loyal: { yes: 100, thinking: 55, no: 15 },
  s11_apology: { yes: 100, attacked: 38, no: 30 },
  s7_responsible: { yes: 100, trying: 80, "needs-prayer": 55 },
};

const mapScore = (map: Record<string, number>, v: string, dflt = 60): number =>
  map[v] !== undefined ? map[v] : dflt;

/* ------------------------------------------------------------------ */
/* Main engine                                                         */
/* ------------------------------------------------------------------ */

const RATING_FIELDS: { id: string; label: string }[] = [
  { id: "s6_comm", label: "Communication" },
  { id: "s6_loyalty", label: "Loyalty" },
  { id: "s6_affection", label: "Affection" },
  { id: "s6_romance", label: "Romance" },
  { id: "s6_patience", label: "Patience" },
  { id: "s6_support", label: "Emotional support" },
  { id: "s6_consistency", label: "Consistency" },
  { id: "s6_humor", label: "Humor" },
  { id: "s6_dates", label: "Date planning" },
];

export function computeReport(pa: Participant, pb: Participant): ReportResult {
  const A = pa.answers;
  const B = pb.answers;

  /* ---------------- 1. Dealbreaker flags (discussion, not rejection) -------- */
  const flags: FlagItem[] = [];
  const whoHas = (pred: (x: Participant["answers"]) => boolean) =>
    pred(A) && pred(B) ? 2 : pred(A) || pred(B) ? 1 : 0;

  if (whoHas((x) => x.s5_cheat === "not-cheating")) {
    flags.push({
      id: "fidelity",
      title: "FIDELITY DEFINITIONS NEED ALIGNMENT",
      detail:
        '"It\'s not cheating if…" appeared in the file. Before anything else, agree — out loud — on what crosses the line.',
    });
  }
  if (whoHas((x) => x.s5_entertain === "attention")) {
    flags.push({
      id: "attention",
      title: "OUTSIDE ATTENTION VS. EXCLUSIVITY",
      detail:
        "One applicant enjoys outside attention while in a relationship. That collides with most definitions of exclusivity and must be discussed directly.",
    });
  }
  if (
    (A.s3_upset === "disappear" && B.s3_upset === "absolutely") ||
    (B.s3_upset === "disappear" && A.s3_upset === "absolutely")
  ) {
    flags.push({
      id: "storm-gap",
      title: "CONFLICT-RESPONSE GAP",
      detail:
        "One of you communicates immediately when upset; the other disappears for 3 business days. Without an agreed protocol, every argument will feel one-sided.",
    });
  }
  if (
    (A.s9_phone === "everything" && B.s9_phone === "no") ||
    (B.s9_phone === "everything" && A.s9_phone === "no")
  ) {
    flags.push({
      id: "privacy",
      title: "PRIVACY EXPECTATIONS CLASH",
      detail:
        "One applicant expects full phone access; the other expects full privacy. Surveillance and secrecy are both symptoms — talk about the trust underneath.",
    });
  }

  /* ---------------- 2. Exact matches (+10 each) ----------------------------- */
  const synergies: string[] = [];
  let points = 0;

  const exact = (qid: string, text: string) => {
    if (A[qid] !== undefined && A[qid] === B[qid]) {
      points += 10;
      synergies.push(text);
      return true;
    }
    return false;
  };

  exact("s10_why", `Identical intentions: both of you are here for "${labelOf("s10_why", A.s10_why)}". The most expensive mismatch in dating simply does not exist here.`);
  exact("s7_dates", `Same date-payment philosophy (${shortOf("s7_dates", A.s7_dates)}). Zero awkward check-dropping predicted.`);
  exact("s4_freq", `Matching communication rhythm (${shortOf("s4_freq", A.s4_freq)}). Neither of you will be staring at a silent phone wondering.`);
  exact("s8_love_lang", `You speak the same love language: ${labelOf("s8_love_lang", A.s8_love_lang)}. Affection will land without translation.`);

  /* ---------------- 3. Complementary matches (+15 each) --------------------- */
  const MAX_COMPLEMENTARY = 2;
  if (
    (A.s8_love_lang === "touch" && B.s8_affection === "very") ||
    (B.s8_love_lang === "touch" && A.s8_affection === "very")
  ) {
    points += 15;
    synergies.push(
      `Complementary wiring: one of you runs on physical touch and the other describes themselves as "very affectionate". Natural fit.`
    );
  } else if (A.s8_love_lang === B.s8_love_lang) {
    // already counted as exact — no double bonus
  } else if (A.s8_love_lang === "all" || B.s8_love_lang === "all") {
    points += 15;
    synergies.push(
      `One applicant selected "All of the above" as a love language — every dialect the other speaks will be understood.`
    );
  }

  if (A.s8_reassurance !== undefined && A.s8_reassurance === B.s8_reassurance) {
    points += 15;
    synergies.push(
      `Equal reassurance needs (${shortOf("s8_reassurance", A.s8_reassurance)}). Neither of you will feel clingy, and neither will feel starved.`
    );
  }

  if (A.s11_apology === "yes" && B.s11_apology === "yes") {
    synergies.push('Both of you can apologize without a trailing "but you…". This single skill quietly determines whether arguments repair or erode.');
  }

  /* ---------------- 4. Rating deltas (+5 / 0 / −10) ------------------------- */
  const ratingPairs: RatingPair[] = [];
  let alignedCount = 0;
  let loyalFloor = Infinity;
  for (const f of RATING_FIELDS) {
    const va = num(A[f.id]);
    const vb = num(B[f.id]);
    const delta = Math.abs(va - vb);
    ratingPairs.push({ label: f.label, a: va, b: vb, delta });
    if (delta <= 2) {
      points += 5;
      alignedCount += 1;
    } else if (delta >= 5) {
      points -= 10;
    }
  }
  loyalFloor = Math.min(num(A.s6_loyalty), num(B.s6_loyalty));

  if (alignedCount >= 7) {
    synergies.push(`Your self-assessments are nearly identical (${alignedCount} of 9 within ±2 points). You see yourselves — and likely each other — the same way.`);
  }
  if (loyalFloor >= 8 && A.s5_cheat === "no" && B.s5_cheat === "no") {
    synergies.push("Both rate their loyalty 8+ and both answered \"No\" to cheating, unprompted. Trust has a solid foundation to stand on.");
  }

  /* ---------------- Engine score (normalized 0–100) ------------------------- */
  const MAX_POINTS = 4 * 10 + 9 * 5 + MAX_COMPLEMENTARY * 15; // 40 + 45 + 30 = 115
  const MIN_POINTS = -90;
  const engineScore = clamp(round(((points - MIN_POINTS) / (MAX_POINTS - MIN_POINTS)) * 100));

  /* ---------------- Category breakdown -------------------------------------- */
  const categories: CategoryRow[] = [];

  // Communication
  {
    const freqIdx = (v: string) => Math.max(0, FREQ_ORDER.indexOf(v));
    const df = Math.abs(freqIdx(str(A.s4_freq, "throughout")) - freqIdx(str(B.s4_freq, "throughout")));
    const freqScore = clamp(100 - df * 22, 30, 100);
    const busyScore = avg(mapScore(SCORE_MAPS.s4_busy, str(A.s4_busy, "mood")), mapScore(SCORE_MAPS.s4_busy, str(B.s4_busy, "mood")));
    const sliderScore = toneColor(num(A.s6_comm) - num(B.s6_comm));
    const alignment = round(sliderScore * 0.4 + freqScore * 0.35 + busyScore * 0.25);
    categories.push({
      key: "communication",
      name: "Communication",
      aDisplay: `${num(A.s6_comm)}/10`,
      bDisplay: `${num(B.s6_comm)}/10`,
      alignment,
      status: statusOf(alignment),
    });
  }

  // Emotional intelligence
  {
    const upsetA = str(A.s3_upset, "time-communicate");
    const upsetB = str(B.s3_upset, "time-communicate");
    let upsetScore = avg(mapScore(SCORE_MAPS.s3_upset, upsetA), mapScore(SCORE_MAPS.s3_upset, upsetB));
    if ((upsetA === "disappear" && upsetB === "absolutely") || (upsetA === "absolutely" && upsetB === "disappear")) upsetScore = Math.min(upsetScore, 25);
    const hurtScore = avg(
      mapScore(SCORE_MAPS.s3_hurt, str(A.s3_hurt, "get-defensive")),
      mapScore(SCORE_MAPS.s3_hurt, str(B.s3_hurt, "get-defensive"))
    );
    const sliderScore = toneColor((Math.abs(num(A.s6_patience) - num(B.s6_patience)) + Math.abs(num(A.s6_support) - num(B.s6_support))) / 2);
    const alignment = round(upsetScore * 0.3 + hurtScore * 0.3 + sliderScore * 0.4);
    categories.push({
      key: "emotional",
      name: "Emotional Intelligence",
      aDisplay: `${round((num(A.s6_patience) + num(A.s6_support)) / 2)}/10`,
      bDisplay: `${round((num(B.s6_patience) + num(B.s6_support)) / 2)}/10`,
      alignment,
      status: statusOf(alignment),
    });
  }

  // Financial values
  {
    const datesScore = pairScore(str(A.s7_dates, "take-turns"), str(B.s7_dates, "take-turns"), DATES_PAIR);
    const jobA = str(A.s7_job, "looking");
    const jobB = str(B.s7_job, "looking");
    const jobScore = jobA === jobB ? (jobA === "yes" ? 100 : 72) : jobA === "no" || jobB === "no" ? 58 : 78;
    const respScore = avg(mapScore(SCORE_MAPS.s7_responsible, str(A.s7_job ? A.s7_responsible : undefined, "trying")), mapScore(SCORE_MAPS.s7_responsible, str(B.s7_responsible, "trying")));
    const alignment = round(datesScore * 0.5 + jobScore * 0.2 + respScore * 0.3);
    categories.push({
      key: "financial",
      name: "Financial Values",
      aDisplay: shortOf("s7_dates", A.s7_dates),
      bDisplay: shortOf("s7_dates", B.s7_dates),
      alignment,
      status: statusOf(alignment),
    });
  }

  // Love language & affection
  {
    const langA = str(A.s8_love_lang, "quality");
    const langB = str(B.s8_love_lang, "quality");
    const langScore = langA === langB ? 100 : langA === "all" || langB === "all" ? 90 : 58;
    const affScore = pairScore(str(A.s8_affection, "moderate"), str(B.s8_affection, "moderate"), AFFECTION_PAIR);
    const alignment = round(langScore * 0.65 + affScore * 0.35);
    categories.push({
      key: "love",
      name: "Love Language",
      aDisplay: shortOf("s8_love_lang", A.s8_love_lang),
      bDisplay: shortOf("s8_love_lang", B.s8_love_lang),
      alignment,
      status: statusOf(alignment),
    });
  }

  // Intentions
  {
    const alignment = round(pairScore(str(A.s10_why, "dont-know"), str(B.s10_why, "dont-know"), INTENTIONS_PAIR, 45));
    categories.push({
      key: "intentions",
      name: "Intentions",
      aDisplay: shortOf("s10_why", A.s10_why),
      bDisplay: shortOf("s10_why", B.s10_why),
      alignment,
      status: statusOf(alignment),
    });
  }

  // Jealousy & boundaries
  {
    const jealousyScore = toneColor(num(A.s9_jealousy) - num(B.s9_jealousy));
    const phoneScore = pairScore(str(A.s9_phone, "reason"), str(B.s9_phone, "reason"), PHONE_PAIR);
    const friendsScore = pairScore(str(A.s9_friends, "depends"), str(B.s9_friends, "depends"), FRIENDS_PAIR);
    const alignment = round(jealousyScore * 0.5 + phoneScore * 0.3 + friendsScore * 0.2);
    categories.push({
      key: "jealousy",
      name: "Jealousy & Boundaries",
      aDisplay: `${num(A.s9_jealousy)}/10`,
      bDisplay: `${num(B.s9_jealousy)}/10`,
      alignment,
      status: statusOf(alignment),
    });
  }

  // Accountability
  {
    const alignment = round(
      avg(mapScore(SCORE_MAPS.s11_apology, str(A.s11_apology, "no")), mapScore(SCORE_MAPS.s11_apology, str(B.s11_apology, "no")))
    );
    categories.push({
      key: "accountability",
      name: "Accountability",
      aDisplay: shortOf("s11_apology", A.s11_apology),
      bDisplay: shortOf("s11_apology", B.s11_apology),
      alignment,
      status: statusOf(alignment),
    });
  }

  // Red flags
  {
    const severity = (x: Participant["answers"]): number => {
      let s = 0;
      if (x.s5_cheat === "not-cheating") s += 2;
      else if (x.s5_cheat === "sometimes") s += 1.5;
      if (x.s5_entertain === "attention") s += 1.5;
      else if (x.s5_entertain === "sometimes") s += 0.75;
      if (x.s5_flirt === "yes") s += 0.75;
      else if (x.s5_flirt === "bored") s += 0.5;
      if (x.s5_lie === "everyone-lies") s += 1;
      else if (x.s5_lie === "sometimes") s += 0.25;
      if (x.s5_anger === "sometimes") s += 0.5;
      return s;
    };
    const sevA = severity(A);
    const sevB = severity(B);
    const alignment = clamp(round(100 - (sevA + sevB) * 16), 10, 100);
    const disp = (sev: number) => (sev < 0.75 ? "None noted" : `${Math.max(1, Math.round(sev))} noted`);
    categories.push({
      key: "redflags",
      name: "Red Flags",
      aDisplay: disp(sevA),
      bDisplay: disp(sevB),
      alignment,
      status: statusOf(alignment),
    });
  }

  /* ---------------- Overall (engine + category mean, minus flag penalty) ----- */
  const catMean = avg(...categories.map((c) => c.alignment));
  const overall = clamp(round(engineScore * 0.55 + catMean * 0.45 - flags.length * 12));

  /* ---------------- Label & descriptor (match-focused only) ------------------ */
  let label: string;
  let descriptor: string;
  let tone: ReportTone;
  if (flags.length > 0) {
    label = "CONFLICT OF VALUES — IMPORTANT CONVERSATION NEEDED";
    descriptor =
      "One or more value conflicts were flagged in the files. This is not a rejection — it is a mandatory conversation, to be held before this match proceeds any further.";
    tone = "red";
  } else if (overall >= 90) {
    label = "EXCELLENT ALIGNMENT — READY FOR DATING";
    descriptor =
      "Cross-verified applications show exceptional alignment across nearly every measured dimension. Department recommendation: proceed directly to dating.";
    tone = "emerald";
  } else if (overall >= 70) {
    label = "GOOD MATCH — COMMUNICATION RECOMMENDED";
    descriptor =
      "Strong structural alignment with a handful of negotiable friction points. Department recommendation: proceed, with open communication about the items below.";
    tone = "emerald";
  } else if (overall >= 50) {
    label = "MODERATE MATCH — AREAS TO WORK ON TOGETHER";
    descriptor =
      "A workable foundation with several areas that will require joint effort and early, honest conversation. Progress is possible if both applicants commit to the work.";
    tone = "amber";
  } else {
    label = "LOW ALIGNMENT — MAJOR DIFFERENCES DISCOVERED";
    descriptor =
      "Significant differences detected across core dimensions. This does not judge either applicant — it reports that this particular pairing would require substantial negotiation.";
    tone = "slate";
  }

  /* ---------------- Frictions (growth framing, never verdicts) --------------- */
  const frictions: string[] = [];
  for (const f of flags) frictions.push(f.detail);

  if (A.s8_love_lang !== B.s8_love_lang && A.s8_love_lang !== "all" && B.s8_love_lang !== "all") {
    frictions.push(
      `Different love languages (${shortOf("s8_love_lang", A.s8_love_lang)} vs. ${shortOf("s8_love_lang", B.s8_love_lang)}). Love will be sent — but may need subtitles to be received.`
    );
  }
  const jDelta = Math.abs(num(A.s9_jealousy) - num(B.s9_jealousy));
  if (jDelta >= 3) {
    frictions.push(
      `A jealousy gap of ${jDelta} points (${num(A.s9_jealousy)}/10 vs. ${num(B.s9_jealousy)}/10). One of you will relax sooner than the other — agree on what reassurance is fair.`
    );
  }
  if (A.s4_freq !== B.s4_freq) {
    frictions.push(
      `Different communication rhythms (${shortOf("s4_freq", A.s4_freq)} vs. ${shortOf("s4_freq", B.s4_freq)}). Set an expectation now so silence never gets misread later.`
    );
  }
  for (const rp of ratingPairs) {
    if (rp.delta >= 3 && frictions.length < 7) {
      frictions.push(
        `${rp.label}: self-rated ${rp.a}/10 vs. ${rp.b}/10. A ${rp.delta}-point gap means this will be felt differently by each of you — worth calibrating early.`
      );
    }
  }
  if (A.s10_why !== B.s10_why) {
    frictions.push(
      `Stated intentions differ ("${labelOf("s10_why", A.s10_why)}" vs. "${labelOf("s10_why", B.s10_why)}"). Align on the destination before planning the route.`
    );
  }
  if (frictions.length === 0) {
    frictions.push("No significant friction detected in the files. Even so — keep talking. The best matches are maintained, not found.");
  }

  /* ---------------- Conversation starters ------------------------------------ */
  const starters: string[] = [];
  const catStatus = (key: string) => categories.find((c) => c.key === key)?.status;
  if (flags.length > 0) {
    starters.push('"Which answer in my file surprised you the most — and what\'s the real story behind it?"');
  }
  if (catStatus("love") !== "good" || A.s8_love_lang !== B.s8_love_lang) {
    starters.push('"What is one specific, small thing that instantly makes you feel loved — and how will I know when you need it?"');
  }
  if (catStatus("jealousy") !== "good" || jDelta >= 3) {
    starters.push('"What boundaries would make both of us feel secure without either of us feeling monitored?"');
  }
  if (catStatus("communication") !== "good" || A.s4_freq !== B.s4_freq) {
    starters.push('"When you go quiet, what does it usually mean — and what would you like me to do with that silence?"');
  }
  if (catStatus("intentions") !== "good" || A.s10_why !== B.s10_why) {
    starters.push('"Where do we each honestly want this to be in two years — and what would make us get there together?"');
  }
  if (catStatus("financial") !== "good" || A.s7_dates !== B.s7_dates) {
    starters.push('"What does a fair way of handling money together actually look like to you — dates, trips, the future?"');
  }
  if (A.s8_reassurance !== B.s8_reassurance) {
    starters.push('"How do you like to be reassured when you\'re doubting us — words, time, touch, or space?"');
  }
  if (starters.length === 0) {
    starters.push('"Of everything we agree on, which one matters most to protect as this grows?"');
    starters.push('"What did your last relationship teach you that you want us to benefit from?"');
  }

  return {
    overall,
    engineScore,
    label,
    descriptor,
    tone,
    flags,
    categories,
    synergies: synergies.slice(0, 8),
    frictions: frictions.slice(0, 7),
    starters: starters.slice(0, 5),
    ratingPairs,
    generatedAt: Date.now(),
  };
}
