import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CategoryRow, RatingPair } from "../types";

const MONO = { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.06em" } as const;

export function AlignmentRadar({ categories, nameA, nameB }: { categories: CategoryRow[]; nameA: string; nameB: string }) {
  const data = categories.map((c) => ({
    cat: c.name.split(" ")[0].replace("Emotional", "Emot.").replace("Financial", "Fin."),
    align: c.alignment,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
        <PolarAngleAxis dataKey="cat" tick={{ ...MONO, fill: "#475569" }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name={`${nameA} × ${nameB}`}
          dataKey="align"
          stroke="#0f172a"
          strokeWidth={2}
          fill="#10b981"
          fillOpacity={0.28}
          isAnimationActive
          animationDuration={1200}
        />
        <Tooltip
          contentStyle={{
            border: "2px solid #0f172a",
            borderRadius: 0,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            textTransform: "uppercase",
          }}
          formatter={(v) => [`${v}%`, "ALIGNMENT"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function RatingsBars({ pairs, nameA, nameB }: { pairs: RatingPair[]; nameA: string; nameB: string }) {
  const data = pairs.map((p) => ({ trait: p.label, A: p.a, B: p.b }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 12, right: 16, top: 4, bottom: 4 }} barGap={2}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" domain={[0, 10]} tick={{ ...MONO, fill: "#94a3b8" }} axisLine={{ stroke: "#0f172a" }} tickLine={false} />
        <YAxis
          type="category"
          dataKey="trait"
          width={104}
          tick={{ ...MONO, fill: "#475569", fontSize: 8.5 }}
          axisLine={{ stroke: "#0f172a" }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(15,23,42,0.04)" }}
          contentStyle={{
            border: "2px solid #0f172a",
            borderRadius: 0,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            textTransform: "uppercase",
          }}
        />
        <Bar dataKey="A" name={nameA.toUpperCase()} fill="#0f172a" isAnimationActive animationDuration={1000} />
        <Bar dataKey="B" name={nameB.toUpperCase()} fill="#94a3b8" isAnimationActive animationDuration={1000} animationBegin={150} />
      </BarChart>
    </ResponsiveContainer>
  );
}
