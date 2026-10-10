import type { AnswerMap } from "./form";

export type CategoryKey =
  | "communication"
  | "emotional"
  | "values"
  | "financial"
  | "love"
  | "boundaries"
  | "accountability";

export type StatusTone = "excellent" | "good" | "moderate" | "low" | "minimal";

export interface CategoryBreakdownRow {
  key: CategoryKey;
  label: string;
  weight: number;
  alignment: number; // 0-100
  personASummary: string;
  personBSummary: string;
  /** Per-question contribution details for the expandable row. */
  details: QuestionContribution[];
}

export interface QuestionContribution {
  questionId: string;
  questionLabel: string;
  answerA: string;
  answerB: string;
  points: number;
  maxPoints: number;
  note?: string;
}

export interface ReportInput {
  code: string;
  nameA: string;
  nameB: string;
  answersA: AnswerMap;
  answersB: AnswerMap;
  generatedAt: string;
}

export interface ScoringResult {
  overallScore: number;
  categoryScores: Record<CategoryKey, number>;
  /** Per-person normalized "stance" scores used for the radar overlay. */
  personScores: {
    A: Record<CategoryKey, number>;
    B: Record<CategoryKey, number>;
  };
  categoryRows: CategoryBreakdownRow[];
  dealbreakerFlags: string[];
  synergyHighlights: string[];
  frictionPoints: string[];
  conversationStarters: string[];
  statusLabel: string;
  statusTone: StatusTone;
  hasValuesConflict: boolean;
}

export interface SharedReportPayload {
  v: 1;
  code: string;
  nameA: string;
  nameB: string;
  answersA: AnswerMap;
  answersB: AnswerMap;
  generatedAt: string;
}

export interface HandoffPayload {
  v: 1;
  code: string;
  role: "personA" | "personB";
  name: string;
  answers: AnswerMap;
}
