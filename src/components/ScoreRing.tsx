import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function ScoreRing({ score, size = 220, tone }: { score: number; size?: number; tone: string }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 40, damping: 16 });
  const display = useTransform(spring, (v) => `${Math.round(v)}`);
  const dash = useTransform(spring, (v) => c - (v / 100) * c);

  useEffect(() => {
    mv.set(score);
  }, [score, mv]);

  const strokeColor =
    tone === "emerald" ? "#059669" : tone === "amber" ? "#f59e0b" : tone === "red" ? "#dc2626" : "#0f172a";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r - stroke - 6}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={1}
          strokeDasharray="2 6"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={c}
          style={{ strokeDashoffset: dash }}
        />
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = (i / 40) * Math.PI * 2;
          const x1 = size / 2 + Math.cos(angle) * (r - stroke / 2 - 10);
          const y1 = size / 2 + Math.sin(angle) * (r - stroke / 2 - 10);
          const x2 = size / 2 + Math.cos(angle) * (r - stroke / 2 - 14);
          const y2 = size / 2 + Math.sin(angle) * (r - stroke / 2 - 14);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth={1} />;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-baseline font-mono font-bold text-slate-900">
          <motion.span className="text-5xl sm:text-6xl tabular-nums">{display}</motion.span>
          <span className="text-xl text-slate-400">%</span>
        </div>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400">Match Index</span>
      </div>
    </div>
  );
}
