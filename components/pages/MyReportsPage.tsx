import { useEffect, useMemo, useState } from "react";
import { ClipboardList, FileText, KeyRound, CheckCircle2, Hourglass, Trash2, Pencil } from "lucide-react";
import { SidebarShell } from "@/components/layout/SidebarShell";
import { TiltCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import * as itemsApi from "@/api/itemsApi";
import type { Item } from "@/utils/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export function MyReportsPage() {
  const { push } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "lost" | "found" | "claimed" | "pending" | "solved">("all");

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (tab === "all") return true;
      if (tab === "lost") return i.type === "lost";
      if (tab === "found") return i.type === "found";
      if (tab === "claimed") return i.status === "claimed";
      if (tab === "pending") return i.status === "pending";
      if (tab === "solved") return i.status === "solved";
      return true;
    });
  }, [items, tab]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await itemsApi.myReports();
      setItems(res?.data?.items || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load your reports.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SidebarShell activeHref="/my-reports">
      <div className="space-y-6">
        <PageHeader
          kicker="My Reports"
          title="Manage your listings"
          subtitle="Filter by status, edit quickly, and keep things tidy."
          right={
            <Button variant="secondary" disabled>
              <ClipboardList className="h-5 w-5" /> Bulk actions
            </Button>
          }
        />

        <Tabs
          value={tab}
          onChange={(v) => setTab(v as typeof tab)}
          tabs={[
            { value: "all", label: "All", icon: <FileText className="h-4 w-4" /> },
            { value: "lost", label: "Lost", icon: <KeyRound className="h-4 w-4" /> },
            { value: "found", label: "Found", icon: <CheckCircle2 className="h-4 w-4" /> },
            { value: "pending", label: "Pending", icon: <Hourglass className="h-4 w-4" /> },
            { value: "claimed", label: "Claimed", icon: <CheckCircle2 className="h-4 w-4" /> },
            { value: "solved", label: "Solved", icon: <CheckCircle2 className="h-4 w-4" /> }
          ]}
        />

        <div className="grid gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <TiltCard key={idx} className="p-5">
                <Skeleton className="h-5 w-1/2" />
                <div className="mt-3">
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </TiltCard>
            ))
          ) : error ? (
            <EmptyState title="Could not load reports" message={error} actionLabel="Retry" onAction={load} />
          ) : filtered.length ? (
            filtered.map((item) => (
              <TiltCard key={item._id} className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate font-display text-lg font-extrabold tracking-tight text-white">{item.title}</div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-1 text-sm text-white">
                      {item.location} · {String(item.date).slice(0, 10)}
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <MiniStep active label="Reported" />
                      <MiniStep active={item.status !== "pending"} label="Reviewed" />
                      <MiniStep
                        active={item.status === "claimed" || item.status === "solved"}
                        label={item.status === "solved" ? "Solved" : "Claimed"}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" disabled>
                      <Pencil className="h-5 w-5" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      glow={false}
                      onClick={async () => {
                        try {
                          await itemsApi.deleteItem(item._id);
                          push({ type: "success", title: "Deleted" });
                          await load();
                        } catch (e: any) {
                          push({ type: "warning", title: "Delete failed", message: e?.message || "Please try again." });
                        }
                      }}
                    >
                      <Trash2 className="h-5 w-5" /> Delete
                    </Button>
                  </div>
                </div>
              </TiltCard>
            ))
          ) : (
            <EmptyState title="No reports yet" message="You have not reported any items yet." />
          )}
        </div>
      </div>
    </SidebarShell>
  );
}

function MiniStep({ active, label }: { active?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs font-semibold text-white">
      <span className={active ? "h-2 w-2 rounded-full bg-brand-accent-cyan" : "h-2 w-2 rounded-full bg-white/30"} />
      {label}
    </div>
  );
}
