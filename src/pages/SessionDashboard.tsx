import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Eye, MonitorSmartphone, RotateCcw, ShieldCheck } from "lucide-react";
import { isValidMatchCode } from "../lib/match-code";
import { nukeSession, setMyRole } from "../lib/session";
import { useSession } from "../hooks/useSession";
import type { Role } from "../types/session";
import { PageTransition } from "../components/layout/PageTransition";
import { Card, SectionHeading, Divider } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { toast } from "../components/ui/Toast";
import { MatchCodeDisplay } from "../components/session/MatchCodeDisplay";
import { ParticipantStatusRow } from "../components/session/ParticipantStatus";

export function SessionDashboard() {
  const { code: rawCode = "" } = useParams();
  const code = rawCode.toUpperCase();
  const navigate = useNavigate();
  const session = useSession(code, true);
  const [resetOpen, setResetOpen] = useState(false);

  if (!isValidMatchCode(code)) return <Navigate to="/" replace />;

  const { personA, personB, myRole } = session;
  const bothSubmitted = personA.submitted && personB.submitted;

  const begin = (role: Role) => {
    setMyRole(code, role);
    toast(`You're applying as ${role === "personA" ? "Person A" : "Person B"}`, "info");
    navigate(`/session/${code}/form`);
  };

  // Slot visibility rules — equal flow, first-come role assignment
  const aAction =
    !personA.submitted &&
    (myRole === "personA" || myRole === null || (myRole === "personB" && !personA.exists))
      ? () => begin("personA")
      : undefined;
  const bAction =
    !personB.submitted &&
    (myRole === "personB" || (myRole === null && personA.exists) || (myRole === "personA" && !personB.exists))
      ? () => begin("personB")
      : undefined;

  const noSlotAvailable =
    !bothSubmitted && !aAction && !bAction && myRole === null && personA.exists && personB.exists;

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <SectionHeading title="Session Dashboard" done={personA.exists || personB.exists} className="mb-6" />

        <div className="grid gap-5">
          <MatchCodeDisplay code={code} />

          <Card className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Match session: <span className="text-slate-900 dark:text-white">{code}</span>
              </h3>
              {bothSubmitted && (
                <span className="stamp text-[9px] text-emerald-600 dark:text-emerald-400">Ready for review</span>
              )}
            </div>

            <div className="space-y-3">
              <ParticipantStatusRow
                label="Applicant A"
                slot="A"
                participant={personA}
                isMe={myRole === "personA"}
                onStart={aAction}
                startLabel={
                  myRole === "personA" && personA.exists
                    ? "Continue My Application"
                    : personA.exists
                      ? "Resume This Application"
                      : undefined
                }
              />
              <ParticipantStatusRow
                label="Applicant B"
                slot="B"
                participant={personB}
                isMe={myRole === "personB"}
                onStart={bAction}
                startLabel={
                  myRole === "personB" && personB.exists
                    ? "Continue My Application"
                    : personB.exists
                      ? "Resume This Application"
                      : undefined
                }
              />
            </div>

            {noSlotAvailable && (
              <p className="mt-4 rounded-lg border-2 border-amber-400 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                This session already has two participants on this device. If one of them is you,
                continue from that applicant's card — otherwise start a fresh session from the home page.
              </p>
            )}

            <Divider className="my-5" />

            {bothSubmitted ? (
              <Button size="lg" variant="success" className="w-full" onClick={() => navigate(`/session/${code}/results`)}>
                <Eye className="h-4 w-4" />
                View Mutual Compatibility Report
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <p>
                  Results stay sealed until <strong>both</strong> applications are submitted — neither of you
                  can peek early. Answers are never shown to the other person during entry.
                </p>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <MonitorSmartphone className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500" />
              <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                  Two devices? No problem.
                </p>
                <p>
                  Open the shared link on both devices. After the first person submits, they'll get a
                  secure <strong>handoff link</strong> that carries their sealed answers to the second device —
                  still 100% server-free.
                </p>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={() => setResetOpen(true)} className="text-slate-400 hover:text-red-500">
              <RotateCcw className="h-3 w-3" />
              Reset this session
            </Button>
          </div>
        </div>

        <Modal
          open={resetOpen}
          onClose={() => setResetOpen(false)}
          title="Reset session?"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setResetOpen(false)}>Cancel</Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  nukeSession(code);
                  setResetOpen(false);
                  toast("Session data cleared");
                  navigate("/");
                }}
              >
                <RotateCcw className="h-3 w-3" />
                Reset Everything
              </Button>
            </>
          }
        >
          This erases <strong>both</strong> applicants' answers for session <strong>{code}</strong> on this
          device. This cannot be undone.
        </Modal>
      </div>
    </PageTransition>
  );
}
