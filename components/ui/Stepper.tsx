import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export function Stepper({
  steps,
  current
}: {
  steps: string[];
  current: number; // 0-index
}) {
  const progress = Math.max(0, Math.min(1, (current + 1) / steps.length));
  return (
    <div className="glass rounded-2xl p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-white">Progress</div>
        <div className="text-xs font-semibold text-white">
          Step {current + 1}/{steps.length}
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-brand-accent-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {steps.map((s, idx) => (
          <span
            key={s}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              idx === current ? "bg-[rgba(6,182,212,0.18)] text-white" : "bg-white/10 text-white"
            )}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
