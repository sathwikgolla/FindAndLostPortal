import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search } from "lucide-react";
import { SidebarShell } from "@/components/layout/SidebarShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { TiltCard } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/Badge";
import * as conversationsApi from "@/api/conversationsApi";

type ConversationRow = any;

export function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [conversations, setConversations] = useState<ConversationRow[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await conversationsApi.listConversations();
        if (!alive) return;
        setConversations(res?.data?.conversations || []);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load conversations.");
        setConversations([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return conversations;
    return conversations.filter((c) => {
      const itemTitle = String(c?.itemId?.title || "").toLowerCase();
      const otherName = String(c?.otherUser?.name || "").toLowerCase();
      const last = String(c?.lastMessage?.text || "").toLowerCase();
      return itemTitle.includes(needle) || otherName.includes(needle) || last.includes(needle);
    });
  }, [conversations, q]);

  return (
    <SidebarShell activeHref="/messages">
      <div className="space-y-6">
        <PageHeader
          kicker="Messages"
          title="In-app conversations"
          subtitle="Chat privately, confirm when it’s solved, and keep reports accurate."
        />

        <div className="glass rounded-2xl p-3 shadow-soft">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white">
              <Search className="h-5 w-5" />
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by item, user, or last message…"
              className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/80"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 shadow-soft">
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-3">
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <EmptyState title="Could not load messages" message={error} />
        ) : filtered.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((c) => (
              <motion.div key={c._id} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 320, damping: 26 }}>
                <Link href={`/messages/${encodeURIComponent(c._id)}`} className="block">
                  <TiltCard className="p-5 hover:shadow-glow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-display text-base font-extrabold tracking-tight text-white">
                          {c?.itemId?.title || "Conversation"}
                        </div>
                        <div className="mt-1 text-xs text-white">
                          With: <span className="font-semibold text-white">{c?.otherUser?.name || "User"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {c?.itemId?.status ? <StatusBadge status={c.itemId.status} /> : null}
                        {c?.unreadCount ? (
                          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">
                            {c.unreadCount} unread
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-3 line-clamp-2 text-sm text-white">
                      {c?.lastMessage?.text || "No messages yet."}
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white">
                      <MessageCircle className="h-4 w-4" /> Open chat
                      <span className="ml-auto text-white">{c.status === "solved" ? "Solved" : "Active"}</span>
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState title="No conversations yet" message="Start a conversation from any item details page." />
        )}
      </div>
    </SidebarShell>
  );
}
