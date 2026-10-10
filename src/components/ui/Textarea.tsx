import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, showCount = true, maxLength, value, ...props },
  ref
) {
  const len = typeof value === "string" ? value.length : 0;
  return (
    <div className="relative">
      <textarea
        ref={ref}
        maxLength={maxLength}
        value={value}
        className={cn(
          "w-full rounded-lg border-2 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400",
          "border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
          "dark:bg-slate-950 dark:text-slate-100 dark:border-slate-200 dark:placeholder:text-slate-500",
          "min-h-[104px] resize-y leading-relaxed transition-colors",
          invalid && "border-red-500 ring-1 ring-red-400 dark:border-red-400",
          className
        )}
        {...props}
      />
      {showCount && maxLength && (
        <span
          className={cn(
            "pointer-events-none absolute bottom-2 right-2.5 font-mono text-[10px]",
            len > maxLength * 0.9 ? "text-amber-600" : "text-slate-400 dark:text-slate-500"
          )}
        >
          {len}/{maxLength}
        </span>
      )}
    </div>
  );
});
