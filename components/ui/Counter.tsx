import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export function Counter({
  value,
  suffix,
  durationMs = 1100
}: {
  value: number;
  suffix?: string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const from = 0;
    const to = value;

    let raf = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, isInView, value]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}}>
      <span className="font-display text-3xl font-extrabold tracking-tight text-white">{n.toLocaleString()}</span>
      {suffix ? <span className="ml-1 text-sm font-semibold text-white">{suffix}</span> : null}
    </motion.div>
  );
}
