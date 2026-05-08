import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, Search, Bell, Activity, ArrowUpRight } from "lucide-react";
import { SidebarShell } from "@/components/layout/SidebarShell";
import { TiltCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/search/SearchBar";
import { ItemCard } from "@/components/items/ItemCard";
import { Reveal } from "@/components/motion/Reveal";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Carousel } from "@/components/ui/Carousel";
import { useEffect, useMemo, useState } from "react";
import * as dashboardApi from "@/api/dashboardApi";
import * as itemsApi from "@/api/itemsApi";
import * as notificationsApi from "@/api/notificationsApi";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Item, Notification } from "@/utils/types";

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ myReports: number; myClaims: number; unreadNotifications: number } | null>(null);
  const [recent, setRecent] = useState<Item[]>([]);
  const [activity, setActivity] = useState<{ notifications: Notification[]; receivedClaims: any[] } | null>(null);
  const [myReportsCount, setMyReportsCount] = useState<number>(0);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [s, r, a, mr, nn] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentItems(),
          dashboardApi.getMyActivity(),
          itemsApi.myReports(),
          notificationsApi.listNotifications()
        ]);
        if (!alive) return;
        setStats(s?.data || null);
        setRecent(r?.data?.items || []);
        setActivity(a?.data || null);
        const myItems = mr?.data?.items || [];
        const notifs = nn?.data?.notifications || [];
        setMyReportsCount(myItems.length);
        setUnreadNotifications(notifs.filter((x: any) => !x.isRead).length);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load dashboard.");
        setStats(null);
        setRecent([]);
        setActivity(null);
        setMyReportsCount(0);
        setUnreadNotifications(0);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const timeline = useMemo(() => {
    const notifs = activity?.notifications || [];
    return notifs.slice(0, 6).map((n) => ({
      id: n._id,
      title: n.title,
      meta: new Date(n.createdAt).toLocaleDateString(),
      detail: n.message
    }));
  }, [activity]);

  return (
    <SidebarShell activeHref="/dashboard">
      <div className="space-y-6">
        <PageHeader
          kicker="Dashboard"
          title="Welcome back"
          subtitle="A premium control center for your reports, matches, and claims."
          right={
            <>
              <Link href="/search">
                <Button variant="secondary">
                  <Search className="h-5 w-5" /> Browse
                </Button>
              </Link>
              <Link href="/report-lost">
                <Button>
                  <PlusCircle className="h-5 w-5" /> Report
                </Button>
              </Link>
            </>
          }
        />
        <Reveal>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <TiltCard className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-white">Quick search</div>
                  <div className="mt-1 font-display text-lg font-extrabold tracking-tight text-white">Find matches fast</div>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                  <Search className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-4">
                <SearchBar value="" onChange={() => {}} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/report-lost">
                  <Button variant="primary">
                    <PlusCircle className="h-5 w-5" /> Report Lost
                  </Button>
                </Link>
                <Link href="/report-found">
                  <Button variant="secondary">
                    <PlusCircle className="h-5 w-5" /> Report Found
                  </Button>
                </Link>
              </div>
            </TiltCard>

            <div className="grid gap-4">
              <TiltCard className="p-5 bg-[linear-gradient(135deg,rgba(15,42,95,0.45),rgba(109,93,247,0.25),rgba(6,182,212,0.20))]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white">Today</div>
                    <div className="mt-1 font-display text-lg font-extrabold tracking-tight text-white">Activity overview</div>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                    <Activity className="h-5 w-5" />
                  </span>
                </div>
                {loading ? (
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl bg-white/10 px-4 py-3"><Skeleton className="h-4 w-32" /></div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3"><Skeleton className="h-4 w-40" /></div>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3">
                    <Kpi icon={<Activity className="h-5 w-5" />} label="My reports" value={String(myReportsCount)} />
                    <Kpi icon={<Bell className="h-5 w-5" />} label="Unread notifications" value={String(unreadNotifications)} />
                  </div>
                )}
              </TiltCard>

              <TiltCard className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white">Notifications</div>
                    <div className="mt-1 font-display text-lg font-extrabold tracking-tight text-white">Stay updated</div>
                    <div className="mt-1 text-sm text-white">Approvals, claims, and match hints.</div>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                    <Bell className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {loading ? (
                    <>
                      <div className="rounded-2xl bg-white/10 p-3"><Skeleton className="h-4 w-2/3" /><div className="mt-2"><Skeleton className="h-3 w-1/2" /></div></div>
                      <div className="rounded-2xl bg-white/10 p-3"><Skeleton className="h-4 w-3/4" /><div className="mt-2"><Skeleton className="h-3 w-2/3" /></div></div>
                    </>
                  ) : timeline.length ? (
                    timeline.slice(0, 2).map((t) => <TimelineItem key={t.id} title={t.title} meta={t.meta} detail={t.detail} />)
                  ) : (
                    <div className="rounded-2xl bg-white/10 p-4 text-sm text-white">No notifications yet.</div>
                  )}
                </div>
                <div className="mt-4">
                  <Link href="/notifications">
                    <Button variant="outline" glow={false} className="w-full">
                      View notifications <ArrowUpRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </TiltCard>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <section>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white">Recommended</div>
                <div className="mt-1 font-display text-xl font-extrabold tracking-tight text-white">Recent items</div>
              </div>
              <Link href="/search" className="text-sm font-semibold text-white hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-4">
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="glass overflow-hidden rounded-2xl shadow-soft">
                      <Skeleton className="aspect-[16/10] w-full rounded-none" />
                      <div className="space-y-3 p-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-5/6" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <EmptyState title="Could not load recent items" message={error} />
              ) : recent.length ? (
                <Carousel>
                  {recent.map((item, i) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="w-[20rem] shrink-0"
                    >
                      <ItemCard item={item} />
                    </motion.div>
                  ))}
                </Carousel>
              ) : (
                <EmptyState title="No items found yet" message="No active items yet. Be the first to report one." />
              )}
            </div>
          </section>
        </Reveal>
      </div>
    </SidebarShell>
  );
}

function Kpi({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white">
          {icon}
        </span>
        <div>
          <div className="text-xs font-semibold text-white">{label}</div>
          <div className="font-display text-sm font-extrabold tracking-tight text-white">{value}</div>
        </div>
      </div>
      <span className="h-2 w-2 rounded-full bg-brand-green-olive shadow-[0_0_0_6px_rgba(99,107,47,0.12)]" />
    </div>
  );
}

function TimelineItem({ title, meta, detail }: { title: string; meta: string; detail: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-green-olive shadow-[0_0_0_6px_rgba(212,222,149,0.55)]" />
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs font-semibold text-white">{meta}</div>
        </div>
        <div className="mt-1 text-xs text-white">{detail}</div>
      </div>
    </div>
  );
}
