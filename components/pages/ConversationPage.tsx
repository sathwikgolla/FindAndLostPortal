import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Send, ShieldCheck } from "lucide-react";
import { SidebarShell } from "@/components/layout/SidebarShell";
import { TiltCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/Badge";
import { useToast } from "@/components/toast/ToastProvider";
import { useAuth } from "@/hooks/useAuth";
import * as conversationsApi from "@/api/conversationsApi";

type ChatMessage = any;

export function ConversationPage({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { push } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [solving, setSolving] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const meId = user?._id || "";
  const other = useMemo(() => {
    const parts = conversation?.participants || [];
    return parts.find((p: any) => String(p?._id) !== String(meId)) || null;
  }, [conversation?.participants, meId]);

  const mySolveState = useMemo(() => {
    if (!conversation || !meId) return { mine: false, other: false, both: false, role: "participant" as const };
    const ownerId = String(conversation?.itemId?.reportedBy || conversation?.itemId?.reportedBy?._id || "");
    const isOwner = ownerId && String(ownerId) === String(meId);
    const mine = isOwner ? !!conversation.solvedByOwner : !!conversation.solvedByFinder;
    const otherConfirmed = isOwner ? !!conversation.solvedByFinder : !!conversation.solvedByOwner;
    return { mine, other: otherConfirmed, both: mine && otherConfirmed, role: isOwner ? ("owner" as const) : ("finder" as const) };
  }, [conversation, meId]);

  async function load() {
    const res = await conversationsApi.getConversation(id);
    setConversation(res?.data?.conversation || null);
    setMessages(res?.data?.messages || []);
    await conversationsApi.markRead(id).catch(() => {});
  }

  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        await load();
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load conversation.");
        setConversation(null);
        setMessages([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  if (!id) return null;

  return (
    <SidebarShell activeHref="/messages">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/messages" className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 focus-ring">
            <ArrowLeft className="h-5 w-5" /> Back to messages
          </Link>
          {conversation?.itemId?.status ? <StatusBadge status={conversation.itemId.status} /> : null}
        </div>

        {loading ? (
          <div className="glass rounded-2xl p-6 shadow-soft">
            <Skeleton className="h-6 w-2/3" />
            <div className="mt-3">
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ) : error ? (
          <EmptyState title="Could not load conversation" message={error} />
        ) : !conversation ? (
          <EmptyState title="Conversation not found" message="This chat may have been removed." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <TiltCard className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-white">Item</div>
              <div className="mt-1 font-display text-xl font-extrabold tracking-tight text-white">{conversation?.itemId?.title || "Item"}</div>
              <div className="mt-2 text-sm text-white">Chatting with: <span className="font-semibold text-white">{other?.name || "User"}</span></div>

              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm text-white">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Safety</div>
                    <div className="mt-1 text-xs text-white">
                      Verify ownership with unique marks before meeting. Prefer public handovers.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm text-white">
                <div className="text-xs font-semibold uppercase tracking-wider text-white">Problem solved confirmations</div>
                <div className="mt-3 grid gap-2 text-xs text-white">
                  <div className="flex items-center justify-between">
                    <span>Owner confirmed</span>
                    <span className="font-semibold">{conversation.solvedByOwner ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Finder confirmed</span>
                    <span className="font-semibold">{conversation.solvedByFinder ? "Yes" : "No"}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    className="w-full"
                    disabled={solving || conversation.status !== "active" || mySolveState.mine}
                    onClick={async () => {
                      try {
                        setSolving(true);
                        await conversationsApi.confirmSolved(id);
                        push({
                          type: "success",
                          title: "Confirmed",
                          message: mySolveState.other ? "Both users confirmed. Report is now solved." : "Waiting for the other user to confirm."
                        });
                        await load();
                      } catch (e: any) {
                        push({ type: "warning", title: "Could not confirm", message: e?.message || "Please try again." });
                      } finally {
                        setSolving(false);
                      }
                    }}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    {conversation.status === "solved" ? "Report solved" : mySolveState.mine ? "You confirmed solved" : "Problem Solved"}
                  </Button>
                  {conversation.status === "active" && mySolveState.mine && !mySolveState.other ? (
                    <div className="mt-2 text-center text-xs text-white">Waiting for other user confirmation…</div>
                  ) : null}
                </div>
              </div>
            </TiltCard>

            <TiltCard className="overflow-hidden p-0">
              <div className="border-b border-white/10 p-4">
                <div className="font-display text-lg font-extrabold tracking-tight text-white">Chat</div>
              </div>
              <div ref={listRef} className="h-[55vh] overflow-auto p-4">
                <div className="space-y-3">
                  {messages.map((m) => {
                    const mine = String(m?.sender?._id || m?.sender) === String(meId);
                    return (
                      <motion.div key={m._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                        <div className={mine ? "flex justify-end" : "flex justify-start"}>
                          <div className={(mine ? "bg-white/15" : "bg-white/10") + " max-w-[85%] rounded-2xl px-4 py-3 text-sm text-white shadow-soft"}>
                            <div className="whitespace-pre-wrap break-words">{m.text}</div>
                            <div className="mt-1 text-[11px] text-white/90">{String(m.createdAt).slice(0, 16).replace("T", " ")}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="border-t border-white/10 p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write a message…"
                    className="glass min-h-[46px] w-full resize-none rounded-2xl px-4 py-3 text-sm text-white outline-none placeholder:text-white/80"
                    maxLength={1000}
                    disabled={sending || conversation.status !== "active"}
                  />
                  <Button
                    disabled={sending || !text.trim() || conversation.status !== "active"}
                    onClick={async () => {
                      try {
                        setSending(true);
                        const payload = text;
                        setText("");
                        await conversationsApi.sendMessage(id, payload);
                        await load();
                      } catch (e: any) {
                        push({ type: "warning", title: "Send failed", message: e?.message || "Please try again." });
                      } finally {
                        setSending(false);
                      }
                    }}
                  >
                    <Send className="h-5 w-5" /> Send
                  </Button>
                </div>
                {conversation.status !== "active" ? (
                  <div className="mt-2 text-center text-xs text-white">
                    This conversation is {conversation.status}.
                  </div>
                ) : null}
              </div>
            </TiltCard>
          </div>
        )}
      </div>
    </SidebarShell>
  );
}
