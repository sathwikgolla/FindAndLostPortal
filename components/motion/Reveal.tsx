import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { rise } from "@/animations/motion";
import type { ReactNode } from "react";

export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  return (
    <motion.div ref={ref} variants={rise} initial="hidden" animate={inView ? "show" : "hidden"}>
      {children}
    </motion.div>
  );
}
