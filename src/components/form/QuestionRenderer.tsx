import { AnimatePresence, motion } from "framer-motion";
import { Asterisk } from "lucide-react";
import type { AnswerMap, AnswerValue, Question } from "../../types/form";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { RadioCards } from "../ui/Select";
import { RatingSlider } from "../ui/Slider";
import { cn } from "../../lib/utils";

export function QuestionRenderer({
  question,
  answers,
  onChange,
  invalid,
}: {
  question: Question;
  answers: AnswerMap;
  onChange: (id: string, value: AnswerValue) => void;
  invalid: boolean;
}) {
  const value = answers[question.id];
  const q = question;

  return (
    <div className="space-y-2.5">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0 rounded border border-slate-900 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {q.id.toUpperCase()}
        </span>
        <label className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
          {q.label}
          {q.required && <Asterisk className="mb-1 ml-1 inline h-3 w-3 text-red-500" />}
        </label>
      </div>

      {q.helper && <p className="text-xs text-slate-500 dark:text-slate-400">{q.helper}</p>}

      {q.type === "text" && (
        <Input
          value={typeof value === "string" ? value : ""}
          placeholder={q.placeholder}
          maxLength={q.maxLength}
          invalid={invalid}
          onChange={(e) => onChange(q.id, e.target.value)}
        />
      )}

      {q.type === "number" && (
        <Input
          type="number"
          inputMode="numeric"
          value={value === undefined ? "" : String(value)}
          placeholder={q.placeholder}
          min={q.min}
          max={q.max}
          invalid={invalid}
          className="max-w-[160px]"
          onChange={(e) => {
            const raw = e.target.value;
            onChange(q.id, raw === "" ? "" : Number(raw));
          }}
        />
      )}

      {q.type === "textarea" && (
        <Textarea
          value={typeof value === "string" ? value : ""}
          placeholder={q.placeholder}
          maxLength={q.maxLength}
          invalid={invalid}
          onChange={(e) => onChange(q.id, e.target.value)}
        />
      )}

      {q.type === "select" && (
        <RadioCards
          options={q.options ?? []}
          value={typeof value === "string" ? value : undefined}
          onChange={(v) => onChange(q.id, v)}
          invalid={invalid}
          name={q.id}
        />
      )}

      {q.type === "slider" && (
        <RatingSlider
          value={typeof value === "number" ? value : 5}
          min={q.min ?? 1}
          max={q.max ?? 10}
          labels={q.sliderLabels}
          onChange={(v) => onChange(q.id, v)}
        />
      )}

      {/* Conditional follow-up */}
      <AnimatePresence initial={false}>
        {q.conditional && q.conditional.whenValues.includes(String(value ?? "")) && (
          <motion.div
            key={q.conditional.id}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/60">
              <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                ↳ {q.conditional.label}
                {q.conditional.required && <Asterisk className="mb-1 ml-0.5 inline h-2.5 w-2.5 text-red-500" />}
              </label>
              {q.conditional.type === "number" ? (
                <Input
                  type="number"
                  inputMode="numeric"
                  value={answers[q.conditional.id] === undefined ? "" : String(answers[q.conditional.id])}
                  placeholder={q.conditional.placeholder}
                  className="max-w-[120px]"
                  onChange={(e) =>
                    onChange(q.conditional!.id, e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              ) : (
                <Input
                  value={typeof answers[q.conditional.id] === "string" ? String(answers[q.conditional.id]) : ""}
                  placeholder={q.conditional.placeholder}
                  maxLength={q.conditional.maxLength}
                  onChange={(e) => onChange(q.conditional!.id, e.target.value)}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {invalid && (
        <p className={cn("font-mono text-[10px] font-bold uppercase tracking-wider text-red-500")}>
          ! Required — please answer before continuing
        </p>
      )}
    </div>
  );
}
