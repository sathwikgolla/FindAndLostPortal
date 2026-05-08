import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { LayoutDashboard, Search, PlusCircle, ClipboardList, User, Shield, Bell, MessageSquareText } from "lucide-react";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LogOut } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import type { ReactNode } from "react";
import { StartupBackground } from "@/components/layout/StartupBackground";
import { useAuth } from "@/hooks/useAuth";
import { FullPageLoader } from "@/components/ui/FullPageLoader";

type NavItem = { href: string; label: string; icon: ReactNode };

const baseNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/search", label: "Search", icon: <Search className="h-5 w-5" /> },
  { href: "/report-lost", label: "Report Lost", icon: <PlusCircle className="h-5 w-5" /> },
  { href: "/report-found", label: "Report Found", icon: <PlusCircle className="h-5 w-5" /> },
  { href: "/my-reports", label: "My Reports", icon: <ClipboardList className="h-5 w-5" /> },
  { href: "/messages", label: "Messages", icon: <MessageSquareText className="h-5 w-5" /> },
  { href: "/notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
  { href: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> }
];

export function SidebarShell({
  children,
  activeHref,
  admin = false
}: {
  children: ReactNode;
  activeHref: string;
  admin?: boolean;
}) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const nav = admin ? [...baseNav, { href: "/admin", label: "Admin", icon: <Shield className="h-5 w-5" /> }] : baseNav;

  if (loading) {
    return (
      <StartupBackground>
        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
          <FullPageLoader title="Preparing your workspace…" subtitle="Checking your session and loading data." />
        </div>
      </StartupBackground>
    );
  }

  // Route guard for all sidebar pages.
  if (!user) {
    const next = encodeURIComponent(router.asPath || "/dashboard");
    if (typeof window !== "undefined") window.location.href = `/auth?next=${next}`;
    return (
      <StartupBackground>
        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
          <FullPageLoader title="Redirecting…" subtitle="Please sign in to continue." />
        </div>
      </StartupBackground>
    );
  }

  if (admin && user && user.role !== "admin") {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
    return (
      <StartupBackground>
        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
          <FullPageLoader title="Redirecting…" subtitle="Admin access required." />
        </div>
      </StartupBackground>
    );
  }

  return (
    <StartupBackground>
      <div className="min-h-screen">
        <div className="grid w-full grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[auto_1fr] lg:px-10">
          <motion.aside
            className={cn(
              "glass group relative h-fit rounded-2xl p-2 shadow-soft",
              "transition-[width] duration-300 lg:w-60 lg:group-hover:w-72",
              "lg:sticky lg:top-6"
            )}
            initial={{ opacity: 0, x: -14, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-2 px-2 pb-2">
              <Link
                href="/"
                className="font-display text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-cyan/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]"
              >
                FindAndLost
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <IconButton
                  ariaLabel="Logout"
                  variant="glass"
                  onClick={() => {
                    logout();
                    if (typeof window !== "undefined") window.location.href = "/auth";
                  }}
                >
                  <LogOut className="h-5 w-5" />
                </IconButton>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {nav.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                      "text-white hover:text-white",
                      "hover:bg-white/10",
                      isActive && "bg-white/12 text-white shadow-soft"
                    )}
                  >
                    <span className={cn("grid h-9 w-9 place-items-center rounded-xl", isActive ? "bg-white/10" : "")}>
                      {item.icon}
                    </span>
                    <span className="max-w-[14rem] truncate lg:max-w-[10rem] lg:group-hover:max-w-[14rem] lg:transition-all">
                      {item.label}
                    </span>
                    {isActive ? (
                      <span className="absolute inset-y-2 left-1 w-1 rounded-full bg-gradient-to-b from-brand-green-olive to-brand-green-sage" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </StartupBackground>
  );
}
