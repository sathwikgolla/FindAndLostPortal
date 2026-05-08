import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { SidebarShell } from "@/components/layout/SidebarShell";
import { TiltCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/components/toast/ToastProvider";
import * as notificationsApi from "@/api/notificationsApi";
import type { Notification } from "@/utils/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export function NotificationsPage() {
  const { push } = useToast();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationsApi.listNotifications();
      setItems(res?.data?.notifications || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load notifications.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const hasUnread = useMemo(() => items.some((n) => !n.isRead), [items]);

  return (
    <SidebarShell activeHref="/notifications">
      <div className="space-y-6">
        <PageHeader
          kicker="Notifications"
          title="Stay updated"
          subtitle="Approvals, claim requests, and match hintsÃ¢â‚¬â€kept clean and readable."
          right={
            <>
              <Button
                variant="secondary"
                disabled={!items.length || !hasUnread}
                onClick={async () => {
                  try {
                    await notificationsApi.markReadAll();
                    push({ type: "success", title: "Marked all as read" });
                    await load();
                  } catch (e: any) {
                    push({ type: "warning", title: "Action failed", message: e?.message || "Please try again." });
                  }
                }}
              >
                <CheckCheck className="h-5 w-5" /> Read all
              </Button>
              <Button
                variant="outline"
                glow={false}
                disabled={!items.length}
                onClick={async () => {
                  try {
                    await Promise.all(items.map((n) => notificationsApi.deleteNotification(n._id)));
                    push({ type: "success", title: "Cleared" });
                    await load();
                  } catch (e: any) {
                    push({ type: "warning", title: "Clear failed", message: e?.message || "Please try again." });
                  }
                }}
              >
                <Trash2 className="h-5 w-5" /> Clear
              </Button>
            </>
          }
        />

        <div className="grid gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <TiltCard key={idx} className="p-5">
                <Skeleton className="h-5 w-1/2" />
                <div className="mt-3">
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </TiltCard>
            ))
          ) : error ? (
            <EmptyState title="Could not load notifications" message={error} actionLabel="Retry" onAction={load} />
          ) : items.length ? (
            items.map((n) => (
              <TiltCard key={n._id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-white">{n.title}</div>
                      <div className="text-xs font-semibold text-white">{new Date(n.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="mt-1 text-sm text-white">{n.message}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        disabled={n.isRead}
                        onClick={async () => {
                          try {
                            await notificationsApi.markRead(n._id);
                            await load();
                          } catch (e: any) {
                            push({ type: "warning", title: "Action failed", message: e?.message || "Please try again." });
                          }
                        }}
                      >
                        Mark read
                      </Button>
                      <Button
                        variant="outline"
                        glow={false}
                        onClick={async () => {
                          try {
                            await notificationsApi.deleteNotification(n._id);
                            await load();
                          } catch (e: any) {
                            push({ type: "warning", title: "Dismiss failed", message: e?.message || "Please try again." });
                          }
                        }}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                  {!n.isRead ? (
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-brand-accent-cyan shadow-[0_0_0_6px_rgba(6,182,212,0.22)]" />
                  ) : null}
                </div>
              </TiltCard>
            ))
          ) : (
            <TiltCard className="p-8">
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white/10 text-white">
                  <Bell className="h-7 w-7" />
                </div>
                <div className="mt-4 font-display text-xl font-extrabold tracking-tight text-white">All caught up</div>
                <div className="mt-2 text-sm text-white">No notifications yet.</div>
              </div>
            </TiltCard>
          )}
        </div>
      </div>
    </SidebarShell>
  );
}
