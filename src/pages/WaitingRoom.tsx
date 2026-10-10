import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Link2, Link as LinkIcon, Lightbulb, Timer } from "lucide-react";
import { isValidMatchCode } from "../lib/match-code";
import { useSession } from "../hooks/useSession";
import { buildShareUrl, encodePayload } from "../lib/url-codec";
import { copyToClipboard } from "../lib/utils";
import type { HandoffPayload } from "../types/report";
import { PageTransition } from "../components/layout/PageTransition";
import { Card, Divider } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { toast } from "../components/ui/Toast";
import { PulsingDots, WaitingAnimation } from "../components/session/WaitingAnimation";

const FACTS = [
  "Couples who laugh together regularly report 67% higher relationship satisfaction.",
  "The #1 predictor of relationship longevity isn't compatibility — it's how conflicts get repaired.",
  "Sharing new experiences together releases dopamine that mimics early-stage attraction.",
  "Partners who express appreciation daily are significantly less likely to split within 5 years.",
  "The average 'argument hangover' lasts 4 hours. A genuine repair attempt cuts it to minutes.",
  "Feeling heard matters more to most people than being agreed with.",
  "Small consistent gestures beat grand occasional ones — by a wide margin.",
  "Couples who ask each other open questions weekly report deeper intimacy within 8 weeks.",
];

export function WaitingRoom() {
  const { code: rawCode = "" } = useParams();
  const code = rawCode.toUpperCase();
  const navigate = useNavigate();
  const session = useSession(code, true);
  const [factIdx, setFactIdx] = useState(0);

  const { personA, personB, myRole } = session;
  const bothSubmitted = personA.submitted && personB.submitted;
  const mine = myRole ? (myRole === "personA" ? personA : personB) : null;
  const other = myRole ? (myRole === "personA" ? personB : personA) : null;

  useEffect(() => {
    if (bothSubmitted) {
      const t = window.setTimeout(() => navigate(`/session/${code}/results`), 900);
      return () => window.clearTimeout(t);
    }
  }, [bothSubmitted, code, navigate]);

  useEffect(() => {
    const id = window.setInterval(() => setFactIdx((i) => (i + 1) % FACTS.length), 10_000);
    return () => window.clearInterval(id);
  }, []);

  const handoffUrl = useMemo(() => {
    if (!mine) return null;
    const payload: HandoffPayload = {
      v: 1,
      code,
      role: myRole!,
      name: mine.name,
      answers: mine.answers,
    };
    return buildShareUrl(`/session/${code}/import/${encodePayload(payload)}`);
  }, [mine, code, myRole]);

  if (!isValidMatchCode(code)) return <Navigate to="/" replace />;
  if (!myRole) return <Navigate to={`/session/${code}`} replace />;
  if (mine && !mine.submitted) return <Navigate to={`/session/${code}/form`} replace />;

  const copy = async (text: string, label: string) => {
    const ok = await copyToClipboard(text);
    toast(ok ? `${label} copied` : "Copy failed", ok ? "success" : "warning");
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-center">
          <WaitingAnimation />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="mt-8 flex items-center justify-center gap-2 font-mono text-xl font-extrabold uppercase tracking-wider text-slate-900 dark:text-white sm:text-2xl">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              Application submitted
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Waiting for your partner to complete theirs <PulsingDots />
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <Timer className="h-3.5 w-3.5" /> The form takes about 10–15 minutes
            </p>
          </motion.div>
        </div>

        <div className="mt-8 grid gap-5">
          <Card className="p-5">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Live status
            </p>
            <div className="space-y-2 font-mono text-xs uppercase tracking-wider">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">You ({mine?.name || "Applicant"})</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Submitted ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Partner ({other?.name || "Pending"})</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {other?.submitted ? "Submitted ✓" : other?.exists ? "Filling out…" : "Not started"}
                </span>
              </div>
            </div>
            <Divider className="my-4" />
            <p className="text-[11px] leading-relaxed text-slate-400">
              This page updates automatically. The moment both applications are in, the report unlocks
              for both of you — simultaneously.
            </p>
          </Card>

          <Card className="p-5">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Make sure your partner has the link
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => copy(buildShareUrl(`/session/${code}`), "Session link")}>
                <Link2 className="h-3.5 w-3.5" /> Copy session link
              </Button>
              {handoffUrl && (
                <Button variant="accent" size="sm" onClick={() => copy(handoffUrl, "Handoff link")}>
                  <LinkIcon className="h-3.5 w-3.5" /> Copy handoff link (2nd device)
                </Button>
              )}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              Partner on a <strong>different device</strong>? Send them the handoff link — it securely
              carries your sealed answers to their browser (encoded in the URL itself — no server involved).
            </p>
          </Card>

          <Card className="overflow-hidden p-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div className="min-h-[44px]">
                <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Did you know?
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={factIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                  >
                    {FACTS[factIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
