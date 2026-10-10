import type { CategoryKey } from "../types/report";

export interface CategoryDef {
  key: CategoryKey;
  label: string;
  weight: number;
}

export const CATEGORIES: CategoryDef[] = [
  { key: "communication", label: "Communication Style", weight: 0.15 },
  { key: "emotional", label: "Emotional Intelligence", weight: 0.2 },
  { key: "values", label: "Values & Intentions", weight: 0.2 },
  { key: "financial", label: "Financial Compatibility", weight: 0.1 },
  { key: "love", label: "Love & Affection", weight: 0.15 },
  { key: "boundaries", label: "Boundaries & Trust", weight: 0.1 },
  { key: "accountability", label: "Accountability & Growth", weight: 0.1 },
];

export type ScoringKind = "ordinal" | "categorical" | "slider" | "text" | "lovelang" | "lovesecondary";

export interface QuestionRule {
  id: string;
  category: CategoryKey;
  kind: ScoringKind;
  max: number;
  /** Answer-value sequence used for distance scoring (adjacent = compatible). */
  order?: string[];
}

/**
 * Every scored question. Max points follow the spec tiers:
 * high-impact exact match = 10, medium = 7, low = 4, slider = 8.
 */
export const QUESTION_RULES: QuestionRule[] = [
  // ---------------- Communication Style (15%) ----------------
  { id: "c1", category: "communication", kind: "ordinal", max: 4, order: ["reply_now", "quick_ack", "when_free", "mood", "ignore"] },
  { id: "c2", category: "communication", kind: "ordinal", max: 7, order: ["throughout", "checkins", "morning_night", "important", "whenever"] },
  { id: "c3", category: "communication", kind: "ordinal", max: 7, order: ["love_calls", "scheduled", "depends_who", "texting", "emergency"] },
  { id: "c4", category: "communication", kind: "categorical", max: 4 },
  { id: "s1", category: "communication", kind: "slider", max: 8 },

  // ---------------- Emotional Intelligence (20%) ----------------
  { id: "e1", category: "emotional", kind: "ordinal", max: 7, order: ["calm", "space_first", "write_out", "shutdown", "loud"] },
  { id: "e2", category: "emotional", kind: "ordinal", max: 7, order: ["sorry_more", "hear_you", "need_moment", "but_you_too", "too_sensitive"] },
  { id: "e3", category: "emotional", kind: "ordinal", max: 7, order: ["clear_calm", "time_then_open", "withdraw", "disappear"] },
  { id: "e4", category: "emotional", kind: "ordinal", max: 7, order: ["immediate", "cooldown", "seek_input", "depends", "avoid"] },
  { id: "s5", category: "emotional", kind: "slider", max: 8 },
  { id: "s6", category: "emotional", kind: "slider", max: 8 },

  // ---------------- Values & Intentions (20%) ----------------
  { id: "i1", category: "values", kind: "ordinal", max: 10, order: ["marriage", "serious", "friendship", "exploring", "unknown", "curious"] },
  { id: "i4", category: "values", kind: "ordinal", max: 10, order: ["yes_100", "yes_work", "struggled", "think_honestly"] },
  { id: "h3", category: "values", kind: "ordinal", max: 7, order: ["completely", "mostly", "check_page", "not_really"] },
  { id: "h5", category: "values", kind: "text", max: 6 },
  { id: "i2", category: "values", kind: "text", max: 6 },
  { id: "i3", category: "values", kind: "text", max: 6 },

  // ---------------- Financial Compatibility (10%) ----------------
  { id: "f1", category: "financial", kind: "ordinal", max: 4, order: ["employed", "self_employed", "student", "between", "pnts"] },
  { id: "f2", category: "financial", kind: "ordinal", max: 10, order: ["cover", "turns", "fifty_fifty", "suggester", "partner_pays"] },
  { id: "f3", category: "financial", kind: "ordinal", max: 4, order: ["budget_save", "comfortable_no_plan", "trying_tough", "needs_prayer"] },
  { id: "f4", category: "financial", kind: "ordinal", max: 6, order: ["very", "trying_ok", "build_together", "love_enough"] },

  // ---------------- Love & Affection (15%) ----------------
  { id: "l1", category: "love", kind: "lovelang", max: 10 },
  { id: "l2", category: "love", kind: "lovesecondary", max: 4 },
  { id: "l3", category: "love", kind: "ordinal", max: 7, order: ["very", "private", "shy_warmup", "different_way", "no_touch"] },
  { id: "l4", category: "love", kind: "ordinal", max: 4, order: ["lot", "some", "minimal", "unsure"] },
  { id: "s3", category: "love", kind: "slider", max: 8 },
  { id: "s4", category: "love", kind: "slider", max: 8 },
  { id: "l5", category: "love", kind: "text", max: 4 },
  { id: "s10", category: "love", kind: "text", max: 4 },
  { id: "s11", category: "love", kind: "text", max: 4 },
  { id: "n3", category: "love", kind: "ordinal", max: 6, order: ["comfort_showup", "talk_through", "figure_out", "give_space"] },

  // ---------------- Boundaries & Trust (10%) ----------------
  { id: "j1", category: "boundaries", kind: "slider", max: 8 },
  { id: "j2", category: "boundaries", kind: "ordinal", max: 7, order: ["trust", "strong_reason", "transparency", "everything"] },
  { id: "j3", category: "boundaries", kind: "ordinal", max: 7, order: ["yes_trust", "yes_boundaries", "uncomfortable_try", "not_appropriate"] },
  { id: "d1", category: "boundaries", kind: "ordinal", max: 10, order: ["never", "regret", "more_than_once", "not_cheating_if"] },
  { id: "d2", category: "boundaries", kind: "ordinal", max: 7, order: ["shut_down", "polite_boundaries", "sometimes_attention", "like_attention"] },
  { id: "d3", category: "boundaries", kind: "ordinal", max: 4, order: ["no", "told_i_do", "harmless", "unappreciated"] },
  { id: "d4", category: "boundaries", kind: "ordinal", max: 4, order: ["no", "aware_working", "heated", "seeking_help"] },
  { id: "d5", category: "boundaries", kind: "ordinal", max: 4, order: ["radical", "white_lies", "appease", "everyone_lies"] },
  { id: "j4", category: "boundaries", kind: "text", max: 4 },
  { id: "d6", category: "boundaries", kind: "text", max: 4 },

  // ---------------- Accountability & Growth (10%) ----------------
  { id: "a1", category: "accountability", kind: "ordinal", max: 7, order: ["own_fully", "working", "struggle", "feel_attacked"] },
  { id: "a2", category: "accountability", kind: "ordinal", max: 7, order: ["listen_improve", "defensive_then_around", "take_personally", "shut_down"] },
  { id: "a3", category: "accountability", kind: "ordinal", max: 4, order: ["absolutely", "consider", "probably_not", "no_therapy"] },
  { id: "a4", category: "accountability", kind: "ordinal", max: 7, order: ["admit_apologize", "admit_eventually", "deflect", "rarely_wrong"] },
  { id: "n1", category: "accountability", kind: "ordinal", max: 4, order: ["research_book", "options_together", "ask_them", "easy_whatever", "wait_them"] },
  { id: "n2", category: "accountability", kind: "ordinal", max: 7, order: ["daily", "few_week", "weekly", "natural", "alone_time"] },
];

export const RULES_BY_ID: Record<string, QuestionRule> = Object.fromEntries(
  QUESTION_RULES.map((r) => [r.id, r])
);

export function categoryMax(category: CategoryKey): number {
  return QUESTION_RULES.filter((r) => r.category === category).reduce((sum, r) => sum + r.max, 0);
}
