import * as React from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useRipple } from "@/hooks/useRipple";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

export const Button = React.forwardRef<
  HTMLButtonElement,
  Omit<HTMLMotionProps<"button">, "ref" | "children"> & {
    variant?: Variant;
    size?: Size;
    magnetic?: boolean;
    glow?: boolean;
    children?: React.ReactNode;
  }
>(function Button(
  { className, variant = "primary", size = "md", magnetic = true, glow = true, children, ...props },
  ref
) {
  const magRef = useMagnetic<HTMLButtonElement>({ strength: 0.12 });
  const ripple = useRipple();

  const base =
    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl font-semibold transition will-change-transform";

  const sizes: Record<Size, string> = {
    sm: "h-10 px-4 text-sm",
    md: "h-12 px-5 text-sm",
    lg: "h-14 px-6 text-base"
  };

  const variants: Record<Variant, string> = {
    primary:
      "text-white bg-[linear-gradient(90deg,#0F2A5F,#06B6D4,#6D5DF7)] shadow-soft hover:shadow-glow",
    secondary:
      "text-white border border-white/15 bg-white/10 shadow-soft hover:bg-white/15 hover:shadow-lift",
    ghost:
      "text-white hover:bg-white/10",
    outline:
      "text-white border border-white/15 bg-transparent hover:bg-white/10"
  };

  return (
    <motion.button
      ref={(node) => {
        (magRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }}
      whileTap={{ scale: 0.985 }}
      className={cn(base, sizes[size], variants[variant], "group", className)}
      onClick={(e) => {
        ripple(e);
        props.onClick?.(e);
      }}
      style={{ transform: magnetic ? undefined : "none" }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && glow ? (
        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="absolute -inset-10 bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.28),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.24),transparent_55%)]" />
        </span>
      ) : null}
    </motion.button>
  );
});
