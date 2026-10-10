import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Option } from "../../types/form";
import { cn } from "../../lib/utils";

/**
 * Radio buttons rendered as selectable document rows — never native radios.
 */
export function RadioCards({
  options,
  value,
  onChange,
  invalid,
  name,
}: {
  options: Option[];
  value: string | undefined;
  onChange: (value: string) => void;
  invalid?: boolean;
  name?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn("grid gap-2", invalid && "rounded-xl ring-2 ring-red-400 ring-offset-2 ring-offset-white p-1 dark:ring-offset-slate-900")}
    >
      {options.map((opt, i) => {
        const selected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.25 }}
            onClick={() => onChange(opt.value)}
            className={cn(
              "group flex w-full items-start gap-3 rounded-lg border-2 px-3.5 py-3 text-left transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              selected
                ? "border-indigo-600 bg-indigo-50 hard-shadow-sm dark:border-indigo-400 dark:bg-indigo-950/50"
                : "border-slate-300 bg-white hover:border-slate-900 hover:-translate-y-px dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-300"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 font-mono text-[10px] font-bold transition-colors",
                selected
                  ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-400 dark:bg-indigo-500"
                  : "border-slate-400 text-transparent group-hover:border-slate-600 dark:border-slate-600"
              )}
            >
              <Check className="h-3 w-3" strokeWidth={4} />
            </span>
            <span className="flex-1">
              <span
                className={cn(
                  "block text-sm font-medium leading-snug",
                  selected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                )}
              >
                {opt.label}
              </span>
              {opt.hint && (
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {opt.hint}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
