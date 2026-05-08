import * as React from "react";
import { cn } from "@/utils/cn";
import { useRipple } from "@/hooks/useRipple";
import type { ReactNode } from "react";

export function IconButton({
  children,
  ariaLabel,
  className,
  onClick,
  variant = "plain"
}: {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "plain" | "glass";
}) {
  const ripple = useRipple();
  return (
    <button
      aria-label={ariaLabel}
      onClick={(e) => {
        ripple(e);
        onClick?.(e);
      }}
      className={cn(
        "relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl transition",
        variant === "glass"
          ? "glass shadow-soft hover:shadow-glow"
          : "bg-white/10 hover:bg-white/15",
        "text-white",
        className
      )}
    >
      {children}
    </button>
  );
}
