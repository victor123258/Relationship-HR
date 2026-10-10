import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function SynergyList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.07, duration: 0.35 }}
          className="flex items-start gap-3 rounded-lg border-2 border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-900 dark:bg-emerald-950/25"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}
