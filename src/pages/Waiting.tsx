import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckSquare, ClipboardCopy, Hourglass, RefreshCw, Send, Square, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import type { Role } from "../types";
import { useImportPayload } from "../lib/payload";
import { copyText, getSeat, sessionUrl, useSession } from "../lib/session";
import { Btn, DashedRule, MonoTag } from "../components/ui";

const LINES = [
  "Your file is sealed. Tamper-evident tape applied.",
  "Partner's desk: file not yet received.",
  "Coffee machine in the waiting room: operational.",
  "The report unlocks the second both files land.",
  "Reminder: nobody sees your raw answers. Ever.",
  "The department appreciates your patience.",
];

export default function Waiting() {
  const { code = "" } = useParams();
  const CODE = code.toUpperCase();
  const navigate = useNavigate();
  useImportPayload(CODE);
  const { session } = useSession(CODE);
  const [seat] = useState<Role | null>(() => getSeat(CODE));
  const [line, setLine] = useState(0);
  const [copied, setCopied] = useState(false);

  const bothIn = !!session?.a && !!session?.b;
  const mine = seat ? session?.[seat] : undefined;
  const otherRole: Role = seat === "a" ? "b" : "a";

  useEffect(() => {
    const t = window.setInterval(() => setLine((l) => (l + 1) % LINES.length), 2600);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (bothIn) {
      const t = window.setTimeout(() => navigate(`/session/${CODE}/report`), 1400);
      return () => window.clearTimeout(t);
    }
  }, [bothIn, navigate, CODE]);

  if (!seat) return <Navigate to={`/session/${CODE}`} replace />;
  if (!mine) return <Navigate to={`/session/${CODE}/apply`} replace />;

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-20">
      <MonoTag>Waiting room · Case {CODE}</MonoTag>

      {/* Animated seal */}
      <div className="relative mt-10 flex h-52 w-52 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          className="absolute inset-5 rounded-full border border-slate-200"
        />
        {bothIn ? (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 border-emerald-600 bg-emerald-50"
          >
            <Check className="h-8 w-8 text-emerald-600" strokeWidth={3} />
            <span className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-700">
              Both files in
            </span>
          </motion.div>
        ) : (
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 border-slate-900 bg-white shadow-[6px_6px_0_0_rgba(15,23,42,0.12)]">
            <motion.div
              animate={{ rotate: [0, 180, 180, 360, 360] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Hourglass className="h-8 w-8 text-slate-900" />
            </motion.div>
            <span className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
              Pending
            </span>
          </div>
        )}
      </div>

      <h1 className="mt-10 max-w-xl font-mono text-xl font-bold uppercase leading-snug tracking-tight sm:text-2xl">
        {bothIn ? "Second file received — unsealing the report…" : "Your application is in. Waiting for your partner to submit theirs…"}
      </h1>

      <div className="mt-4 h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={line + String(bothIn)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400"
          >
            {bothIn ? "Decrypting both files simultaneously…" : LINES[line]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Status chips */}
      <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-3">
        <div className="border-2 border-emerald-600 bg-emerald-50 px-3 py-3">
          <p className="flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            <CheckSquare className="h-3.5 w-3.5" /> You — Filed
          </p>
        </div>
        <div className={`border-2 px-3 py-3 ${session?.[otherRole] ? "border-emerald-600 bg-emerald-50" : "border-slate-300 bg-white"}`}>
          <p
            className={`flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${
              session?.[otherRole] ? "text-emerald-700" : "text-slate-400"
            }`}
          >
            {session?.[otherRole] ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
            Partner — {session?.[otherRole] ? "Filed" : "Pending"}
          </p>
        </div>
      </div>

      <DashedRule className="mt-10 w-full" />

      {/* Nudge */}
      <div className="mt-8 w-full max-w-lg border-2 border-slate-900 bg-white p-5 text-left shadow-[6px_6px_0_0_rgba(15,23,42,0.10)]">
        <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-slate-700">
          <Send className="h-3.5 w-3.5" /> Nudge your partner
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          Send them this link — your sealed, encrypted file travels inside it, so their device can assemble the
          mutual report the moment they submit.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <code className="flex-1 truncate border-2 border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-[10px] text-slate-500">
            {sessionUrl(CODE, session)}
          </code>
          <Btn
            variant="solid"
            small
            onClick={async () => {
              const ok = await copyText(sessionUrl(CODE, session));
              if (ok) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }
            }}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy reminder link"}
          </Btn>
        </div>
        <p className="mt-4 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
          <Timer className="h-3 w-3" /> This page auto-opens the report when the second file lands
        </p>
      </div>

      <Btn variant="ghost" small className="mt-8" onClick={() => navigate(`/session/${CODE}`)}>
        <RefreshCw className="h-3 w-3" /> Back to session dashboard
      </Btn>
    </div>
  );
}
