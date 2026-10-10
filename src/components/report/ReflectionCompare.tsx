import { Quote } from "lucide-react";
import { getQuestion } from "../../data/questions";
import type { AnswerMap } from "../../types/form";
import { motion } from "framer-motion";

const REFLECTION_IDS = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];

function AnswerCard({ name, value, accent }: { name: string; value: string; accent: "indigo" | "emerald" }) {
  const border = accent === "indigo" ? "border-indigo-300 dark:border-indigo-800" : "border-emerald-300 dark:border-emerald-800";
  const chip = accent === "indigo" ? "bg-indigo-600" : "bg-emerald-600";
  return (
    <div className={`relative rounded-xl border-2 ${border} bg-white p-4 pt-5 dark:bg-slate-950`}>
      <span className={`absolute -top-2.5 left-3 rounded-md border-2 border-slate-900 px-2 py-0.5 font-mono text-[9px] font-extrabold uppercase tracking-widest text-white dark:border-slate-200 ${chip}`}>
        {name}
      </span>
      <Quote className="mb-1.5 h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
      <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
        {value.trim() ? value : <span className="text-slate-400">No answer provided.</span>}
      </p>
    </div>
  );
}

export function ReflectionCompare({
  answersA,
  answersB,
  nameA,
  nameB,
}: {
  answersA: AnswerMap;
  answersB: AnswerMap;
  nameA: string;
  nameB: string;
}) {
  return (
    <div className="space-y-6">
      {REFLECTION_IDS.map((id, i) => {
        const q = getQuestion(id);
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.2) }}
          >
            <p className="mb-3 flex items-baseline gap-2">
              <span className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                {id.toUpperCase()}
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{q?.label}</span>
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <AnswerCard name={nameA} value={String(answersA[id] ?? "")} accent="indigo" />
              <AnswerCard name={nameB} value={String(answersB[id] ?? "")} accent="emerald" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
