import { Link, useLocation } from "react-router-dom";
import { ClipboardCheck, Moon, Sun } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { Badge } from "../ui/Badge";

export function Header() {
  const { dark, toggle } = useDarkMode();
  const location = useLocation();
  const match = location.pathname.match(/^\/session\/([A-Z0-9]{6})/);
  const code = match?.[1];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-slate-900 bg-slate-100/90 backdrop-blur dark:border-slate-200 dark:bg-slate-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-slate-900 bg-indigo-500 text-white hard-shadow-sm transition-transform group-hover:-translate-y-0.5 dark:border-slate-200">
            <ClipboardCheck className="h-4.5 w-4.5" strokeWidth={2.4} />
          </span>
          <span className="hidden font-mono text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 min-[420px]:block">
            Relationship HR<span className="text-indigo-600 dark:text-indigo-400">™</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {code && code !== "SAMPLE" && (
            <Badge tone="accent" className="hidden sm:inline-flex">
              Session {code}
            </Badge>
          )}
          <button
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-slate-900 bg-white text-slate-800 hard-shadow-sm pressable dark:border-slate-200 dark:bg-slate-900 dark:text-amber-300"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
