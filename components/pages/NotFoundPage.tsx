import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { TiltCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl py-14">
        <TiltCard className="relative overflow-hidden p-8 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,222,149,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(186,192,149,0.20),transparent_55%)]" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white">404</div>
              <div className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white">Page not found</div>
              <div className="mt-2 text-sm text-brand-text-secondary">A premium little detour. Let’s get you back.</div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/">
                  <Button variant="primary">Go home</Button>
                </Link>
                <Link href="/search">
                  <Button variant="secondary">Browse items</Button>
                </Link>
              </div>
            </div>
            <AnimatedIllustration />
          </div>
        </TiltCard>
      </div>
    </AppShell>
  );
}

function AnimatedIllustration() {
  return (
    <div className="relative">
      <motion.div
        className="absolute -left-6 top-6 h-40 w-40 rounded-[2.25rem] bg-[#D4DE95]/40 blur-[1px]"
        animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-2 bottom-6 h-32 w-32 rounded-[2rem] bg-[#BAC095]/35"
        animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative grid place-items-center rounded-[2rem] bg-white/10 p-8 shadow-soft">
        <motion.div
          className="h-24 w-24 rounded-[1.5rem] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.85),transparent_55%),linear-gradient(135deg,rgba(248,250,245,0.65),rgba(212,222,149,0.28),rgba(186,192,149,0.22))]"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="mt-4 text-sm font-semibold text-white">Lost the link. Not the style.</div>
      </div>
    </div>
  );
}
