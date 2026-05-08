import type { ReactNode } from "react";
import { KeyRound, Wallet, Smartphone } from "lucide-react";

export function MossBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#07111F] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(6,182,212,0.16) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(109,93,247,0.16) 0%, transparent 40%), radial-gradient(circle at 50% 80%, rgba(15,42,95,0.14) 0%, transparent 30%)"
          }}
        />

        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="absolute -left-40 top-24 h-[36rem] w-[36rem] rounded-full bg-brand-accent-cyan/18 blur-[90px]" />
        <div className="absolute -right-44 top-40 h-[34rem] w-[34rem] rounded-full bg-brand-accent-purple/18 blur-[95px]" />

        <div className="absolute left-10 top-72 rotate-[-12deg] text-white opacity-[0.08] blur-[0.2px]">
          <KeyRound className="h-40 w-40" />
        </div>
        <div className="absolute right-14 top-64 rotate-[10deg] text-white opacity-[0.07] blur-[0.2px]">
          <Wallet className="h-44 w-44" />
        </div>
        <div className="absolute left-1/2 top-[28rem] -translate-x-1/2 rotate-[6deg] text-white opacity-[0.06] blur-[0.2px]">
          <Smartphone className="h-48 w-48" />
        </div>
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}
