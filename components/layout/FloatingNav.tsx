import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import type { ReactNode } from "react";

const links = [
  { href: "/search", label: "Browse" },
  { href: "/report-lost", label: "Report Lost" },
  { href: "/report-found", label: "Report Found" },
  { href: "/dashboard", label: "Dashboard" }
];

export function FloatingNav({ className }: { className?: string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 120], [0, 0]);
  const opacity = useTransform(scrollY, [0, 90], [1, 1]);

  return (
    <motion.div
      style={{ y, opacity }}
      className={cn("sticky top-0 z-50 w-full", className)}
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="border-b border-white/10 bg-[rgba(7,17,31,0.72)] backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Link
              href="/"
              className="group flex items-center gap-2 py-2 transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-olive/35 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-green-bg"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-white">
                <span className="font-display text-sm font-extrabold leading-none">F</span>
              </span>
              <span className="font-display text-sm font-semibold tracking-tight text-white transition-colors">
                FindAndLost
              </span>
            </Link>

            <div className="hidden items-center justify-center gap-2 md:flex">
              {links.map((l) => (
                <NavLink key={l.href} href={l.href}>
                  {l.label}
                </NavLink>
              ))}
            </div>

          <div className="flex items-center gap-2">
              <ThemeToggle tone="dark" />
              <Link href="/auth" className="hidden sm:block">
                <Button size="sm" variant="primary">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </motion.div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative px-1 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-cyan/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]"
    >
      {children}
      <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand-accent-cyan via-brand-accent-purple to-brand-dark-deep transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}
