import { useCallback, useMemo, useRef, useState } from "react";
import { FORM_STEPS } from "../data/questions";
import { readSession, saveAnswers, saveStep } from "../lib/session";
import type { AnswerMap, AnswerValue, Question } from "../types/form";
import type { Role } from "../types/session";

function withSliderDefaults(base: AnswerMap): AnswerMap {
  const out = { ...base };
  FORM_STEPS.forEach((st) =>
    st.questions.forEach((q) => {
      if (q.type === "slider" && out[q.id] === undefined) out[q.id] = 5;
    })
  );
  return out;
}

export function useFormProgress(code: string, role: Role) {
  const initial = useMemo(() => {
    const snap = readSession(code);
    const mine = role === "personA" ? snap.personA : snap.personB;
    return {
      answers: withSliderDefaults(mine.answers),
      step: Math.min(Math.max(0, mine.step), FORM_STEPS.length - 1),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, role]);

  const [answers, setAnswers] = useState<AnswerMap>(initial.answers);
  const [step, setStep] = useState<number>(initial.step);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const stepRef = useRef(step);
  stepRef.current = step;

  const setAnswer = useCallback(
    (id: string, value: AnswerValue) => {
      setAnswers((prev) => {
        const next = { ...prev, [id]: value };
        saveAnswers(code, role, next, stepRef.current);
        setLastSavedAt(new Date().toISOString());
        return next;
      });
    },
    [code, role]
  );

  const goToStep = useCallback(
    (n: number) => {
      const clamped = Math.min(Math.max(0, n), FORM_STEPS.length - 1);
      setStep(clamped);
      saveStep(code, role, clamped);
    },
    [code, role]
  );

  return { answers, setAnswer, step, goToStep, lastSavedAt, setAnswers };
}

/* ------------------------- validation helpers ------------------------- */

export function isQuestionAnswered(q: Question, answers: AnswerMap): boolean {
  const v = answers[q.id];
  if (q.type === "slider") return typeof v === "number";
  if (q.type === "select") return typeof v === "string" && v !== "";
  if (q.type === "number") return v !== undefined && v !== "" && !Number.isNaN(Number(v));
  return typeof v === "string" && v.trim().length > 0;
}

export function stepInvalidIds(stepIdx: number, answers: AnswerMap): string[] {
  const stepDef = FORM_STEPS[stepIdx];
  const invalid: string[] = [];
  for (const q of stepDef.questions) {
    if (q.required && !isQuestionAnswered(q, answers)) invalid.push(q.id);
    if (q.type === "number" && q.min !== undefined && isQuestionAnswered(q, answers)) {
      if (Number(answers[q.id]) < q.min) invalid.push(q.id);
    }
    // conditional required fields
    if (q.conditional?.required && q.conditional.whenValues.includes(String(answers[q.id] ?? ""))) {
      const cv = answers[q.conditional.id];
      if (typeof cv !== "string" || cv.trim() === "") invalid.push(q.conditional.id);
    }
  }
  return invalid;
}

export function stepIsComplete(stepIdx: number, answers: AnswerMap): boolean {
  return stepInvalidIds(stepIdx, answers).length === 0;
}
