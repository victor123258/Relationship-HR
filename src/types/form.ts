export type QuestionType = "text" | "number" | "textarea" | "select" | "slider";

export interface Option {
  value: string;
  label: string;
  /** Small playful annotation shown next to the label. */
  hint?: string;
}

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: Option[];
  sliderLabels?: { low: string; mid: string; high: string };
  /** Conditional follow-up field, shown when the parent's answer matches. */
  conditional?: {
    whenValues: string[];
    label: string;
    id: string;
    placeholder?: string;
    maxLength?: number;
    type?: "text" | "number";
    required?: boolean;
  };
}

export interface FormStepDef {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  questions: Question[];
}

export type AnswerValue = string | number;
export type AnswerMap = Record<string, AnswerValue>;
