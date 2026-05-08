import { useEffect, useMemo, useState } from "react";
import { Camera, History, ShieldCheck, Sparkles, User } from "lucide-react";
import { SidebarShell } from "@/components/layout/SidebarShell";
import { TiltCard } from "@/components/ui/Card";
import { FloatingInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import * as authApi from "@/api/authApi";
import * as itemsApi from "@/api/itemsApi";
import * as notificationsApi from "@/api/notificationsApi";
import type { Item, Notification } from "@/utils/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function ProfilePage() {
  const { push } = useToast();
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [myReports, setMyReports] = useState<Item[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
  }, [user]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setDataLoading(true);
        setDataError(null);
        const [r, n] = await Promise.all([itemsApi.myReports(), notificationsApi.listNotifications()]);
        if (!alive) return;
        setMyReports(r?.data?.items || []);
        setNotifications(n?.data?.notifications || []);
      } catch (e: any) {
        if (!alive) return;
        setDataError(e?.message || "Failed to load profile data.");
        setMyReports([]);
        setNotifications([]);
      } finally {
        if (alive) setDataLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (email && !email.includes("@")) e.email = "Enter a valid email.";
    if (name && name.trim().length < 2) e.name = "Enter your full name.";
    return e;
  }, [email, name]);

  return (
    <SidebarShell activeHref="/profile">
      <div className="space-y-6">
        <PageHeader
          kicker="Profile"
          title="Your account"
          subtitle="Editable details, safety preferences, and your recent activity."
          right={
            <Button variant="secondary" disabled>
              <Camera className="h-5 w-5" /> Update avatar
            </Button>
          }
        />

        <div className="grid gap-4 lg:grid-cols-[0.55fr_1fr] lg:items-start">
          <TiltCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-white">
                <User className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <div className="truncate font-display text-lg font-extrabold tracking-tight text-white">{name}</div>
                <div className="mt-1 text-sm text-white">{email}</div>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {dataLoading ? (
                <>
                  <div className="rounded-2xl bg-white/10 px-4 py-3 shadow-soft"><Skeleton className="h-4 w-2/3" /></div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3 shadow-soft"><Skeleton className="h-4 w-1/2" /></div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3 shadow-soft"><Skeleton className="h-4 w-3/4" /></div>
                </>
              ) : dataError ? (
                <div className="rounded-2xl bg-white/10 p-4 text-sm text-white">{dataError}</div>
              ) : (
                <>
                  <StatRow icon={<Sparkles className="h-5 w-5" />} label="Reports created" value={String(myReports.length)} />
                  <StatRow icon={<ShieldCheck className="h-5 w-5" />} label="Claims approved" value="0" />
                  <StatRow
                    icon={<History className="h-5 w-5" />}
                    label="Last active"
                    value={user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "â€”"}
                  />
                </>
              )}
            </div>
          </TiltCard>

          <TiltCard className="p-5 sm:p-6">
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  setLoading(true);
                  await authApi.updateProfile({ name, email, phone });
                  await refresh();
                  push({ type: "success", title: "Profile saved" });
                } catch (err: any) {
                  push({ type: "warning", title: "Save failed", message: err?.message || "Please try again." });
                } finally {
                  setLoading(false);
                }
              }}
            >
              <FloatingInput label="Full name" value={name} onChange={setName} error={errors.name} />
              <FloatingInput label="Email" value={email} onChange={setEmail} error={errors.email} />
              <FloatingInput label="Phone" value={phone} onChange={setPhone} />
              <div className="md:col-span-2 flex items-center justify-end pt-1">
                <Button type="submit" disabled={loading || Object.keys(errors).length > 0}>
                  {loading ? "Savingâ€¦" : "Save changes"}
                </Button>
              </div>
            </form>
          </TiltCard>
        </div>

        <TiltCard className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-white">Activity</div>
          <div className="mt-1 font-display text-xl font-extrabold tracking-tight text-white">Recent history</div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {dataLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="glass rounded-2xl p-4 shadow-soft">
                  <Skeleton className="h-4 w-2/3" />
                  <div className="mt-2"><Skeleton className="h-3 w-1/2" /></div>
                </div>
              ))
            ) : dataError ? (
              <EmptyState title="No recent activity yet" message={dataError} />
            ) : notifications.length ? (
              notifications.slice(0, 3).map((n) => (
                <ActivityCard key={n._id} title={n.title} meta={new Date(n.createdAt).toLocaleDateString()} />
              ))
            ) : (
              <div className="md:col-span-3 rounded-2xl bg-white/10 p-5 text-sm text-white">No recent activity yet.</div>
            )}
          </div>
        </TiltCard>
      </div>
    </SidebarShell>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white">{icon}</span>
        <div>
          <div className="text-xs font-semibold text-white">{label}</div>
          <div className="text-sm font-extrabold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="glass rounded-2xl p-4 shadow-soft hover:shadow-glow transition-shadow">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs text-white">{meta}</div>
    </div>
  );
}
