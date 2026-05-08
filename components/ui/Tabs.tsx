import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export function Tabs({
  value,
  onChange,
  tabs
}: {
  value: string;
  onChange: (v: string) => void;
  tabs: { value: string; label: string; icon?: ReactNode }[];
}) {
  return (
    <div className="glass relative inline-flex w-full flex-wrap gap-1 rounded-2xl p-1 shadow-soft">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition",
              active ? "text-white" : "text-white"
            )}
          >
            {active ? (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-2xl bg-white/10 shadow-soft"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            <span className="relative inline-flex items-center gap-2">
              {t.icon ? <span className="text-white">{t.icon}</span> : null}
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
