import { cn } from "@/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-9 w-9 animate-spin rounded-full border-2 border-brand-accent-cyan/25 border-t-brand-accent-cyan",
        className
      )}
    />
  );
}
