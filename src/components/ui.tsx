import { motion } from "framer-motion";
import { AlertTriangle, Asterisk } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import type { AnswerValue, Question } from "../types";

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type BtnVariant = "solid" | "outline" | "ghost" | "emerald" | "red";

export function Btn({
  children,
  variant = "solid",
  onClick,
  disabled,
  className,
  type = "button",
  small,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  small?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group inline-flex select-none items-center justify-center gap-2 font-mono uppercase tracking-[0.18em] transition-all duration-150",
        small ? "px-3 py-2 text-[10px]" : "px-5 py-3.5 text-[11px] sm:text-xs",
        variant === "solid" &&
          "border-2 border-slate-900 bg-slate-900 text-white shadow-[4px_4px_0_0_rgba(15,23,42,0.25)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(15,23,42,0.25)] active:translate-x-0 active:translate-y-0 active:shadow-none",
        variant === "emerald" &&
          "border-2 border-emerald-600 bg-emerald-600 text-white shadow-[4px_4px_0_0_rgba(5,150,105,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(5,150,105,0.3)] active:translate-x-0 active:translate-y-0 active:shadow-none",
        variant === "red" &&
          "border-2 border-red-600 bg-red-600 text-white shadow-[4px_4px_0_0_rgba(220,38,38,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none",
        variant === "outline" &&
          "border-2 border-slate-900 bg-white text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:translate-x-0 active:translate-y-0 active:shadow-none",
        variant === "ghost" &&
          "border-2 border-transparent text-slate-500 underline decoration-dotted underline-offset-4 hover:border-slate-300 hover:text-slate-900",
        disabled && "cursor-not-allowed opacity-40 hover:translate-x-0 hover:translate-y-0 hover:shadow-none",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Stamps & tags                                                       */
/* ------------------------------------------------------------------ */

const TONES: Record<string, string> = {
  emerald: "border-emerald-600 text-emerald-700",
  amber: "border-amber-500 text-amber-600",
  red: "border-red-600 text-red-600",
  slate: "border-slate-500 text-slate-600",
};

export function Stamp({
  children,
  tone = "slate",
  className,
  rotate = -2,
}: {
  children: ReactNode;
  tone?: keyof typeof TONES | string;
  className?: string;
  rotate?: number;
}) {
  return (
    <motion.div
      initial={{ scale: 1.6, opacity: 0, rotate: rotate * 3 }}
      animate={{ scale: 1, opacity: 1, rotate }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className={cn(
        "inline-block border-[3px] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] sm:text-xs",
        TONES[tone] ?? TONES.slate,
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function MonoTag({ children, className, tone }: { children: ReactNode; className?: string; tone?: keyof typeof TONES }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border border-slate-300 bg-white px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500",
        tone && TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Section headers: [ ] SECTION N: TITLE                               */
/* ------------------------------------------------------------------ */

export function SectionHeader({
  num,
  title,
  done,
  blurb,
}: {
  num: number;
  title: string;
  done?: boolean;
  blurb?: string;
}) {
  return (
    <div className="border-b-2 border-slate-900 pb-4">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-slate-900 sm:text-base">
          <span className={cn("mr-2 inline-block", done && "text-emerald-600")}>[{done ? "■" : " "}]</span>
          SECTION {String(num).padStart(2, "0")}: {title}
        </h2>
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 sm:block">
          FR/1312·S{String(num).padStart(2, "0")}
        </span>
      </div>
      {blurb && <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm">{blurb}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form fields                                                         */
/* ------------------------------------------------------------------ */

export function FieldShell({
  q,
  index,
  error,
  children,
}: {
  q: Question;
  index: number;
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn(q.wide && "sm:col-span-2")}>
      <label className="mb-2 flex items-baseline gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
        <span className="text-slate-300">{String(index + 1).padStart(2, "0")}</span>
        <span className={cn(error ? "text-red-600" : "text-slate-700")}>{q.label}</span>
        {q.required ? (
          <Asterisk className={cn("h-3 w-3", error ? "text-red-600" : "text-slate-400")} strokeWidth={3} />
        ) : (
          <span className="text-[9px] font-normal tracking-[0.15em] text-slate-400">(OPT)</span>
        )}
      </label>
      {children}
      {q.hint && !error && <p className="mt-1.5 text-[11px] italic leading-relaxed text-slate-400">{q.hint}</p>}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-red-600">
          <AlertTriangle className="h-3 w-3" /> Required for filing
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full border-2 border-slate-900 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-700 transition-shadow";

export function TextInput({
  q,
  value,
  onChange,
  error,
  type = "text",
}: {
  q: Question;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
  error?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      min={type === "number" ? 18 : undefined}
      max={type === "number" ? 120 : undefined}
      onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      placeholder={q.placeholder}
      className={cn(inputCls, error && "border-red-600")}
    />
  );
}

export function TextArea({
  q,
  value,
  onChange,
  error,
}: {
  q: Question;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
  error?: boolean;
}) {
  return (
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={q.placeholder}
      rows={3}
      maxLength={600}
      className={cn(inputCls, "resize-y leading-relaxed", error && "border-red-600")}
    />
  );
}

export function SelectCards({
  q,
  value,
  onChange,
}: {
  q: Question;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}) {
  return (
    <div className={cn("grid gap-2", (q.options?.length ?? 0) > 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
      {q.options?.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "group flex items-center justify-between gap-3 border-2 px-3.5 py-3 text-left text-xs leading-snug transition-all duration-150 sm:text-[13px]",
              active
                ? "border-slate-900 bg-slate-900 text-white shadow-[3px_3px_0_0_rgba(15,23,42,0.25)]"
                : "border-slate-300 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900"
            )}
            aria-pressed={active}
          >
            <span>{o.label}</span>
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center border font-mono text-[9px]",
                active ? "border-white/60 text-emerald-300" : "border-slate-300 text-transparent group-hover:border-slate-400"
              )}
            >
              ✓
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SliderInput({
  value,
  onChange,
}: {
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}) {
  const v = typeof value === "number" ? value : 5;
  return (
    <div className="flex items-center gap-4 border-2 border-slate-300 bg-white px-4 py-3 transition-colors focus-within:border-slate-900">
      <span className="font-mono text-[10px] text-slate-400">1</span>
      <div className="relative flex-1">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={v}
          onChange={(e) => onChange(Number(e.target.value))}
          className="rh-slider w-full"
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={v}
        />
        <div className="pointer-events-none mt-1.5 flex justify-between">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className={cn("h-1 w-px", i + 1 <= v ? "bg-slate-400" : "bg-slate-200")} />
          ))}
        </div>
      </div>
      <span className="font-mono text-[10px] text-slate-400">10</span>
      <motion.span
        key={v}
        initial={{ scale: 1.25 }}
        animate={{ scale: 1 }}
        className="flex h-9 w-11 shrink-0 items-center justify-center border-2 border-slate-900 bg-slate-900 font-mono text-sm font-bold text-emerald-400"
      >
        {v}
      </motion.span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ongoing input "cursor"                                              */
/* ------------------------------------------------------------------ */

export function BlinkCaret() {
  return <span className="rh-blink ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-current" />;
}

/* ------------------------------------------------------------------ */
/* Decorative                                                          */
/* ------------------------------------------------------------------ */

export function Barcode({ className }: { className?: string }) {
  const bars = [3, 1, 2, 1, 1, 3, 1, 2, 4, 1, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 1, 2];
  return (
    <div className={cn("flex h-8 items-stretch gap-[2px]", className)} aria-hidden>
      {bars.map((w, i) => (
        <span key={i} className="bg-slate-900" style={{ width: w }} />
      ))}
    </div>
  );
}

export function DashedRule({ className }: { className?: string }) {
  return <div className={cn("border-t-2 border-dashed border-slate-300", className)} />;
}
