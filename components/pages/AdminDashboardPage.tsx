import { Filter, Search, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { SidebarShell } from "@/components/layout/SidebarShell";
import { TiltCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { useToast } from "@/components/toast/ToastProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import * as adminApi from "@/api/adminApi";
import type { Item } from "@/utils/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function AdminDashboardPage() {
  const { push } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ users: number; itemsPending: number; itemsActive: number; claimsPending: number } | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [s, it] = await Promise.all([adminApi.getAdminStats(), adminApi.getItems()]);
      setStats(s?.data || null);
      setItems(it?.data?.items || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load admin data.");
      setStats(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SidebarShell activeHref="/admin" admin>
      <div className="space-y-6">
        <PageHeader
          kicker="Admin"
          title="Admin dashboard"
          subtitle="Analytics, approvals, and logsâ€”kept calm and production-ready."
          right={
            <>
              <Button variant="secondary" disabled>
                Export
              </Button>
              <Button onClick={load}>Refresh</Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <AdminStat title="Pending reviews" value={loading ? "…" : String(stats?.itemsPending ?? 0)} />
          <AdminStat title="Active items" value={loading ? "…" : String(stats?.itemsActive ?? 0)} />
          <AdminStat title="Users" value={loading ? "…" : String(stats?.users ?? 0)} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <TiltCard className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white">Analytics</div>
                <div className="mt-1 font-display text-xl font-extrabold tracking-tight text-white">Overview</div>
                <div className="mt-1 text-sm text-white">Realtime counts from MongoDB.</div>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <Bar label="Claims pending" value={stats ? Math.min(1, (stats.claimsPending || 0) / 20) : 0} />
              <Bar label="Pending reviews" value={stats ? Math.min(1, (stats.itemsPending || 0) / 20) : 0} />
              <Bar label="Active items" value={stats ? Math.min(1, (stats.itemsActive || 0) / 50) : 0} />
            </div>
          </TiltCard>

          <TiltCard className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white">Controls</div>
                <div className="mt-1 font-display text-xl font-extrabold tracking-tight text-white">Queue actions</div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" disabled>
                  <Filter className="h-5 w-5" /> Filters
                </Button>
                <Button variant="outline" glow={false} disabled>
                  <Search className="h-5 w-5" /> Search
                </Button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="glass rounded-2xl p-4 shadow-soft">
                <div className="text-xs font-semibold uppercase tracking-wider text-white">Pending</div>
                <div className="mt-2 text-sm text-white">Items awaiting approval</div>
                <div className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white">{loading ? "…" : String(stats?.itemsPending ?? 0)}</div>
              </div>
              <div className="glass rounded-2xl p-4 shadow-soft">
                <div className="text-xs font-semibold uppercase tracking-wider text-white">Claims</div>
                <div className="mt-2 text-sm text-white">Claim requests pending</div>
                <div className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white">{loading ? "…" : String(stats?.claimsPending ?? 0)}</div>
              </div>
            </div>
          </TiltCard>
        </div>

        <TiltCard className="p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white">Moderation queue</div>
              <div className="mt-1 font-display text-xl font-extrabold tracking-tight text-white">Latest reports</div>
            </div>
            <Button variant="secondary" disabled>
              Bulk actions
            </Button>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold text-white">
              <div>Item</div>
              <div>Status</div>
            </div>

            {loading ? (
              <div className="p-4">
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-2">
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ) : error ? (
              <div className="p-4">
                <EmptyState title="Could not load items" message={error} actionLabel="Retry" onAction={load} />
              </div>
            ) : items.length ? (
              items.slice(0, 12).map((i) => (
                <div key={i._id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-white">{i.title}</div>
                    <div className="mt-0.5 text-xs text-white">{i.location}</div>
                    {i.status === "pending" ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={async () => {
                            try {
                              await adminApi.approveItem(i._id);
                              push({ type: "success", title: "Approved" });
                              await load();
                            } catch (e: any) {
                              push({ type: "warning", title: "Approve failed", message: e?.message || "Please try again." });
                            }
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          glow={false}
                          onClick={async () => {
                            try {
                              await adminApi.rejectItem(i._id);
                              push({ type: "success", title: "Rejected" });
                              await load();
                            } catch (e: any) {
                              push({ type: "warning", title: "Reject failed", message: e?.message || "Please try again." });
                            }
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          glow={false}
                          onClick={async () => {
                            try {
                              await adminApi.deleteItem(i._id);
                              push({ type: "success", title: "Deleted" });
                              await load();
                            } catch (e: any) {
                              push({ type: "warning", title: "Delete failed", message: e?.message || "Please try again." });
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  <StatusBadge status={i.status} />
                </div>
              ))
            ) : (
              <div className="p-6 text-sm text-white">No items yet.</div>
            )}
          </div>
        </TiltCard>
      </div>
    </SidebarShell>
  );
}

function AdminStat({ title, value }: { title: string; value: string }) {
  return (
    <TiltCard className="p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-white">{title}</div>
      <div className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white">{value}</div>
    </TiltCard>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className="text-xs font-semibold text-white">{Math.round(value * 100)}%</div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-brand-green-olive" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}
