import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export function TiltCard({
  className,
  children,
  subtle = false
}: {
  className?: string;
  children: ReactNode;
  subtle?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [interactive, setInteractive] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], [6, -6]);
  const ry = useTransform(mx, [-0.5, 0.5], [-6, 6]);
  const springRx = useSpring(rx, { stiffness: 220, damping: 24, mass: 0.6 });
  const springRy = useSpring(ry, { stiffness: 220, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia?.("(pointer:fine)")?.matches ?? true;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    setInteractive(fine && !reduce);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "glass rounded-2xl shadow-soft transition-shadow hover:shadow-lift",
        subtle && "hover:shadow-soft",
        className
      )}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      style={interactive ? { rotateX: springRx, rotateY: springRy, transformStyle: "preserve-3d" as const } : undefined}
      onMouseMove={
        interactive
          ? (e) => {
              const el = ref.current;
              if (!el) return;
              const rect = el.getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width - 0.5;
              const py = (e.clientY - rect.top) / rect.height - 0.5;
              mx.set(px);
              my.set(py);
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? () => {
              mx.set(0);
              my.set(0);
            }
          : undefined
      }
    >
      <div className="relative h-full w-full" style={{ transform: "translateZ(0px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
