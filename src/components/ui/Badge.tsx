import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "accent";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700 border-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-200",
  success: "bg-emerald-100 text-emerald-800 border-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-400",
  warning: "bg-amber-100 text-amber-800 border-amber-500 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-400",
  danger: "bg-red-100 text-red-800 border-red-500 dark:bg-red-950 dark:text-red-300 dark:border-red-400",
  accent: "bg-indigo-100 text-indigo-800 border-indigo-500 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-400",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
