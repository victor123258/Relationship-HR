import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  FileLock2,
  HeartHandshake,
  KeyRound,
  PlayCircle,
  ScanFace,
  ShieldCheck,
  Stamp as StampIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { demoSession } from "../lib/demo";
import { createSession, genCode, isValidCode, saveSession } from "../lib/session";
import { BlinkCaret, Btn, Stamp } from "../components/ui";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay: 0.08 * i },
  }),
};

const TICKER = [
  "BOTH APPLY",
  "BOTH REVIEW",
  "NOBODY JUDGES",
  "DATA, NOT VERDICTS",
  "SEALED UNTIL MUTUAL",
  "EQUAL FLOW",
  "MATCH-FOCUSED",
];

export default function Landing() {
  const navigate = useNavigate();
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState(false);

  const startSession = () => {
    const code = genCode();
    createSession(code);
    navigate(`/session/${code}`);
  };

  const join = () => {
    const code = joinCode.trim().toUpperCase();
    if (!isValidCode(code)) {
      setJoinError(true);
      return;
    }
    navigate(`/session/${code}`);
  };

  const openDemo = () => {
    saveSession(demoSession());
    navigate(`/session/DEMO26/report`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* ------------------------------------------------ HERO */}
      <section className="grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="flex flex-wrap items-center gap-3">
            <span className="border-2 border-slate-900 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
              Form RH-1312
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-600">Mutual · Confidential</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-mono text-[13.5vw] font-bold uppercase leading-[0.92] tracking-tighter text-slate-900 sm:text-7xl lg:text-[5.4rem]"
          >
            Relation
            <br />
            ship&nbsp;HR
            <BlinkCaret />
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2} className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.35em] text-emerald-700 sm:text-sm">
            Mutual Compatibility Audit
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base"
          >
            Both of you fill out the identical 13-section application. Both of you get the report at the same time.
            No one judges anyone — the department evaluates{" "}
            <em className="font-semibold not-italic text-slate-900">the match</em>, never the people. Nobody here is
            the interviewer. Nobody gets rejected.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Btn variant="emerald" onClick={startSession} className="w-full sm:w-auto">
              [ Start New Match Session ] <ArrowRight className="h-4 w-4" />
            </Btn>
            <Btn variant="outline" onClick={() => setJoinOpen((v) => !v)} className="w-full sm:w-auto">
              <KeyRound className="h-4 w-4" /> [ Join Existing Session ]
            </Btn>
          </motion.div>

          <AnimatePresence>
            {joinOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden"
              >
                <div className="mt-4 border-2 border-dashed border-slate-400 bg-white p-4">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                    Enter 6-character match code
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={joinCode}
                      onChange={(e) => {
                        setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6));
                        setJoinError(false);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && join()}
                      placeholder="XK9F26"
                      className={`w-full max-w-[220px] border-2 bg-white px-4 py-3 font-mono text-lg font-bold uppercase tracking-[0.4em] text-slate-900 placeholder:text-slate-300 focus:outline-none ${
                        joinError ? "border-red-600" : "border-slate-900 focus:border-emerald-700"
                      }`}
                    />
                    <Btn variant="solid" onClick={join}>
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </Btn>
                  </div>
                  {joinError && (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-red-600">
                      Invalid code — 6 characters, letters &amp; digits
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            onClick={openDemo}
            className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500 underline decoration-dotted underline-offset-4 transition-colors hover:text-emerald-700"
          >
            <PlayCircle className="h-4 w-4" /> [ Try demo with sample data ]
          </motion.button>
        </div>

        {/* ------------------------------------------- sealed file visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.35 }}
          className="relative hidden lg:col-span-5 lg:block"
        >
          <div className="absolute left-8 top-10 h-full w-full rotate-3 border-2 border-slate-300 bg-white" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative -rotate-1 border-2 border-slate-900 bg-white p-6 shadow-[8px_8px_0_0_rgba(15,23,42,0.12)]"
          >
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em]">Sealed Case File</span>
              <FileLock2 className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-4 space-y-3 font-mono text-[10px] uppercase tracking-[0.18em]">
              <div className="flex justify-between border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-slate-400">Applicant A</span>
                <span className="bg-slate-900 px-2 text-white select-none">██████</span>
              </div>
              <div className="flex justify-between border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-slate-400">Applicant B</span>
                <span className="bg-slate-900 px-2 text-white select-none">██████</span>
              </div>
              <div className="flex justify-between border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-slate-400">Report status</span>
                <span className="text-amber-600">LOCKED — AWAITING 2 FILES</span>
              </div>
              <div className="grid grid-cols-8 gap-1 pt-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className={`h-2 ${i % 5 === 0 ? "bg-emerald-500/70" : "bg-slate-200"}`} />
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <Stamp tone="red" rotate={-6} className="text-[9px]">
                Open only in pairs
              </Stamp>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-300">RH-1312</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ------------------------------------------------ TICKER */}
      <div className="relative -mx-4 overflow-hidden border-y-2 border-slate-900 bg-slate-900 py-2.5 sm:-mx-6">
        <div className="rh-marquee flex w-max whitespace-nowrap">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {TICKER.concat(TICKER).map((t, i) => (
                <span key={`${dup}-${i}`} className="flex items-center font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
                  <span className="px-4">{t}</span>
                  <span className="text-slate-600">///</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ FEATURES */}
      <section className="grid gap-px border-2 border-slate-900 bg-slate-900 my-12 sm:grid-cols-2 sm:my-16 lg:grid-cols-4">
        {[
          {
            icon: ScanFace,
            title: "Equal Flow",
            body: "Both partners answer the identical 13-section application. There is no interviewer and no interviewee — only two equal applicants.",
          },
          {
            icon: FileLock2,
            title: "Mutual Reveal",
            body: "Your file is sealed the moment you submit. The report decrypts only when both applications are in — simultaneously, for both of you.",
          },
          {
            icon: HeartHandshake,
            title: "Match, Not Verdict",
            body: "Scores measure the pairing, never the person. Friction points arrive framed as conversation starters, not rejections.",
          },
          {
            icon: ShieldCheck,
            title: "Private By Design",
            body: "Fully client-side. Answers live in this browser and travel only inside links you choose to share. No servers, no accounts.",
          },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease, delay: i * 0.08 }}
            className="group bg-[#fafaf9] p-6 transition-colors hover:bg-white"
          >
            <div className="flex items-center justify-between">
              <f.icon className="h-5 w-5 text-slate-900 transition-colors group-hover:text-emerald-600" strokeWidth={1.75} />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-300">0{i + 1}</span>
            </div>
            <h3 className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.22em]">{f.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{f.body}</p>
          </motion.div>
        ))}
      </section>

      {/* ------------------------------------------------ PROTOCOL */}
      <section className="mb-16 sm:mb-24">
        <div className="mb-6 flex items-center gap-3">
          <StampIcon className="h-4 w-4 text-slate-400" />
          <h2 className="font-mono text-sm font-bold uppercase tracking-[0.25em]">Operating Protocol</h2>
          <div className="h-px flex-1 bg-slate-300" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400">3 steps</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Generate a match code",
              d: "One of you starts a session and receives a 6-character code plus a shareable link. Send it over any channel you like.",
            },
            {
              n: "02",
              t: "Both file applications",
              d: "Each applicant privately completes the same form. Drafts autosave — leave and resume anytime. You never see each other's answers.",
            },
            {
              n: "03",
              t: "Reports unlock together",
              d: "The instant the second file lands, the identical compatibility report opens for both: score, category audit, synergies, and talking points.",
            },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              className="border-2 border-slate-900 bg-white p-5 shadow-[5px_5px_0_0_rgba(15,23,42,0.08)]"
            >
              <span className="font-mono text-3xl font-bold text-slate-200">{s.n}</span>
              <h3 className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.2em]">{s.t}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
