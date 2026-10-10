import { FileText, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Barcode } from "./ui";

export function Chrome({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const match = pathname.match(/\/session\/([A-Z2-9]{4,8})/);
  const code = match?.[1];

  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf9] text-slate-900 antialiased">
      {/* margin notes (desktop) */}
      <div className="pointer-events-none fixed inset-y-0 left-3 z-0 hidden w-6 items-center justify-center xl:flex">
        <span className="rotate-180 font-mono text-[9px] uppercase tracking-[0.5em] text-slate-300 [writing-mode:vertical-rl]">
          Department of Mutual Affairs — Form RH-1312 — Rev 4.2
        </span>
      </div>
      <div className="pointer-events-none fixed inset-y-0 right-3 z-0 hidden w-6 items-center justify-center xl:flex">
        <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-slate-300 [writing-mode:vertical-rl]">
          Both applicants are equal — nobody is the judge
        </span>
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 rh-noise opacity-[0.05]" />
      <div className="pointer-events-none fixed inset-0 z-0 rh-grid opacity-60" />

      <header className="sticky top-0 z-40 border-b-2 border-slate-900 bg-[#fafaf9]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-stretch justify-between">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <span className="flex h-8 w-8 items-center justify-center border-2 border-slate-900 bg-slate-900 font-mono text-[10px] font-bold text-emerald-400">
              RH
            </span>
            <span className="leading-tight">
              <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.24em] sm:text-xs">
                Relationship&nbsp;HR
              </span>
              <span className="block font-mono text-[8px] uppercase tracking-[0.3em] text-slate-400 sm:text-[9px]">
                Mutual Compatibility Bureau
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2 px-4 sm:gap-4 sm:px-6">
            {code && (
              <span className="hidden items-center gap-2 border-2 border-slate-900 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] sm:flex">
                <FileText className="h-3 w-3" /> Case {code}
              </span>
            )}
            <span className="hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-700 md:flex">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% client-side · nothing leaves this device
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">{children}</main>

      <footer className="relative z-10 border-t-2 border-slate-900 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500 sm:text-left">
            Form RH-1312 · Both apply · Both review · No rejections, only data
          </p>
          <Barcode />
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500 sm:text-right">
            Answers stay sealed until both files are submitted
          </p>
        </div>
      </footer>
    </div>
  );
}
