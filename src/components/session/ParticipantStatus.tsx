import { ArrowRight, CheckCircle2, Clock3, PenLine, UserRound } from "lucide-react";
import { FORM_STEPS } from "../../data/questions";
import { cn } from "../../lib/utils";
import type { ParticipantState } from "../../types/session";
import { Button } from "../ui/Button";

type SlotStatus = "empty" | "filling" | "submitted";

function statusOf(p: ParticipantState): SlotStatus {
  if (p.submitted) return "submitted";
  if (p.exists) return "filling";
  return "empty";
}

export function ParticipantStatusRow({
  label,
  slot,
  participant,
  isMe,
  onStart,
  startLabel,
  disabled,
}: {
  label: string;
  slot: "A" | "B";
  participant: ParticipantState;
  isMe: boolean;
  onStart?: () => void;
  startLabel?: string;
  disabled?: boolean;
}) {
  const status = statusOf(participant);
  const displayName = participant.name || `Person ${slot}`;

  const statusChip = {
    empty: (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <Clock3 className="h-3.5 w-3.5" /> Not started
      </span>
    ),
    filling: (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
        <PenLine className="h-3.5 w-3.5" /> Filling out… (Section {Math.min((participant.step ?? 0) + 1, FORM_STEPS.length)}/{FORM_STEPS.length})
      </span>
    ),
    submitted: (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-3.5 w-3.5" /> Submitted
      </span>
    ),
  }[status];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border-2 p-4 sm:flex-row sm:items-center sm:justify-between",
        status === "submitted"
          ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20"
          : "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/50"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold",
            status === "submitted"
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-400 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400"
          )}
        >
          {status === "submitted" ? <CheckCircle2 className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
        </span>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {label}
            {isMe && <span className="ml-2 rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">YOU</span>}
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {status === "empty" ? "—" : displayName}
          </p>
          {statusChip}
        </div>
      </div>

      {onStart && status !== "submitted" && (
        <Button variant="accent" size="sm" onClick={onStart} disabled={disabled} className="shrink-0">
          {startLabel ?? "Start My Application"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
