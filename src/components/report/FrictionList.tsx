import { motion } from "framer-motion";
import { Sprout } from "lucide-react";

export function FrictionList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-3 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50/60 p-3 text-xs leading-relaxed text-amber-800 dark:border-amber-800 dark:bg-amber-950/25 dark:text-amber-200">
        These are <strong>growth opportunities and conversation starters</strong> — not criticisms.
        Every strong relationship has a working list.
      </p>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            className="flex items-start gap-3 rounded-lg border-2 border-amber-200 bg-white p-3 dark:border-amber-900 dark:bg-slate-900"
          >
            <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
