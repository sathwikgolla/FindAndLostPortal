import type { ReactNode } from "react";

export function StartupBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#07111F] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 18%, rgba(6,182,212,0.18) 0%, transparent 45%), radial-gradient(circle at 85% 22%, rgba(109,93,247,0.18) 0%, transparent 45%), radial-gradient(circle at 55% 80%, rgba(15,42,95,0.24) 0%, transparent 40%)"
          }}
        />
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
