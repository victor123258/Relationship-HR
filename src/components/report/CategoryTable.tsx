import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BadgeCheck, ChevronDown, ThumbsUp, XCircle } from "lucide-react";
import type { CategoryBreakdownRow } from "../../types/report";
import { cn } from "../../lib/utils";

function statusOf(alignment: number) {
  if (alignment >= 80) return { Icon: BadgeCheck, cls: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", label: "Strong" };
  if (alignment >= 60) return { Icon: ThumbsUp, cls: "text-indigo-600 dark:text-indigo-400", bar: "bg-indigo-500", label: "Solid" };
  if (alignment >= 40) return { Icon: AlertTriangle, cls: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500", label: "Discuss" };
  return { Icon: XCircle, cls: "text-red-500 dark:text-red-400", bar: "bg-red-500", label: "Priority" };
}

export function CategoryTable({
  rows,
  nameA,
  nameB,
}: {
  rows: CategoryBreakdownRow[];
  nameA: string;
  nameB: string;
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border-2 border-slate-900 dark:border-slate-200">
      {/* Header row (desktop) */}
      <div className="hidden grid-cols-[1.2fr_1fr_1fr_130px_56px] gap-3 border-b-2 border-slate-900 bg-slate-100 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:border-slate-200 dark:bg-slate-800 dark:text-slate-300 md:grid">
        <span>Category</span>
        <span>{nameA}</span>
        <span>{nameB}</span>
        <span>Alignment</span>
        <span className="text-right">Status</span>
      </div>

      {rows.map((row, idx) => {
        const s = statusOf(row.alignment);
        const isOpen = open === row.key;
        return (
          <div key={row.key} className={cn(idx !== rows.length - 1 && "border-b-2 border-slate-200 dark:border-slate-800")}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : row.key)}
              aria-expanded={isOpen}
              className="block w-full px-4 py-3.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_130px_56px] md:items-center md:gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                    {row.label}
                  </span>
                  <span className="ml-1 hidden rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:inline">
                    {Math.round(row.weight * 100)}%
                  </span>
                </div>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono text-[9px] font-bold uppercase text-indigo-500 md:hidden">A · </span>
                  {row.personASummary}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono text-[9px] font-bold uppercase text-emerald-500 md:hidden">B · </span>
                  {row.personBSummary}
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-full max-w-[110px] overflow-hidden rounded-full border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800">
                    <motion.div
                      className={cn("h-full", s.bar)}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${row.alignment}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: idx * 0.08, ease: "easeOut" }}
                    />
                  </div>
                  <span className={cn("font-mono text-xs font-extrabold tabular-nums", s.cls)}>{row.alignment}%</span>
                </div>
                <div className="flex items-center justify-between md:justify-end md:gap-2">
                  <span className={cn("inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider", s.cls)}>
                    <s.Icon className="h-4 w-4" />
                    {s.label}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
                </div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t-2 border-dashed border-slate-200 bg-slate-50/70 px-4 py-4 dark:border-slate-700 dark:bg-slate-950/40">
                    <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Contributing answers
                    </p>
                    <div className="space-y-2.5">
                      {row.details.map((d) => (
                        <div
                          key={d.questionId}
                          className="grid gap-1 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-[1fr_auto] sm:gap-4"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{d.questionLabel}</p>
                            {d.answerA || d.answerB ? (
                              <div className="mt-1 grid gap-0.5 sm:grid-cols-2">
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                  <span className="font-mono text-[9px] font-bold uppercase text-indigo-500">{nameA}: </span>
                                  {d.answerA}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                  <span className="font-mono text-[9px] font-bold uppercase text-emerald-500">{nameB}: </span>
                                  {d.answerB}
                                </p>
                              </div>
                            ) : null}
                            {d.note && (
                              <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-slate-400">{d.note}</p>
                            )}
                          </div>
                          <span
                            className={cn(
                              "self-start rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums",
                              d.points >= d.maxPoints * 0.7
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                                : d.points >= d.maxPoints * 0.35
                                  ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                                  : "border-red-300 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
                            )}
                          >
                            {d.points}/{d.maxPoints}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
