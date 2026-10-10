import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckSquare, Save, Send, Square } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { SECTIONS } from "../data/questions";
import type { AnswerValue, Answers, Question, Role } from "../types";
import { useImportPayload } from "../lib/payload";
import {
  clearDraft,
  getSeat,
  loadDraft,
  saveDraft,
  useSession,
} from "../lib/session";
import { Btn, DashedRule, FieldShell, SectionHeader, SelectCards, SliderInput, TextArea, TextInput } from "../components/ui";

const ease = [0.22, 1, 0.36, 1] as const;

function QuestionField({
  q,
  index,
  value,
  error,
  onChange,
}: {
  q: Question;
  index: number;
  value: AnswerValue | undefined;
  error: boolean;
  onChange: (v: AnswerValue) => void;
}) {
  return (
    <FieldShell q={q} index={index} error={error}>
      {q.type === "select" && <SelectCards q={q} value={value} onChange={onChange} />}
      {q.type === "slider" && <SliderInput value={value} onChange={onChange} />}
      {q.type === "text" && <TextInput q={q} value={value} onChange={onChange} error={error} />}
      {q.type === "number" && <TextInput q={q} value={value} onChange={onChange} error={error} type="number" />}
      {q.type === "textarea" && <TextArea q={q} value={value} onChange={onChange} error={error} />}
    </FieldShell>
  );
}

export default function Apply() {
  const { code = "" } = useParams();
  const CODE = code.toUpperCase();
  const navigate = useNavigate();
  useImportPayload(CODE);
  const { session, update } = useSession(CODE);

  const [seat] = useState<Role | null>(() => getSeat(CODE));
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => (seat ? loadDraft(CODE, seat) : {}));
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Prefill untouched sliders with the neutral 5 so autosave captures them
  useEffect(() => {
    if (!seat) return;
    setAnswers((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const s of SECTIONS) {
        for (const q of s.questions) {
          if (q.type === "slider" && next[q.id] === undefined) {
            next[q.id] = 5;
            changed = true;
          }
        }
      }
      return changed ? next : prev;
    });
  }, [seat]);

  // Autosave (debounced)
  useEffect(() => {
    if (!seat) return;
    const t = window.setTimeout(() => {
      saveDraft(CODE, seat, answers);
      setSavedFlash(true);
      const f = window.setTimeout(() => setSavedFlash(false), 1200);
      return () => window.clearTimeout(f);
    }, 450);
    return () => window.clearTimeout(t);
  }, [answers, CODE, seat]);

  const setField = useCallback((id: string, v: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [id]: v }));
    setErrors((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const validateSection = useCallback(
    (sectionIdx: number): string[] => {
      const missing: string[] = [];
      for (const q of SECTIONS[sectionIdx].questions) {
        if (!q.required) continue;
        const v = answers[q.id];
        if (v === undefined || v === "") missing.push(q.id);
        else if (q.type === "number" && (typeof v !== "number" || v < 18 || v > 120)) missing.push(q.id);
      }
      return missing;
    },
    [answers]
  );

  const section = SECTIONS[step];
  const sectionDone = useCallback(
    (idx: number) => SECTIONS[idx].questions.every((q) => !q.required || (answers[q.id] !== undefined && answers[q.id] !== "")),
    [answers]
  );

  const doneCount = useMemo(() => SECTIONS.filter((_, i) => sectionDone(i)).length, [sectionDone]);

  if (!seat) return <Navigate to={`/session/${CODE}`} replace />;
  if (seat && session?.[seat]) {
    const otherDone = seat === "a" ? !!session.b : !!session.a;
    return <Navigate to={otherDone ? `/session/${CODE}/report` : `/session/${CODE}/waiting`} replace />;
  }

  const goTo = (idx: number) => {
    setStep(idx);
    setErrors(new Set());
    setSubmitError(false);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    const missing = validateSection(step);
    if (missing.length) {
      setErrors(new Set(missing));
      return;
    }
    goTo(Math.min(step + 1, SECTIONS.length - 1));
  };

  const back = () => {
    setErrors(new Set());
    goTo(Math.max(step - 1, 0));
  };

  const submit = () => {
    const firstBad = SECTIONS.findIndex((s) =>
      s.questions.some((q) => {
        if (!q.required) return false;
        const v = answers[q.id];
        if (v === undefined || v === "") return true;
        if (q.type === "number" && (typeof v !== "number" || v < 18 || v > 120)) return true;
        return false;
      })
    );
    if (firstBad !== -1) {
      const missing = validateSection(firstBad);
      setStep(firstBad);
      setErrors(new Set(missing));
      setSubmitError(true);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const name = String(answers.s1_name ?? (seat === "a" ? "Applicant A" : "Applicant B")).trim() || (seat === "a" ? "Applicant A" : "Applicant B");
    update((cur) => ({
      ...cur,
      [seat]: { name, submittedAt: Date.now(), answers },
    }));
    clearDraft(CODE, seat);
    const other = seat === "a" ? session?.b : session?.a;
    navigate(other ? `/session/${CODE}/report` : `/session/${CODE}/waiting`);
  };

  const isLast = step === SECTIONS.length - 1;
  const roleLabel = seat === "a" ? "Applicant A" : "Applicant B";

  return (
    <div ref={topRef} className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Top meta */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">
            Form RH-1312 · Case {CODE}
          </p>
          <h1 className="mt-1 font-mono text-xl font-bold uppercase tracking-tight sm:text-2xl">
            Application — {roleLabel}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {savedFlash && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-600"
              >
                <Save className="h-3 w-3" /> Autosaved
              </motion.span>
            )}
          </AnimatePresence>
          <span className="border-2 border-slate-900 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
            {doneCount}/{SECTIONS.length} filed
          </span>
        </div>
      </div>

      {/* Segmented progress */}
      <div className="mt-5 flex gap-1">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Section ${s.num}: ${s.title}`}
            className={`h-2.5 flex-1 border transition-colors ${
              i === step
                ? "border-slate-900 bg-slate-900"
                : sectionDone(i)
                  ? "border-emerald-600 bg-emerald-500"
                  : "border-slate-300 bg-white hover:border-slate-500"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        {/* Checklist rail */}
        <aside className="hidden lg:col-span-1 lg:block">
          <div className="sticky top-24 border-2 border-slate-900 bg-white p-4">
            <p className="border-b-2 border-slate-900 pb-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em]">
              Filing checklist
            </p>
            <ul className="mt-3 space-y-1.5">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <button
                    onClick={() => goTo(i)}
                    className={`flex w-full items-center gap-2 px-1.5 py-1 text-left font-mono text-[9.5px] uppercase tracking-[0.12em] transition-colors ${
                      i === step ? "bg-slate-900 text-white" : sectionDone(i) ? "text-slate-700 hover:bg-slate-100" : "text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {sectionDone(i) ? (
                      <CheckSquare className={`h-3 w-3 shrink-0 ${i === step ? "text-emerald-400" : "text-emerald-600"}`} />
                    ) : (
                      <Square className="h-3 w-3 shrink-0 opacity-50" />
                    )}
                    <span className="truncate">
                      S{String(s.num).padStart(2, "0")} {s.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Form card */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.section
              key={section.id}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 }}
              transition={{ duration: 0.35, ease }}
              className="border-2 border-slate-900 bg-white p-5 shadow-[8px_8px_0_0_rgba(15,23,42,0.10)] sm:p-8"
            >
              <SectionHeader num={section.num} title={section.title} done={sectionDone(step)} blurb={section.blurb} />

              {submitError && (
                <div className="mt-4 border-2 border-dashed border-red-600 bg-red-50 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-red-600">
                  Filing rejected — complete the flagged fields before resubmission.
                </div>
              )}

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {section.questions.map((q, i) => (
                  <QuestionField
                    key={q.id}
                    q={q}
                    index={i}
                    value={answers[q.id]}
                    error={errors.has(q.id)}
                    onChange={(v) => setField(q.id, v)}
                  />
                ))}
              </div>

              <DashedRule className="mt-8" />

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Btn variant="outline" onClick={back} disabled={step === 0} className="sm:w-auto w-full">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Btn>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <span className="text-center font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400">
                    Step {step + 1} / {SECTIONS.length}
                  </span>
                  {isLast ? (
                    <Btn variant="emerald" onClick={submit} className="w-full sm:w-auto">
                      <Send className="h-4 w-4" /> [ Submit &amp; seal my file ]
                    </Btn>
                  ) : (
                    <Btn variant="solid" onClick={next} className="w-full sm:w-auto">
                      Next section <ArrowRight className="h-4 w-4" />
                    </Btn>
                  )}
                </div>
              </div>
            </motion.section>
          </AnimatePresence>

          <p className="mt-4 text-center font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-slate-400">
            Privacy notice — your answers autosave to this device only and are sealed on submission.
            <br />
            Your partner never sees your raw answers. Only the mutual breakdown.
          </p>
        </div>
      </div>
    </div>
  );
}
