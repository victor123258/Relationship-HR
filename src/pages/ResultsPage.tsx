import { useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { isValidMatchCode } from "../lib/match-code";
import { useSession } from "../hooks/useSession";
import { computeCompatibility } from "../lib/algorithm";
import { clearRoleData } from "../lib/session";
import type { ReportInput } from "../types/report";
import { PageTransition } from "../components/layout/PageTransition";
import { ReportView } from "../components/report/ReportView";
import { ReportActions } from "../components/report/ReportActions";
import { toast } from "../components/ui/Toast";

export function ResultsPage() {
  const { code: rawCode = "" } = useParams();
  const code = rawCode.toUpperCase();
  const navigate = useNavigate();
  const session = useSession(code, true);

  const { personA, personB, myRole, created } = session;
  const bothSubmitted = personA.submitted && personB.submitted;

  const input: ReportInput | null = useMemo(() => {
    if (!bothSubmitted) return null;
    return {
      code,
      nameA: personA.name || "Person A",
      nameB: personB.name || "Person B",
      answersA: personA.answers,
      answersB: personB.answers,
      generatedAt: created ?? new Date().toISOString(),
    };
  }, [bothSubmitted, code, personA, personB, created]);

  const result = useMemo(() => (input ? computeCompatibility(input) : null), [input]);

  if (!isValidMatchCode(code)) return <Navigate to="/" replace />;

  // Mutual reveal enforcement — never render a partial report.
  if (!bothSubmitted) {
    if (myRole) {
      const mine = myRole === "personA" ? personA : personB;
      if (mine.submitted) return <Navigate to={`/session/${code}/waiting`} replace />;
      return <Navigate to={`/session/${code}/form`} replace />;
    }
    return <Navigate to={`/session/${code}`} replace />;
  }

  if (!input || !result) return null;

  const clearMine = myRole
    ? () => {
        clearRoleData(code, myRole);
        toast("Your data was erased from this browser");
        navigate(`/session/${code}`);
      }
    : undefined;

  return (
    <PageTransition>
      <div className="paper-bg">
        {code === "SAMPLE" && (
          <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
            <p className="rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/70 px-4 py-3 text-center font-mono text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
              Demo mode — this report is generated from sample applicants
            </p>
          </div>
        )}
        <ReportView
          input={input}
          result={result}
          actions={<ReportActions input={input} result={result} onClearMine={clearMine} />}
        />
      </div>
    </PageTransition>
  );
}
