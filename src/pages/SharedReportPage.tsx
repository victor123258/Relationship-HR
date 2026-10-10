import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { decodePayload } from "../lib/url-codec";
import { computeCompatibility } from "../lib/algorithm";
import type { ReportInput, SharedReportPayload } from "../types/report";
import { PageTransition } from "../components/layout/PageTransition";
import { ReportView } from "../components/report/ReportView";
import { ReportActions } from "../components/report/ReportActions";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export function SharedReportPage() {
  const { data = "" } = useParams();

  const payload = useMemo(() => decodePayload<SharedReportPayload>(data), [data]);

  const result = useMemo(() => {
    if (!payload || payload.v !== 1) return null;
    const input: ReportInput = { ...payload, generatedAt: payload.generatedAt || new Date().toISOString() };
    return { input, scoring: computeCompatibility(input) };
  }, [payload]);

  if (!payload || !result) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-md px-4 py-16">
          <Card className="p-8 text-center">
            <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-amber-500" />
            <h1 className="font-mono text-lg font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Invalid or corrupted link
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This shared report link couldn't be decoded. Ask for a fresh one.
            </p>
            <Link to="/" className="mt-6 inline-block">
              <Button>Go Home</Button>
            </Link>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="paper-bg">
        <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
          <Badge tone="accent" className="mx-auto block w-fit">
            Shared report — decoded locally, nothing fetched
          </Badge>
        </div>
        <ReportView
          input={result.input}
          result={result.scoring}
          actions={<ReportActions input={result.input} result={result.scoring} />}
        />
      </div>
    </PageTransition>
  );
}
