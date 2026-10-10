import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 border-slate-900 bg-white hard-shadow dark:border-slate-200 dark:bg-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Checkbox-style HR section heading: `[x] SECTION 1: TITLE` */
export function SectionHeading({
  index,
  title,
  done,
  right,
  className,
}: {
  index?: number;
  title: string;
  done?: boolean;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 sm:text-base">
        <span className={cn("mr-2", done ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400")}>
          [{done ? "x" : "\u00A0"}]
        </span>
        {index !== undefined && (
          <span className="text-indigo-600 dark:text-indigo-400">
            SECTION {String(index).padStart(2, "0")}
            <span className="text-slate-400"> · </span>
          </span>
        )}
        {title}
      </h2>
      {right}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("hr-divider text-slate-300 dark:text-slate-700", className)} />;
}
