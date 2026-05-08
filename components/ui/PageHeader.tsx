import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  subtitle,
  right
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-xs font-semibold uppercase tracking-wider text-white"
          >
            {kicker}
          </motion.div>
        ) : null}
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-1 font-display text-3xl font-extrabold tracking-tight text-white"
        >
          {title}
        </motion.div>
        {subtitle ? <div className="mt-1 text-sm text-white leading-relaxed">{subtitle}</div> : null}
      </div>
      {right ? <div className="flex flex-wrap gap-2">{right}</div> : null}
    </div>
  );
}
