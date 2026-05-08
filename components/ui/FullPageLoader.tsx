import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function FullPageLoader({
  title = "Loading…",
  subtitle
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.25 }}
        className="glass w-full max-w-md rounded-2xl p-6 shadow-soft"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-display text-base font-bold tracking-tight text-white">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-white">{subtitle}</div> : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

