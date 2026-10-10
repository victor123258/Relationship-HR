import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CloudDownload, ShieldAlert } from "lucide-react";
import { decodePayload } from "../lib/url-codec";
import { importParticipant } from "../lib/session";
import { isValidMatchCode } from "../lib/match-code";
import type { HandoffPayload } from "../types/report";
import { PageTransition } from "../components/layout/PageTransition";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { toast } from "../components/ui/Toast";

/**
 * Receives a partner's sealed answers via handoff link (encoded in the URL),
 * stores them locally, and lands on the session dashboard so the visitor
 * can apply as the other applicant.
 */
export function ImportPage() {
  const { code: rawCode = "", data = "" } = useParams();
  const code = rawCode.toUpperCase();
  const navigate = useNavigate();
  const [state, setState] = useState<"working" | "error">("working");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const payload = decodePayload<HandoffPayload>(data);
    if (!payload || payload.v !== 1 || !isValidMatchCode(code) || (payload.code && payload.code !== code)) {
      setState("error");
      return;
    }
    importParticipant(code, payload.role, payload.name, payload.answers);
    toast(`${payload.name || "Your partner"}'s sealed answers received`, "success");
    const t = window.setTimeout(() => navigate(`/session/${code}`, { replace: true }), 900);
    return () => window.clearTimeout(t);
  }, [code, data, navigate]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-md px-4 py-16">
        <Card className="p-8 text-center">
          {state === "working" ? (
            <>
              <CloudDownload className="mx-auto mb-4 h-10 w-10 animate-bounce text-indigo-500" />
              <h1 className="font-mono text-lg font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Receiving sealed answers…
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Decoding handoff locally. Opening your session dashboard next.
              </p>
            </>
          ) : (
            <>
              <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-amber-500" />
              <h1 className="font-mono text-lg font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Handoff link invalid
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                This link couldn't be decoded. Ask your partner to copy it again — the whole thing, it's long.
              </p>
              <Link to="/" className="mt-6 inline-block">
                <Button>Go Home</Button>
              </Link>
            </>
          )}
        </Card>
      </div>
    </PageTransition>
  );
}
