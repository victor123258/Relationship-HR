import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function ProgressBar({
  value,
  className,
  barClassName,
}: {
  /** 0-100 */
  value: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div
      className={cn(
        "h-3 w-full overflow-hidden rounded-full border-2 border-slate-900 bg-white dark:border-slate-200 dark:bg-slate-800",
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn("h-full bg-indigo-500", barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />
    </div>
  );
}
