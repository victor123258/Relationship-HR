import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100 dark:hover:bg-white",
  accent:
    "bg-indigo-600 text-white border-slate-900 dark:border-indigo-300 hover:bg-indigo-500",
  outline:
    "bg-white text-slate-900 border-slate-900 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-200 dark:hover:bg-slate-800",
  ghost:
    "bg-transparent text-slate-700 border-transparent shadow-none hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800/70",
  danger:
    "bg-red-500 text-white border-slate-900 dark:border-red-300 hover:bg-red-600",
  success:
    "bg-emerald-500 text-white border-slate-900 dark:border-emerald-300 hover:bg-emerald-600",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[11px]",
  md: "px-4 py-2.5 text-xs",
  lg: "px-6 py-3.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, className, children, disabled, ...props },
  ref
) {
  const shadowless = variant === "ghost";
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border-2 font-mono font-semibold uppercase tracking-wider",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
        "disabled:cursor-not-allowed disabled:opacity-50",
        !shadowless && "hard-shadow-sm pressable",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  );
});
