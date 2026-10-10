import { Check } from "lucide-react";
import { FORM_STEPS } from "../../data/questions";
import { cn } from "../../lib/utils";

export function StepSidebar({
  current,
  completed,
  onJump,
}: {
  current: number;
  completed: boolean[];
  onJump: (idx: number) => void;
}) {
  return (
    <>
      {/* Desktop: vertical onboarding checklist */}
      <nav className="sticky top-20 hidden self-start lg:block" aria-label="Form sections">
        <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Onboarding checklist
        </p>
        <ol className="space-y-1">
          {FORM_STEPS.map((s, i) => {
            const isCurrent = i === current;
            const done = completed[i];
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-lg border-2 px-2.5 py-2 text-left transition-all",
                    isCurrent
                      ? "border-indigo-600 bg-indigo-50 hard-shadow-sm dark:border-indigo-400 dark:bg-indigo-950/40"
                      : "border-transparent hover:border-slate-300 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-900"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 font-mono text-[9px] font-bold",
                      done
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : isCurrent
                          ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                          : "border-slate-300 text-slate-400 dark:border-slate-600"
                    )}
                  >
                    {done ? <Check className="h-3 w-3" strokeWidth={4} /> : String(s.number).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "truncate font-mono text-[11px] font-semibold uppercase tracking-wider",
                      isCurrent
                        ? "text-slate-900 dark:text-white"
                        : done
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {s.shortTitle}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile: horizontal chips */}
      <div className="thin-scroll -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:hidden" aria-label="Form sections">
        {FORM_STEPS.map((s, i) => {
          const isCurrent = i === current;
          const done = completed[i];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onJump(i)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border-2 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider",
                isCurrent
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : done
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
              )}
            >
              {done && !isCurrent && <Check className="h-3 w-3" strokeWidth={4} />}
              {String(s.number).padStart(2, "0")}
            </button>
          );
        })}
      </div>
    </>
  );
}
