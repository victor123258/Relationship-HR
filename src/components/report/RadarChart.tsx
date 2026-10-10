import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as ReRadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CATEGORIES } from "../../lib/scoring-rules";
import type { ScoringResult } from "../../types/report";

const SHORT_LABELS: Record<string, string> = {
  communication: "Comm.",
  emotional: "Emotional",
  values: "Values",
  financial: "Financial",
  love: "Love",
  boundaries: "Boundaries",
  accountability: "Accountab.",
};

export function CategoryRadar({
  result,
  nameA,
  nameB,
}: {
  result: ScoringResult;
  nameA: string;
  nameB: string;
}) {
  const data = CATEGORIES.map((c) => ({
    category: SHORT_LABELS[c.key],
    A: result.personScores.A[c.key],
    B: result.personScores.B[c.key],
  }));

  return (
    <div className="h-[320px] w-full sm:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#94a3b8" strokeOpacity={0.45} />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={nameA}
            dataKey="A"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.28}
            strokeWidth={2.5}
            isAnimationActive
            animationDuration={1200}
          />
          <Radar
            name={nameB}
            dataKey="B"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.22}
            strokeWidth={2.5}
            isAnimationActive
            animationDuration={1400}
          />
          <Tooltip
            contentStyle={{
              background: "var(--tooltip-bg, #fff)",
              border: "2px solid #0f172a",
              borderRadius: 10,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 12,
            }}
            formatter={(value) => [`${value}/100`]}
          />
        </ReRadarChart>
      </ResponsiveContainer>
      <div className="mt-1 flex items-center justify-center gap-6 font-mono text-[11px] font-bold uppercase tracking-wider">
        <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" /> {nameA}
        </span>
        <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> {nameB}
        </span>
      </div>
    </div>
  );
}
