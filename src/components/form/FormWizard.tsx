import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CloudCheck, Send } from "lucide-react";
import { FORM_STEPS } from "../../data/questions";
import { stepInvalidIds, stepIsComplete, useFormProgress } from "../../hooks/useFormProgress";
import { markSubmitted } from "../../lib/session";
import { formatDateTime } from "../../lib/utils";
import type { Role } from "../../types/session";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";
import { toast } from "../ui/Toast";
import { FormStep } from "./FormStep";
import { StepSidebar } from "./StepSidebar";

export function FormWizard({
  code,
  role,
  onSubmitted,
}: {
  code: string;
  role: Role;
  onSubmitted: () => void;
}) {
  const { answers, setAnswer, step, goToStep, lastSavedAt } = useFormProgress(code, role);
  const [attemptedAdvance, setAttemptedAdvance] = useState(false);

  const stepDef = FORM_STEPS[step];
  const isLast = step === FORM_STEPS.length - 1;

  const invalidIds = useMemo(() => {
    if (!attemptedAdvance) return new Set<string>();
    return new Set(stepInvalidIds(step, answers));
  }, [attemptedAdvance, step, answers]);

  const completed = useMemo(
    () => FORM_STEPS.map((_, i) => stepIsComplete(i, answers)),
    [answers]
  );

  const completedCount = completed.filter(Boolean).length;
  const progress = ((step + 1) / FORM_STEPS.length) * 100;

  const tryAdvance = () => {
    const invalid = stepInvalidIds(step, answers);
    if (invalid.length > 0) {
      setAttemptedAdvance(true);
      toast(`${invalid.length} required question${invalid.length > 1 ? "s" : ""} need answers`, "warning");
      const el = document.querySelector('[data-invalid-anchor]');
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setAttemptedAdvance(false);
    if (isLast) {
      const allInvalid = FORM_STEPS.map((_, i) => stepInvalidIds(i, answers));
      const firstBad = allInvalid.findIndex((arr) => arr.length > 0);
      if (firstBad !== -1) {
        goToStep(firstBad);
        setAttemptedAdvance(true);
        toast("A few earlier sections still need answers", "warning");
        return;
      }
      markSubmitted(code, role, answers);
      toast("Application submitted", "success");
      onSubmitted();
      return;
    }
    goToStep(step + 1);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <StepSidebar current={step} completed={completed} onJump={(i) => { setAttemptedAdvance(false); goToStep(i); }} />

      <div className="min-w-0">
        {/* Progress header */}
        <div className="mb-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] font-bold uppercase tracking-wider">
            <span className="text-slate-600 dark:text-slate-300">
              Step {step + 1} of {FORM_STEPS.length} — {stepDef.title}
            </span>
            <span className="text-indigo-600 dark:text-indigo-400">
              {completedCount}/{FORM_STEPS.length} sections complete
            </span>
          </div>
          <ProgressBar value={progress} />
        </div>

        <Card className="p-5 sm:p-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stepDef.id}
              initial={{ opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {invalidIds.size > 0 && <span data-invalid-anchor className="block h-0 w-0" />}
              <FormStep
                stepDef={stepDef}
                answers={answers}
                onChange={setAnswer}
                invalidIds={invalidIds}
                done={completed[step]}
              />
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t-2 border-dashed border-slate-200 pt-5 dark:border-slate-700">
            <Button
              variant="outline"
              onClick={() => { setAttemptedAdvance(false); goToStep(step - 1); }}
              disabled={step === 0}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous
            </Button>

            {isLast ? (
              <Button variant="success" size="lg" onClick={tryAdvance}>
                <Send className="h-4 w-4" />
                Submit Application
              </Button>
            ) : (
              <Button variant="accent" onClick={tryAdvance}>
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </Card>

        {/* Autosave indicator */}
        <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <CloudCheck className="h-3.5 w-3.5 text-emerald-500" />
          Progress saves automatically
          {lastSavedAt && <span className="normal-case">· last saved {formatDateTime(lastSavedAt)}</span>}
        </p>
      </div>
    </div>
  );
}
