import { motion } from "framer-motion";
import { FileText } from "lucide-react";

/**
 * "Document going through a scanner" — the department is processing your file.
 */
export function WaitingAnimation() {
  return (
    <div className="relative mx-auto h-44 w-36">
      {/* paper */}
      <div className="absolute inset-0 overflow-hidden rounded-xl border-2 border-slate-900 bg-white hard-shadow dark:border-slate-200 dark:bg-slate-900">
        <div className="p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded border-2 border-slate-900 bg-indigo-100 dark:border-slate-200 dark:bg-indigo-950">
              <FileText className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
            </span>
            <div className="h-2 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="mb-1.5 h-1.5 rounded bg-slate-200 dark:bg-slate-700"
              style={{ width: `${88 - (i % 3) * 18}%` }}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <div className="mt-3 inline-block rounded border-2 border-emerald-500 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-emerald-600 opacity-70 dark:text-emerald-400 [transform:rotate(-4deg)]">
            Received
          </div>
        </div>
        {/* scanline */}
        <div className="scanline absolute left-0 h-1.5 w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80" />
      </div>
      {/* scanner bed glow */}
      <div className="absolute -bottom-3 left-1/2 h-1.5 w-4/5 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-sm" />
    </div>
  );
}

export function PulsingDots() {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="blink-dot inline-block h-2 w-2 rounded-full bg-indigo-500"
          style={{ animationDelay: `${i * 0.22}s` }}
        />
      ))}
    </span>
  );
}
