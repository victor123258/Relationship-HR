export type AnswerValue = string | number;

export interface Answers {
  [qid: string]: AnswerValue | undefined;
}

export type Role = "a" | "b";

export interface Participant {
  name: string;
  submittedAt: number;
  answers: Answers;
}

export interface SessionData {
  code: string;
  createdAt: number;
  a?: Participant;
  b?: Participant;
}

export type QuestionType = "text" | "number" | "select" | "slider" | "textarea";

export interface QOption {
  value: string;
  label: string;
  short?: string;
  flag?: boolean;
}

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  options?: QOption[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
  wide?: boolean;
}

export interface FormSection {
  id: string;
  num: number;
  code: string;
  title: string;
  blurb: string;
  questions: Question[];
}

export interface FlagItem {
  id: string;
  title: string;
  detail: string;
}

export interface CategoryRow {
  key: string;
  name: string;
  aDisplay: string;
  bDisplay: string;
  alignment: number;
  status: "good" | "warn" | "bad";
}

export interface RatingPair {
  label: string;
  a: number;
  b: number;
  delta: number;
}

export type ReportTone = "emerald" | "amber" | "red" | "slate";

export interface ReportResult {
  overall: number;
  engineScore: number;
  label: string;
  descriptor: string;
  tone: ReportTone;
  flags: FlagItem[];
  categories: CategoryRow[];
  synergies: string[];
  frictions: string[];
  starters: string[];
  ratingPairs: RatingPair[];
  generatedAt: number;
}
