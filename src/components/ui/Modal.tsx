import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative w-full max-w-md rounded-xl border-2 border-slate-900 bg-white p-5 hard-shadow-lg dark:border-slate-200 dark:bg-slate-900"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                {title}
              </h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-md border-2 border-slate-300 p-1 text-slate-500 transition-colors hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:hover:border-slate-300 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{children}</div>
            {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
