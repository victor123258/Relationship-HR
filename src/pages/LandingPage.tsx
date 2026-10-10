import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ClipboardList,
  FlaskConical,
  HeartHandshake,
  Link2,
  PenLine,
  Radar,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { generateMatchCode, isValidMatchCode, normalizeMatchCode } from "../lib/match-code";
import { ensureSession, importParticipant } from "../lib/session";
import { DEMO_CODE, DEMO_NAME_A, DEMO_NAME_B, SAMPLE_ANSWERS_A, SAMPLE_ANSWERS_B } from "../data/sample-data";
import { PageTransition, StaggerGroup, StaggerItem } from "../components/layout/PageTransition";
import { Card, Divider } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { toast } from "../components/ui/Toast";

const HOW_IT_WORKS = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Open a session",
    text: "One person starts a session and shares the 6-character match code.",
  },
  {
    icon: PenLine,
    step: "02",
    title: "Both apply, equally",
    text: "Both partners fill the identical application independently. Nobody sees the other's answers.",
  },
  {
    icon: Radar,
    step: "03",
    title: "Mutual reveal",
    text: "The report unlocks for both of you at the same time — only when both have submitted.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const startNew = () => {
    const code = generateMatchCode();
    ensureSession(code);
    navigate(`/session/${code}`);
  };

  const join = () => {
    const code = normalizeMatchCode(joinCode);
    if (!isValidMatchCode(code)) {
      toast("Invalid code — 6 letters/digits, no O, 0, I or 1", "warning");
      return;
    }
    setJoinCode(code);
    navigate(`/session/${code}`);
  };

  const runDemo = () => {
    ensureSession(DEMO_CODE);
    importParticipant(DEMO_CODE, "personA", DEMO_NAME_A, SAMPLE_ANSWERS_A);
    importParticipant(DEMO_CODE, "personB", DEMO_NAME_B, SAMPLE_ANSWERS_B);
    toast("Demo session loaded", "info");
    navigate(`/session/${DEMO_CODE}/results`);
  };

  return (
    <PageTransition>
      <div className="paper-bg">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
          <StaggerGroup>
            {/* Letterhead */}
            <StaggerItem>
              <p className="text-center font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                Form R-13 · Mutual Application · Dept. of Two
              </p>
              <Divider className="mx-auto mt-3 max-w-xs" />
            </StaggerItem>

            {/* Hero */}
            <StaggerItem className="mt-8 text-center">
              <motion.div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-slate-900 bg-indigo-500 text-white hard-shadow dark:border-slate-200"
                whileHover={{ rotate: -6, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
              >
                <HeartHandshake className="h-8 w-8" strokeWidth={2.2} />
              </motion.div>
              <h1 className="font-mono text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                RELATIONSHIP HR<span className="text-indigo-600 dark:text-indigo-400">™</span>
              </h1>
              <p className="mt-2 font-mono text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-base">
                Mutual Compatibility Audit
              </p>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                <em>“Both of you fill it out. Both of you get the report. No one judges anyone — the match speaks for itself.”</em>
              </p>
              <div className="mt-5 inline-block -rotate-2">
                <span className="stamp text-xs text-emerald-600 dark:text-emerald-400">Mutual by design</span>
              </div>
            </StaggerItem>

            {/* How it works */}
            <StaggerItem className="mt-12">
              <div className="grid gap-4 sm:grid-cols-3">
                {HOW_IT_WORKS.map((item) => (
                  <Card key={item.step} className="relative overflow-hidden p-5">
                    <span className="absolute -right-2 -top-4 font-mono text-6xl font-extrabold text-slate-100 dark:text-slate-800">
                      {item.step}
                    </span>
                    <span className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-900 bg-white hard-shadow-sm dark:border-slate-200 dark:bg-slate-950">
                      <item.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </span>
                    <h3 className="relative font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h3>
                    <p className="relative mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                      {item.text}
                    </p>
                  </Card>
                ))}
              </div>
            </StaggerItem>

            {/* Actions */}
            <StaggerItem className="mt-10">
              <Card className="dot-bg p-6 sm:p-8">
                <p className="mb-5 flex items-center justify-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <ScanLine className="h-4 w-4 text-indigo-500" />
                  Begin intake procedure
                </p>
                <div className="mx-auto flex max-w-md flex-col gap-3">
                  <Button size="lg" onClick={startNew} className="w-full">
                    <Sparkles className="h-4 w-4" />
                    Start New Match Session
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setJoinOpen((o) => !o)}
                    aria-expanded={joinOpen}
                  >
                    <Link2 className="h-4 w-4" />
                    Join Existing Session
                  </Button>

                  <AnimatePresence initial={false}>
                    {joinOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white/70 p-3 dark:border-slate-600 dark:bg-slate-950/50">
                          <Input
                            value={joinCode}
                            onChange={(e) => setJoinCode(normalizeMatchCode(e.target.value))}
                            onKeyDown={(e) => e.key === "Enter" && join()}
                            placeholder="e.g. XK9F26"
                            maxLength={6}
                            className="text-center font-mono text-lg font-bold uppercase tracking-[0.3em]"
                            aria-label="Match code"
                          />
                          <Button variant="accent" onClick={join} className="shrink-0 px-5">
                            Join
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Divider className="my-1" />
                  <Button variant="ghost" size="md" onClick={runDemo} className="w-full border-2 border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-indigo-400">
                    <FlaskConical className="h-4 w-4" />
                    Try Demo with Sample Data
                  </Button>
                </div>
              </Card>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </div>
    </PageTransition>
  );
}
