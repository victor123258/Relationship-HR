import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Check,
  CheckCircle2,
  Download,
  Flag,
  HeartHandshake,
  Loader2,
  MessageSquareText,
  Quote,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { computeReport } from "../lib/algorithm";
import { useImportPayload } from "../lib/payload";
import { copyText, sessionUrl, useSession } from "../lib/session";
import type { ReportResult } from "../types";
import { Barcode, Btn, DashedRule, MonoTag, Stamp } from "../components/ui";
import { AlignmentRadar, RatingsBars } from "../components/Charts";
import { ScoreRing } from "../components/ScoreRing";

const ease = [0.22, 1, 0.36, 1] as const;

function AlignmentPill({ value, status }: { value: number; status: "good" | "warn" | "bad" }) {
  const Icon = status === "good" ? CheckCircle2 : status === "warn" ? AlertTriangle : Flag;
  const cls =
    status === "good"
      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
      : status === "warn"
        ? "border-amber-500 bg-amber-50 text-amber-600"
        : "border-red-600 bg-red-50 text-red-600";
  return (
    <span className={`inline-flex items-center gap-1.5 border-2 px-2.5 py-1 font-mono text-[10px] font-bold tabular-nums ${cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {value}%
    </span>
  );
}

function ListPanel({
  icon: Icon,
  title,
  items,
  accent,
  numbered,
  delay,
}: {
  icon: typeof Quote;
  title: string;
  items: string[];
  accent: "emerald" | "amber" | "slate";
  numbered?: boolean;
  delay: number;
}) {
  const accentCls =
    accent === "emerald" ? "text-emerald-600 border-emerald-600" : accent === "amber" ? "text-amber-500 border-amber-500" : "text-slate-600 border-slate-400";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease, delay }}
      className="pdf-block flex flex-col border-2 border-slate-900 bg-white p-5"
    >
      <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-3">
        <Icon className={`h-4 w-4 ${accentCls.split(" ")[0]}`} />
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center border-2 font-mono text-[9px] font-bold ${accentCls}`}
              style={{ width: 18, height: 18 }}
            >
              {numbered ? i + 1 : "■"}
            </span>
            <p className="text-xs leading-relaxed text-slate-600">{s}</p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Report() {
  const { code = "" } = useParams();
  const CODE = code.toUpperCase();
  const navigate = useNavigate();
  useImportPayload(CODE);
  const { session } = useSession(CODE);
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const bothIn = !!session?.a && !!session?.b;
  const report: ReportResult | null = useMemo(
    () => (session?.a && session?.b ? computeReport(session.a, session.b) : null),
    [session?.a, session?.b]
  );

  if (!bothIn) {
    return <Navigate to={`/session/${CODE}`} replace />;
  }
  if (!report || !session?.a || !session?.b) return null;

  const nameA = session.a.name;
  const nameB = session.b.name;
  const reportId = `RPT-${CODE}-${(report.generatedAt % 1000).toString().padStart(3, "0")}`;

  const share = async () => {
    const ok = await copyText(sessionUrl(CODE, session, "/report"));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const downloadPdf = async () => {
    if (!printRef.current || pdfBusy) return;
    setPdfBusy(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf: any = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: [10, 10, 12, 10],
          filename: `relationship-hr-report-${CODE}.pdf`,
          image: { type: "jpeg", quality: 0.96 },
          html2canvas: { scale: 2, backgroundColor: "#fafaf9", useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"], avoid: ".pdf-block" },
        } as any)
        .from(printRef.current)
        .save();
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Action row */}
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3">
        <Btn variant="outline" small onClick={() => navigate(`/session/${CODE}`)}>
          ← Session dashboard
        </Btn>
        <div className="flex flex-wrap gap-2">
          <Btn variant="outline" small onClick={share}>
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? "Link copied" : "Share report"}
          </Btn>
          <Btn variant="solid" small onClick={downloadPdf} disabled={pdfBusy}>
            {pdfBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            {pdfBusy ? "Rendering PDF…" : "Download as PDF"}
          </Btn>
          <Btn variant="ghost" small onClick={() => navigate("/")}>
            <RotateCcw className="h-3 w-3" /> Start new session
          </Btn>
        </div>
      </div>

      {/* ============================== PRINTABLE REPORT ============================== */}
      <div ref={printRef} className="space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="pdf-block relative overflow-hidden border-2 border-slate-900 bg-white p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 rotate-12 opacity-[0.05]">
            <HeartHandshake className="h-56 w-56" />
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <MonoTag>{reportId}</MonoTag>
                <MonoTag tone="slate">Identical copy issued to both applicants</MonoTag>
              </div>
              <h1 className="mt-4 font-mono text-2xl font-bold uppercase tracking-tight sm:text-4xl">
                Mutual Compatibility
                <br />
                Report
              </h1>
            </div>
            <Stamp tone={report.tone} rotate={-3} className="mt-2">
              {report.flags.length ? "Review required" : "Official audit"}
            </Stamp>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px border-2 border-slate-900 bg-slate-900 sm:grid-cols-4">
            {[
              ["Applicant A", nameA],
              ["Applicant B", nameB],
              ["Match code", CODE],
              ["Generated", new Date(report.generatedAt).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })],
            ].map(([k, v]) => (
              <div key={k} className="bg-white px-3 py-2.5">
                <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-slate-400">{k}</p>
                <p className="mt-0.5 truncate font-mono text-xs font-bold uppercase tracking-[0.08em]">{v}</p>
              </div>
            ))}
          </div>
        </motion.header>

        {/* Score */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="pdf-block grid gap-px border-2 border-slate-900 bg-slate-900 md:grid-cols-5"
        >
          <div className="flex flex-col items-center justify-center bg-white p-8 md:col-span-2">
            <ScoreRing score={report.overall} tone={report.tone} />
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400">
              Scored simultaneously · both see this exact page
            </p>
          </div>
          <div className="flex flex-col justify-center bg-white p-8 md:col-span-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
              Determination of the department
            </p>
            <div className="mt-3">
              <Stamp tone={report.tone} rotate={-1} className="text-xs sm:text-sm">
                [ {report.label} ]
              </Stamp>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600">{report.descriptor}</p>
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
              <span className="border border-slate-200 px-2 py-1">Engine score {report.engineScore}/100</span>
              <span className="border border-slate-200 px-2 py-1">
                {report.flags.length} value conflict{report.flags.length === 1 ? "" : "s"} flagged
              </span>
              <span className="border border-slate-200 px-2 py-1">0 rejections issued</span>
            </div>

            {report.flags.length > 0 && (
              <div className="mt-5 space-y-2">
                {report.flags.map((f) => (
                  <div key={f.id} className="flex items-start gap-3 border-2 border-dashed border-red-600 bg-red-50 px-4 py-3">
                    <Flag className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-red-600">{f.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* Category table */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease }}
          className="pdf-block border-2 border-slate-900 bg-white"
        >
          <div className="flex items-center justify-between border-b-2 border-slate-900 px-5 py-3.5">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em]">Category Audit — Both Sides Visible</h2>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 sm:block">EXHIBIT C</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b-2 border-slate-900 font-mono text-[9px] uppercase tracking-[0.22em] text-slate-400">
                  <th className="px-5 py-3 font-bold">Category</th>
                  <th className="px-5 py-3 font-bold">{nameA} (A)</th>
                  <th className="px-5 py-3 font-bold">{nameB} (B)</th>
                  <th className="px-5 py-3 text-right font-bold">Alignment</th>
                </tr>
              </thead>
              <tbody>
                {report.categories.map((c, i) => (
                  <motion.tr
                    key={c.key}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="border-b border-slate-200 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-900">{c.name}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-slate-600">{c.aDisplay}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-slate-600">{c.bDisplay}</td>
                    <td className="px-5 py-3.5 text-right">
                      <AlignmentPill value={c.alignment} status={c.status} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t-2 border-slate-900 px-5 py-2.5">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-slate-400">
              Legend — ≥80% aligned · 55–79% calibrate · &lt;55% talk first. Displays are summaries, never raw files.
            </p>
          </div>
        </motion.section>

        {/* Charts */}
        <section className="pdf-block grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease }}
            className="border-2 border-slate-900 bg-white p-5"
          >
            <div className="mb-2 flex items-center gap-2 border-b-2 border-slate-900 pb-3">
              <BarChart3 className="h-4 w-4" />
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]">Alignment radar</h3>
            </div>
            <AlignmentRadar categories={report.categories} nameA={nameA} nameB={nameB} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="border-2 border-slate-900 bg-white p-5"
          >
            <div className="mb-2 flex items-center gap-2 border-b-2 border-slate-900 pb-3">
              <BarChart3 className="h-4 w-4" />
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]">Self-ratings, side by side</h3>
            </div>
            <RatingsBars pairs={report.ratingPairs} nameA={nameA} nameB={nameB} />
          </motion.div>
        </section>

        {/* Lists */}
        <section className="grid gap-6 lg:grid-cols-3">
          <ListPanel icon={CheckCircle2} title="Synergy highlights" items={report.synergies} accent="emerald" delay={0} />
          <ListPanel icon={AlertTriangle} title="Areas to discuss together" items={report.frictions} accent="amber" delay={0.08} />
          <ListPanel icon={MessageSquareText} title="Suggested conversation starters" items={report.starters} accent="slate" numbered delay={0.16} />
        </section>

        {/* Closing */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pdf-block border-2 border-slate-900 bg-slate-900 p-6 text-white sm:p-8"
        >
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">
                Closing statement of the department
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                This audit evaluated <span className="font-semibold text-white">the match</span> — the space between
                two applications — never the applicants themselves. No person was approved, rejected, ranked, or filed
                under "problem." Take the synergies as fuel and the friction items as the agenda for your next real
                conversation.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Barcode className="[&>span]:bg-white" />
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-500">{reportId}</span>
            </div>
          </div>
          <DashedRule className="my-5 border-slate-700" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
              Signed simultaneously for {nameA} &amp; {nameB} — no signatures required, only conversations.
            </p>
            <Stamp tone="emerald" rotate={2} className="text-[9px]">
              Match, not verdict
            </Stamp>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
