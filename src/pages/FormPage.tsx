import { Navigate, useNavigate, useParams } from "react-router-dom";
import { isValidMatchCode } from "../lib/match-code";
import { useSession } from "../hooks/useSession";
import { PageTransition } from "../components/layout/PageTransition";
import { FormWizard } from "../components/form/FormWizard";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LockKeyhole } from "lucide-react";

export function FormPage() {
  const { code: rawCode = "" } = useParams();
  const code = rawCode.toUpperCase();
  const navigate = useNavigate();
  const session = useSession(code);

  if (!isValidMatchCode(code)) return <Navigate to="/" replace />;

  const { myRole } = session;

  if (!myRole) {
    return <Navigate to={`/session/${code}`} replace />;
  }

  const mine = myRole === "personA" ? session.personA : session.personB;
  if (mine.submitted) {
    return <Navigate to={`/session/${code}/waiting`} replace />;
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-mono text-lg font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Relationship Application Form
            </h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-slate-400">
              Applicant: {myRole === "personA" ? "Person A" : "Person B"} · Session {code}
            </p>
          </div>
          <Card className="flex items-center gap-2 px-3 py-2">
            <LockKeyhole className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Your answers are private — sealed until mutual submission.
            </span>
          </Card>
        </div>

        <FormWizard code={code} role={myRole} onSubmitted={() => navigate(`/session/${code}/waiting`)} />

        <div className="mt-6 text-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/session/${code}`)} className="text-slate-400">
            ← Back to session (progress is saved)
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
