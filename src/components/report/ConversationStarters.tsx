import { motion } from "framer-motion";
import { MessagesSquare } from "lucide-react";

export function ConversationStarters({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ol className="space-y-2.5">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
          className="flex items-start gap-3 rounded-lg border-2 border-indigo-200 bg-indigo-50/60 p-3 dark:border-indigo-900 dark:bg-indigo-950/25"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-indigo-400 bg-white font-mono text-[10px] font-extrabold text-indigo-600 dark:bg-slate-900 dark:text-indigo-300">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-sm italic leading-relaxed text-indigo-950 dark:text-indigo-100">
            <MessagesSquare className="mr-1.5 inline h-3.5 w-3.5 align-[-2px] text-indigo-400" />
            {item}
          </span>
        </motion.li>
      ))}
    </ol>
  );
}
