import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { AlertTriangle, BadgeCheck, OctagonAlert, ThumbsUp, Zap } from "lucide-react";
import type { ScoringResult, StatusTone } from "../../types/report";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/Badge";

function useCountUp(target: number, duration = 1.8, delay = 0.25): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [target, duration, delay]);
  return value;
}

const toneStyles: Record<StatusTone, { stroke: string; text: string; badge: "success" | "warning" | "danger"; stamp: string; Icon: typeof ThumbsUp }> = {
  excellent: { stroke: "#10b981", text: "text-emerald-600 dark:text-emerald-400", badge: "success", stamp: "Synergy verified", Icon: BadgeCheck },
  good: { stroke: "#10b981", text: "text-emerald-600 dark:text-emerald-400", badge: "success", stamp: "Worth pursuing", Icon: ThumbsUp },
  moderate: { stroke: "#f59e0b", text: "text-amber-600 dark:text-amber-400", badge: "warning", stamp: "Discussion advised", Icon: AlertTriangle },
  low: { stroke: "#ef4444", text: "text-red-500 dark:text-red-400", badge: "danger", stamp: "Proceed with dialogue", Icon: OctagonAlert },
  minimal: { stroke: "#ef4444", text: "text-red-500 dark:text-red-400", badge: "danger", stamp: "Deep review required", Icon: OctagonAlert },
};

export function OverallScore({ result, nameA, nameB }: { result: ScoringResult; nameA: string; nameB: string }) {
  const score = useCountUp(result.overallScore);
  const shown = Math.round(score);
  const style = toneStyles[result.statusTone];
  const R = 84;
  const C = 2 * Math.PI * R;

  return (
    <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
      {/* Donut */}
      <div className="relative mx-auto h-52 w-52 sm:h-60 sm:w-60">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={R} fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="16" />
          <circle
            cx="100"
            cy="100"
            r={R - 13}
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="2"
            strokeDasharray="3 5"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={style.stroke}
            strokeWidth="16"
            strokeLinecap="butt"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C - (C * result.overallScore) / 100 }}
            transition={{ duration: 1.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono text-5xl font-extrabold tabular-nums sm:text-6xl", style.text)}>
            {shown}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">/ 100</span>
          <span className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Match score
          </span>
        </div>
      </div>

      {/* Status block */}
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-block -rotate-2">
          <span className={cn("stamp text-[11px]", style.text)}>{style.stamp}</span>
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Official determination
          </p>
          <h2 className={cn("mt-1 font-mono text-lg font-extrabold leading-snug sm:text-2xl", style.text)}>
            <style.Icon className="mr-2 inline h-6 w-6 align-[-4px]" />
            {result.statusLabel}
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          This score evaluates <strong className="text-slate-700 dark:text-slate-200">the match between {nameA} and {nameB}</strong> — 
          not either person individually. Friction points below are conversation starters, not verdicts.
        </p>

        {result.hasValuesConflict && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4 text-left dark:border-amber-500 dark:bg-amber-950/30"
          >
            <p className="mb-2 flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              <Zap className="h-4 w-4" />
              Values conflict detected — important conversation needed
            </p>
            <ul className="space-y-1.5">
              {result.dealbreakerFlags.map((flag) => (
                <li key={flag} className="flex items-start gap-2 text-[13px] leading-snug text-amber-900 dark:text-amber-100">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {flag}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <div className="flex flex-wrap justify-center gap-2 md:justify-start">
          <Badge tone={result.overallScore >= 70 ? "success" : result.overallScore >= 50 ? "warning" : "danger"}>
            Alignment {result.overallScore}%
          </Badge>
          {result.dealbreakerFlags.length > 0 && (
            <Badge tone="warning">
              {result.dealbreakerFlags.length} value{result.dealbreakerFlags.length > 1 ? "s" : ""} to discuss
            </Badge>
          )}
          <Badge tone="neutral">No rejections issued — ever</Badge>
        </div>
      </div>
    </div>
  );
}
