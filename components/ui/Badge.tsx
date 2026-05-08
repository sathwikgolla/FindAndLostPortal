import { cn } from "@/utils/cn";
import type { ItemStatus } from "@/utils/types";

export function StatusBadge({ status, className }: { status: ItemStatus; className?: string }) {
  const styles: Record<ItemStatus, string> = {
    pending: "bg-white/10 text-white border-white/10",
    active: "bg-[rgba(6,182,212,0.18)] text-white border-white/10",
    claimed: "bg-[rgba(15,42,95,0.65)] text-white border-white/10",
    solved: "bg-[rgba(16,185,129,0.20)] text-white border-white/10",
    rejected: "bg-[rgba(109,93,247,0.18)] text-white border-white/10"
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
        styles[status],
        className
      )}
    >
      {status === "pending"
        ? "Pending"
        : status === "active"
          ? "Active"
          : status === "claimed"
            ? "Claimed"
            : status === "solved"
              ? "Solved"
            : "Rejected"}
    </span>
  );
}
