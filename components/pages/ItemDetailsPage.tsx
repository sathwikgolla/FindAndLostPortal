import Link from "next/link";
import { MapPin, Calendar, MessageCircle, ArrowLeft, ShieldCheck, Sparkles, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { TiltCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ItemGallery } from "@/components/items/ItemGallery";
import { useToast } from "@/components/toast/ToastProvider";
import { Carousel } from "@/components/ui/Carousel";
import { ItemCard } from "@/components/items/ItemCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as itemsApi from "@/api/itemsApi";
import type { Item } from "@/utils/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageLoader } from "@/components/ui/FullPageLoader";
import { useAuth } from "@/hooks/useAuth";
import * as conversationsApi from "@/api/conversationsApi";

export function ItemDetailsPage({ id }: { id: string }) {
  const { push } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [related, setRelated] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(null);
      setItem(null);
      setRelated([]);
      return;
    }
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await itemsApi.getItem(id);
        const it = res?.data?.item || null;
        if (!alive) return;
        setItem(it);
        // Related: fetch a few items from same category (active only).
        if (it?.category) {
          const rel = await itemsApi.listItems({ page: 1, limit: 12, category: it.category });
          const list = (rel?.data?.items || []).filter((x: Item) => x._id !== it._id).slice(0, 8);
          if (alive) setRelated(list);
        } else {
          setRelated([]);
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load item.");
        setItem(null);
        setRelated([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/search" className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold hover:bg-white/10 focus-ring">
            <ArrowLeft className="h-5 w-5" /> Back to browse
          </Link>
          {item ? <StatusBadge status={item.status} /> : null}
        </div>

        {!id ? (
          <FullPageLoader title="Loading item…" subtitle="Preparing the details view." />
        ) : loading ? (
          <div className="glass rounded-2xl p-6 shadow-soft">
            <Skeleton className="h-6 w-2/3" />
            <div className="mt-3">
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ) : error ? (
          <EmptyState title="Could not load item" message={error} />
        ) : !item ? (
          <EmptyState title="Item not found" message="This item may have been removed." />
        ) : (
          <>
            <ItemGallery
              title={item.title}
              images={Array.isArray(item.imageUrl) ? item.imageUrl : item.imageUrl ? [item.imageUrl] : []}
            />

            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
              <TiltCard className="p-5 sm:p-6">
                <div className="font-display text-2xl font-extrabold tracking-tight text-white">{item.title}</div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-white">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> {item.location}
                  </span>
                  {item.exactLocation ? (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-5 w-5" /> {item.exactLocation}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> {String(item.date).slice(0, 10)}
                  </span>
                </div>

                <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-white">{item.description}</div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">Category: {item.category}</span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">Type: {item.type}</span>
                  {item.colour ? (
                    <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">Colour: {item.colour}</span>
                  ) : null}
                  {item.brand || item.model ? (
                    <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                      {item.brand ? `Brand: ${item.brand}` : ""}{item.brand && item.model ? " · " : ""}{item.model ? `Model: ${item.model}` : ""}
                    </span>
                  ) : null}
                  {item.uniqueMarks ? (
                    <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">Unique marks: {item.uniqueMarks}</span>
                  ) : null}
                  {item.reward ? (
                    <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">Reward: {item.reward}</span>
                  ) : null}
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                    <BadgeCheck className="h-4 w-4" /> Verification recommended
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-white">Reported by</div>
                    <div className="mt-1 text-sm text-white">
                      {typeof item.reportedBy === "object" && item.reportedBy ? (item.reportedBy as any).name : "User"}
                    </div>
                    {typeof item.reportedBy === "object" && item.reportedBy && (item.reportedBy as any).email ? (
                      <div className="mt-1 text-xs text-white">{(item.reportedBy as any).email}</div>
                    ) : null}
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-white">Created</div>
                    <div className="mt-1 text-sm text-white">{item.createdAt ? String(item.createdAt).slice(0, 10) : "—"}</div>
                    <div className="mt-1 text-xs text-white">Status: {item.status}</div>
                  </div>
                </div>
              </TiltCard>

          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <TiltCard className="p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Safety reminder</div>
                  <div className="mt-1 text-xs text-white">
                    Verify ownership with specific questions before meeting.
                  </div>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="p-5">
              <div className="text-sm font-semibold">Contact owner</div>
              <div className="mt-1 text-xs text-white">Send a secure contact request to the reporter.</div>
              <div className="mt-3 rounded-2xl bg-white/10 p-3 text-xs text-white">
                {item.contactInfo?.email || item.contactInfo?.phone ? (
                  <>
                    {item.contactInfo?.name ? <div className="font-semibold text-white">{item.contactInfo.name}</div> : null}
                    {item.contactInfo?.email ? <div className="mt-1">{item.contactInfo.email}</div> : null}
                    {item.contactInfo?.phone ? <div className="mt-1">{item.contactInfo.phone}</div> : null}
                    {item.preferredContactMethod ? <div className="mt-1">Preferred: {item.preferredContactMethod}</div> : null}
                  </>
                ) : (
                  <div>No direct contact shared. Use a claim request to connect.</div>
                )}
              </div>
              <div className="mt-4">
                <Button
                  className="w-full"
                  disabled={startingChat || (!!user?._id && typeof item.reportedBy === "object" && (item.reportedBy as any)?._id === user._id)}
                  onClick={async () => {
                    if (!user?._id) {
                      const next = encodeURIComponent(`/items/${encodeURIComponent(item._id)}`);
                      router.push(`/auth?next=${next}`);
                      return;
                    }

                    const ownerId = typeof item.reportedBy === "object" ? (item.reportedBy as any)?._id : null;
                    if (ownerId && ownerId === user._id) {
                      push({ type: "warning", title: "Not allowed", message: "You can’t message yourself." });
                      return;
                    }

                    try {
                      setStartingChat(true);
                      const res = await conversationsApi.startConversation(item._id);
                      const convo = res?.data?.conversation;
                      if (!convo?._id) throw new Error("Failed to start conversation");
                      push({ type: "success", title: "Chat started", message: "You can now message the reporter inside the app." });
                      router.push(`/messages/${encodeURIComponent(convo._id)}`);
                    } catch (e: any) {
                      push({ type: "warning", title: "Could not start chat", message: e?.message || "Please try again." });
                    } finally {
                      setStartingChat(false);
                    }
                  }}
                >
                  <MessageCircle className="h-5 w-5" /> {startingChat ? "Starting…" : "Message reporter"}
                </Button>
              </div>
            </TiltCard>

            <TiltCard className="p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Claim this item</div>
                  <div className="mt-1 text-xs text-white">
                    Send a claim request with proof details. Owner can approve/reject.
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => push({ type: "info", title: "Claim request", message: "Connect this to POST /api/claims/:itemId with proof details." })}
                >
                  Request claim
                </Button>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        <section>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white">Related</div>
              <div className="mt-1 font-display text-xl font-extrabold tracking-tight text-white">You may also like</div>
            </div>
          </div>
          <div className="mt-4">
            <Carousel>
              {related.map((r) => (
                <div key={r._id} className="w-[20rem] shrink-0">
                  <ItemCard item={r} />
                </div>
              ))}
            </Carousel>
          </div>
        </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
