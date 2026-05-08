import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-[#F8FAF5]", className)}>
      <div className="absolute inset-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10 animate-shimmer" />
    </div>
  );
}
