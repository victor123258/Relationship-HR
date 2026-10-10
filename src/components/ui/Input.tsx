import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border-2 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400",
        "border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        "dark:bg-slate-950 dark:text-slate-100 dark:border-slate-200 dark:placeholder:text-slate-500",
        "transition-colors",
        invalid && "border-red-500 ring-1 ring-red-400 dark:border-red-400",
        className
      )}
      {...props}
    />
  );
});
