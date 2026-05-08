import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export function Chip({
  icon,
  children,
  active,
  onClick
}: {
  icon?: ReactNode;
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className={cn(
        "glass inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold shadow-soft transition-shadow hover:shadow-glow",
        active ? "bg-white/10 text-white" : "text-white"
      )}
    >
      {icon ? <span className="text-white">{icon}</span> : null}
      {children}
    </motion.button>
  );
}
