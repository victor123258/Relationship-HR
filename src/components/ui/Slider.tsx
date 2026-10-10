import { Frown, Laugh, Meh, Smile } from "lucide-react";
import { cn } from "../../lib/utils";

function zoneInfo(value: number): { label: string; className: string; Icon: typeof Meh } {
  if (value <= 3) return { label: "Needs work", className: "text-red-500 border-red-400 bg-red-50 dark:bg-red-950/40", Icon: Frown };
  if (value <= 5) return { label: "Room to grow", className: "text-amber-600 border-amber-400 bg-amber-50 dark:bg-amber-950/40", Icon: Meh };
  if (value <= 8) return { label: "Strong", className: "text-emerald-600 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40", Icon: Smile };
  return { label: "Elite", className: "text-indigo-600 border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40", Icon: Laugh };
}

export function RatingSlider({
  value,
  onChange,
  min = 1,
  max = 10,
  labels,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  labels?: { low: string; mid: string; high: string };
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const zone = zoneInfo(value);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <input
          type="range"
          className="hr-range flex-1"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ ["--fill" as string]: `${pct}%` }}
          aria-valuetext={`${value} out of ${max}`}
        />
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border-2 font-mono hard-shadow-sm",
            zone.className
          )}
        >
          <span className="text-lg font-bold leading-none">{value}</span>
          <span className="text-[9px] uppercase tracking-wider opacity-70">/ {max}</span>
        </div>
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <span>{labels?.low ?? "Low"}</span>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-semibold", zone.className)}>
          <zone.Icon className="h-3 w-3" />
          {zone.label}
        </span>
        <span>{labels?.high ?? "High"}</span>
      </div>
    </div>
  );
}
