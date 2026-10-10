import { Code2, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-slate-900 bg-white/60 py-6 dark:border-slate-200 dark:bg-slate-900/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center sm:px-6">
        <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          100% private. No data leaves your browser. No accounts. No tracking.
        </p>
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <span>v1.0.0</span>
          <span aria-hidden>·</span>
          <a
            href="https://github.com/your-username/relationship-hr"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <Code2 className="h-3.5 w-3.5" />
            Source
          </a>
          <span aria-hidden>·</span>
          <span>Evaluates the match, never the people</span>
        </div>
      </div>
    </footer>
  );
}
