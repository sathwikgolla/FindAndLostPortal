import { useEffect, useRef } from "react";

export function useMagnetic<T extends HTMLElement>({ strength = 0.18 }: { strength?: number } = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = el;

    function onMove(e: MouseEvent) {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      target.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    }
    function onLeave() {
      target.style.transform = "translate3d(0px, 0px, 0)";
    }

    target.addEventListener("mousemove", onMove);
    target.addEventListener("mouseleave", onLeave);
    return () => {
      target.removeEventListener("mousemove", onMove);
      target.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}
