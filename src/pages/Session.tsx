import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckSquare,
  ClipboardCopy,
  FileLock2,
  Hourglass,
  ListChecks,
  PenLine,
  Square,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import type { Role } from "../types";
import { useImportPayload } from "../lib/payload";
import {
  copyText,
  deleteSession,
  getSeat,
  hasDraft,
  sessionUrl,
  setSeat,
  useSession,
} from "../lib/session";
import { Btn, DashedRule, MonoTag, Stamp } from "../components/ui";

const ease = [0.22, 1, 0.36, 1] as const;

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Btn
      variant="outline"
      small
      onClick={async () => {
        const ok = await copyText(text);
        if (ok) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </Btn>
  );
}

function ApplicantCard({
  role,
  code,
  session,
  mySeat,
  onClaim,
}: {
  role: Role;
  code: string;
  session: ReturnType<typeof useSession>["session"];
  mySeat: Role | null;
  onClaim: (r: Role) => void;
}) {
  const navigate = useNavigate();
  const p = session?.[role];
  const draft = hasDraft(code, role);
  const mine = mySeat === role;
  const label = role === "a" ? "Applicant A" : "Applicant B";
  const num = role === "a" ? "01" : "02";

  const status = p ? "SUBMITTED" : draft ? "FILLING…" : "NOT STARTED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay: role === "a" ? 0.15 : 0.25 }}
      className={`border-2 bg-white p-5 ${p ? "border-emerald-600" : "border-slate-900"} ${
        mine ? "shadow-[6px_6px_0_0_rgba(15,23,42,0.15)]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400">File {num}</span>
          <h3 className="mt-1 font-mono text-base font-bold uppercase tracking-[0.18em]">
            {p ? p.name : label}
          </h3>
        </div>
        {p ? (
          <span className="flex items-center gap-1.5 border-2 border-emerald-600 bg-emerald-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            <FileLock2 className="h-3 w-3" /> Sealed
          </span>
        ) : mine ? (
          <MonoTag tone="emerald">This is you</MonoTag>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
        {p ? (
          <>
            <CheckSquare className="h-4 w-4 text-emerald-600" />
            <span className="text-emerald-700">Submitted — {new Date(p.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </>
        ) : draft ? (
          <>
            <PenLine className="h-4 w-4 text-amber-500" />
            <span className="text-amber-600">{status}</span>
          </>
        ) : (
          <>
            <Hourglass className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400">{status}</span>
          </>
        )}
      </div>

      <div className="mt-5">
        {p && mine && !session?.[role === "a" ? "b" : "a"] ? (
          <Btn variant="solid" small className="w-full" onClick={() => navigate(`/session/${code}/waiting`)}>
            Go to waiting room <ArrowRight className="h-3.5 w-3.5" />
          </Btn>
        ) : p ? (
          <div className="border-2 border-dashed border-slate-300 px-3 py-2.5 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
            {mine ? "Filed. Answers sealed." : "Filed by your partner. Sealed."}
          </div>
        ) : mine ? (
          <Btn variant="solid" small className="w-full" onClick={() => navigate(`/session/${code}/apply`)}>
            {draft ? "Continue my application" : "Start my application"} <ArrowRight className="h-3.5 w-3.5" />
          </Btn>
        ) : !mySeat ? (
          <Btn variant="outline" small className="w-full" onClick={() => onClaim(role)}>
            I am {label} — start <ArrowRight className="h-3.5 w-3.5" />
          </Btn>
        ) : (
          <div className="border-2 border-dashed border-slate-300 px-3 py-2.5 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
            Reserved for your partner
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SessionPage() {
  const { code = "" } = useParams();
  const navigate = useNavigate();
  useImportPayload(code.toUpperCase());
  const { session } = useSession(code.toUpperCase());
  const [mySeat, setMySeat] = useState<Role | null>(() => getSeat(code.toUpperCase()));

  if (!/^[A-Z0-9]{4,8}$/i.test(code)) return <Navigate to="/" replace />;
  const CODE = code.toUpperCase();

  const bothIn = !!session?.a && !!session?.b;
  const iSubmitted = mySeat ? !!session?.[mySeat] : false;

  const claim = (r: Role) => {
    setSeat(CODE, r);
    setMySeat(r);
    navigate(`/session/${CODE}/apply`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
        <div className="flex flex-wrap items-center gap-3">
          <MonoTag>Case file opened</MonoTag>
          <MonoTag tone={bothIn ? "emerald" : "amber"}>{bothIn ? "Both files received" : "Awaiting files"}</MonoTag>
        </div>
        <h1 className="mt-5 font-mono text-2xl font-bold uppercase tracking-tight sm:text-4xl">
          Match Session
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
          Share this code or link with your partner. Both applicants complete the identical form — the report opens
          for both of you at the exact same time.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          {/* Code display */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
            className="border-2 border-slate-900 bg-white p-5 shadow-[6px_6px_0_0_rgba(15,23,42,0.12)] sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                Match Code
              </span>
              <div className="flex gap-2">
                <CopyBtn text={CODE} label="Copy code" />
                <CopyBtn text={sessionUrl(CODE, null)} label="Copy link" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-6 gap-1.5 sm:gap-2">
              {CODE.split("").map((ch, i) => (
                <motion.div
                  key={`${ch}-${i}`}
                  initial={{ rotateX: 90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease }}
                  className="flex aspect-square items-center justify-center border-2 border-slate-900 bg-slate-900 font-mono text-2xl font-bold text-emerald-400 sm:text-4xl"
                >
                  {ch}
                </motion.div>
              ))}
            </div>
            <DashedRule className="my-4" />
            <p className="text-[11px] leading-relaxed text-slate-500">
              <span className="font-mono font-bold uppercase tracking-[0.15em] text-slate-700">Note — </span>
              after you submit, re-copy the link: your sealed, encrypted file is embedded inside it. That is how your
              answers travel to your partner's device without any server.
            </p>
          </motion.div>

          {/* Applicants */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ApplicantCard role="a" code={CODE} session={session} mySeat={mySeat} onClaim={claim} />
            <ApplicantCard role="b" code={CODE} session={session} mySeat={mySeat} onClaim={claim} />
          </div>

          {/* CTA row */}
          {bothIn && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }}>
              <Btn variant="emerald" className="w-full py-5" onClick={() => navigate(`/session/${CODE}/report`)}>
                [ Open the mutual compatibility report ] <ArrowRight className="h-4 w-4" />
              </Btn>
            </motion.div>
          )}
          {!bothIn && !mySeat && (session?.a || session?.b) && (
            <p className="border-2 border-dashed border-amber-500 bg-amber-50 px-4 py-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-amber-700">
              One file is already sealed. Choose the remaining applicant card above to begin yours.
            </p>
          )}
          {iSubmitted && !bothIn && (
            <Btn variant="outline" className="w-full" onClick={() => navigate(`/session/${CODE}/waiting`)}>
              <Hourglass className="h-4 w-4" /> [ Go to waiting room ]
            </Btn>
          )}
        </div>

        {/* Checklist rail */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="h-fit border-2 border-slate-900 bg-white p-5 lg:col-span-2"
        >
          <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-3">
            <ListChecks className="h-4 w-4" />
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]">Onboarding checklist</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {[
              { done: true, label: "Session created", sub: `Code ${CODE} issued` },
              { done: !!session?.a, label: "Applicant A filed", sub: session?.a ? `Sealed by ${session.a.name}` : "Awaiting application" },
              { done: !!session?.b, label: "Applicant B filed", sub: session?.b ? `Sealed by ${session.b.name}` : "Awaiting application" },
              { done: bothIn, label: "Mutual report generated", sub: bothIn ? "Unlocked for both" : "Unlocks automatically" },
            ].map((item, i) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                {item.done ? (
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <Square className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                )}
                <div>
                  <p className={`font-mono text-[11px] font-bold uppercase tracking-[0.15em] ${item.done ? "text-slate-900" : "text-slate-400"}`}>
                    {item.label}
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400">{item.sub}</p>
                </div>
              </motion.li>
            ))}
          </ul>

          <DashedRule className="my-5" />

          <div className="space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400">Case controls</p>
            <Btn variant="ghost" small onClick={() => navigate("/")}>
              ← Back to bureau lobby
            </Btn>
            {!session?.a && !session?.b && (
              <Btn
                variant="ghost"
                small
                className="text-red-500 hover:text-red-600"
                onClick={() => {
                  if (window.confirm("Shred this session and its code?")) {
                    deleteSession(CODE);
                    navigate("/");
                  }
                }}
              >
                <Trash2 className="h-3 w-3" /> Shred this session
              </Btn>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <Stamp tone={bothIn ? "emerald" : "amber"} rotate={3}>
              {bothIn ? "Ready for review" : "In progress"}
            </Stamp>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
