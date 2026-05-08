import { useCallback } from "react";

export function useRipple() {
  return useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.position = "absolute";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.borderRadius = "999px";
    ripple.style.background = "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 45%, transparent 65%)";
    ripple.style.transform = "scale(0)";
    ripple.style.opacity = "0.85";
    ripple.style.pointerEvents = "none";
    ripple.style.mixBlendMode = "overlay";
    ripple.style.transition = "transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 650ms ease";

    const prev = target.querySelector("[data-ripple]");
    if (prev) prev.remove();
    ripple.setAttribute("data-ripple", "true");
    target.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = "scale(1)";
      ripple.style.opacity = "0";
    });

    window.setTimeout(() => ripple.remove(), 720);
  }, []);
}

