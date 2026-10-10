import { motion } from "framer-motion";
import { Stamp } from "lucide-react";
import type { ReportInput, ScoringResult } from "../../types/report";
import { formatLongDate } from "../../lib/utils";
import { Card, Divider, SectionHeading } from "../ui/Card";
import { OverallScore } from "./OverallScore";
import { CategoryRadar } from "./RadarChart";
import { CategoryTable } from "./CategoryTable";
import { SynergyList } from "./SynergyList";
import { FrictionList } from "./FrictionList";
import { ConversationStarters } from "./ConversationStarters";
import { ReflectionCompare } from "./ReflectionCompare";

function Section({
  index,
  title,
  children,
  delay = 0,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <SectionHeading index={index} title={title} done className="mb-4" />
      {children}
    </motion.section>
  );
}

export function ReportView({
  input,
  result,
  actions,
}: {
  input: ReportInput;
  result: ScoringResult;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
      {/* Report header — terminal document */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-xl border-2 border-slate-900 bg-slate-900 p-1.5 hard-shadow-lg dark:border-slate-200 dark:bg-slate-800">
          <div className="rounded-lg border border-slate-700 px-5 py-5 text-center sm:px-8">
            <div className="flex items-center justify-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-300">
              <Stamp className="h-3.5 w-3.5" />
              Confidential · Issued to both applicants
            </div>
            <h1 className="mt-3 font-mono text-2xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
              Mutual Compatibility Report
            </h1>
            <div className="mx-auto mt-4 h-px w-40 bg-slate-600" />
            <dl className="mx-auto mt-4 grid max-w-lg gap-1.5 text-left font-mono text-[11px] uppercase tracking-wider sm:grid-cols-2 sm:text-xs">
              <div className="flex justify-between gap-4 sm:justify-start sm:gap-2">
                <dt className="text-slate-500">Session:</dt>
                <dd className="font-bold text-slate-200">{input.code}</dd>
              </div>
              <div className="flex justify-between gap-4 sm:justify-start sm:gap-2">
                <dt className="text-slate-500">Generated:</dt>
                <dd className="font-bold text-slate-200">{formatLongDate(input.generatedAt)}</dd>
              </div>
              <div className="flex justify-between gap-4 sm:col-span-2 sm:justify-start sm:gap-2">
                <dt className="text-slate-500">Participants:</dt>
                <dd className="font-bold text-slate-200">
                  <span className="text-indigo-300">{input.nameA}</span>
                  <span className="mx-2 text-slate-500">×</span>
                  <span className="text-emerald-300">{input.nameB}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </motion.div>

      {/* 1 — Overall score */}
      <Section index={1} title="Overall Match Score">
        <Card className="p-6 sm:p-8">
          <OverallScore result={result} nameA={input.nameA} nameB={input.nameB} />
        </Card>
      </Section>

      {/* 2 — Radar */}
      <Section index={2} title="Category Radar — Both Applicants">
        <Card className="p-4 sm:p-6">
          <p className="mb-2 px-2 text-center text-xs text-slate-500 dark:text-slate-400">
            Each axis shows how that applicant personally leans within the category (higher = stronger outward tendency). Overlap = natural similarity.
          </p>
          <CategoryRadar result={result} nameA={input.nameA} nameB={input.nameB} />
        </Card>
      </Section>

      {/* 3 — Category breakdown */}
      <Section index={3} title="Category Breakdown">
        <CategoryTable rows={result.categoryRows} nameA={input.nameA} nameB={input.nameB} />
        <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-wider text-slate-400">
          Tap a row to inspect contributing answers
        </p>
      </Section>

      {/* 4 — Synergy */}
      {result.synergyHighlights.length > 0 && (
        <Section index={4} title="Synergy Highlights">
          <SynergyList items={result.synergyHighlights} />
        </Section>
      )}

      {/* 5 — Friction */}
      {result.frictionPoints.length > 0 && (
        <Section index={5} title="Areas to Explore Together">
          <FrictionList items={result.frictionPoints} />
        </Section>
      )}

      {/* 6 — Conversation starters */}
      {result.conversationStarters.length > 0 && (
        <Section index={6} title="Suggested Conversation Starters">
          <ConversationStarters items={result.conversationStarters} />
        </Section>
      )}

      {/* 7 — Reflections */}
      <Section index={7} title="Side-by-Side: Final Reflections">
        <ReflectionCompare answersA={input.answersA} answersB={input.answersB} nameA={input.nameA} nameB={input.nameB} />
      </Section>

      {actions && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Divider className="mb-6" />
          {actions}
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-slate-400">
            End of report · This document evaluates the match, never the people
          </p>
        </motion.div>
      )}
    </div>
  );
}
