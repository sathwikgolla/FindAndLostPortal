import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { TiltCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <TiltCard className="p-6">
      <div className="flex flex-col items-center text-center">
        <motion.div
          className="relative grid h-16 w-16 place-items-center rounded-3xl bg-white/10"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <SearchX className="h-7 w-7 text-white" />
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent_55%)]" />
        </motion.div>
        <div className="mt-4 font-display text-xl font-extrabold tracking-tight">{title}</div>
        <div className="mt-2 max-w-md text-sm text-white">{message}</div>
        {actionLabel && onAction ? (
          <div className="mt-5">
            <Button variant="secondary" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </TiltCard>
  );
}
