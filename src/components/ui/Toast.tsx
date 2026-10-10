import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

type ToastVariant = "success" | "info" | "warning";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

type PushFn = (message: string, variant: ToastVariant) => void;
let pushFn: PushFn | null = null;
let counter = 0;

export function toast(message: string, variant: ToastVariant = "success") {
  pushFn?.(message, variant);
}

const icons = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
} as const;

const colors: Record<ToastVariant, string> = {
  success: "border-emerald-500 text-emerald-600 dark:text-emerald-400",
  info: "border-indigo-500 text-indigo-600 dark:text-indigo-400",
  warning: "border-amber-500 text-amber-600 dark:text-amber-400",
};

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    pushFn = (message, variant) => {
      const id = ++counter;
      setItems((prev) => [...prev.slice(-2), { id, message, variant }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 2600);
    };
    return () => {
      pushFn = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {items.map((t) => {
          const Icon = icons[t.variant];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={`pointer-events-auto flex w-full items-center gap-2.5 rounded-lg border-2 bg-white px-3.5 py-2.5 hard-shadow-sm dark:bg-slate-900 ${colors[t.variant]}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                {t.message}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
