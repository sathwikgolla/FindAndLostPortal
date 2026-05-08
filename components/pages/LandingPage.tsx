import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Search, Phone, KeyRound, CreditCard, IdCard } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Carousel } from "@/components/ui/Carousel";
import { Accordion } from "@/components/ui/Accordion";
import type { ReactNode } from "react";
import * as itemsApi from "@/api/itemsApi";
import type { Item } from "@/utils/types";
import { ItemCard } from "@/components/items/ItemCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function LandingPage() {
  return (
    <div className="bg-[rgb(var(--bg))]">
      <AppShell>
        <Hero />
        <div className="mt-10 space-y-16">
          <Stats />
          <RecentReports />
          <HowItWorks />
          <Features />
          <Testimonials />
          <FAQ />
          <FinalCTA />
        </div>
      </AppShell>
    </div>
  );
}

function RecentReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await itemsApi.listItems({ page: 1, limit: 10, sort: "newest" });
        if (!alive) return;
        setItems(res?.data?.items || []);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load recent items.");
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Reveal>
      <section>
        <Container>
          <SectionTitle kicker="Explore" title="Recent reports" />
          <div className="mt-6">
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
              <div className="max-w-2xl">
                <EmptyState title="Could not load items" message={error} />
              </div>
            ) : items.length ? (
              <Carousel>
                {items.slice(0, 10).map((i) => (
                  <div key={i._id} className="w-[20rem] shrink-0">
                    <ItemCard item={i} />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="max-w-2xl">
                <EmptyState title="No items found yet" message="No items found yet. Be the first to report one." />
              </div>
            )}
          </div>
        </Container>
      </section>
    </Reveal>
  );
}

function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundSize: "220% 220%",
          backgroundImage: "linear-gradient(120deg, #07111F, #0F2A5F, #6D5DF7, #06B6D4)"
        }}
      />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:84px_84px]" />

      <Container className="relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-soft">
              <Sparkles className="h-4 w-4 text-white" />
              Premium campus lost & found
            </div>

            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Find Lost Items. Return Found Items. <span className="text-white">Connect Campus Faster.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white">
              A modern portal for students to report, browse, match, and safely claim items with a startup-grade experience.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/report-lost">
                <Button size="lg" variant="primary">
                  Report Lost
                </Button>
              </Link>
              <Link href="/report-found">
                <Button size="lg" variant="secondary">
                  Report Found
                </Button>
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 text-xs font-semibold text-white">
              <Pill icon={<ShieldCheck className="h-4 w-4" />}>Safer claims</Pill>
              <Pill icon={<Search className="h-4 w-4" />}>Faster discovery</Pill>
              <Pill icon={<Sparkles className="h-4 w-4" />}>Premium UI</Pill>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.65),transparent_55%)]" />
        <div className="relative grid gap-4 sm:grid-cols-2">
              <FloatingCard icon={<Phone className="h-5 w-5" />} title="Phone" note="Tap-to-contact flow" delay={0.0} />
              <FloatingCard icon={<CreditCard className="h-5 w-5" />} title="Wallet" note="Secure verification" delay={0.1} />
              <FloatingCard icon={<KeyRound className="h-5 w-5" />} title="Keys" note="Location match" delay={0.2} />
              <FloatingCard icon={<IdCard className="h-5 w-5" />} title="ID Cards" note="Private details" delay={0.3} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Pill({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 shadow-soft text-white">
      <span className="text-white">{icon}</span>
      <span>{children}</span>
    </span>
  );
}

function FloatingCard({
  icon,
  title,
  note,
  delay
}: {
  icon: ReactNode;
  title: string;
  note: string;
  delay: number;
}) {
  return (
    <motion.div
      className="glass rounded-2xl p-4 shadow-soft"
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <motion.div
        className="flex items-start gap-3"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
          <span className="text-white">{icon}</span>
        </div>
        <div className="min-w-0">
          <div className="font-display text-sm font-extrabold tracking-tight text-white">{title}</div>
          <div className="mt-1 text-xs text-white">{note}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Stats() {
  return (
    <Reveal>
      <TiltCard className="p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <Stat label="Items reunited" value={24873} suffix="+" />
          <Stat label="Average match time" value={18} suffix="hrs" />
          <Stat label="Verified reports" value={92} suffix="%" />
        </div>
      </TiltCard>
    </Reveal>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <div className="text-xs font-semibold text-white">{label}</div>
      <div className="mt-2">
        <Counter value={value} suffix={suffix} />
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { t: "Report in seconds", d: "Create a polished report with photos and details." },
    { t: "Browse & match", d: "Search by category, location, and type." },
    { t: "Reconnect safely", d: "Contact with privacy-first guidelines." }
  ];
  return (
    <Reveal>
      <section>
        <SectionTitle kicker="How it works" title="A smooth path from lost to found." />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div key={s.t} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 320, damping: 26 }}>
              <TiltCard className="p-5">
                <div className="flex items-center justify-between">
                  <div className="font-display text-base font-extrabold tracking-tight">{s.t}</div>
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                </div>
                <div className="mt-2 text-sm text-white">{s.d}</div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

function Features() {
  const features = [
    { icon: <Sparkles className="h-5 w-5" />, t: "Premium UI polish", d: "Warm palette, micro-interactions, and buttery motion." },
    { icon: <ShieldCheck className="h-5 w-5" />, t: "Privacy-first", d: "Share details responsibly. Keep sensitive info protected." },
    { icon: <Search className="h-5 w-5" />, t: "Fast discovery", d: "Filters and search that feel instant and clean." }
  ];
  return (
    <Reveal>
      <section>
        <SectionTitle kicker="Features" title="Elegant, safe, and made to feel premium." />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <TiltCard key={f.t} className="p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                  {f.icon}
                </div>
                <div>
                  <div className="font-display text-base font-extrabold tracking-tight">{f.t}</div>
                  <div className="mt-1 text-sm text-white">{f.d}</div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

function Testimonials() {
  const cards = [
    { n: "Aarav", r: "â€œFound my keys within hours. The experience felt premium and effortless.â€" },
    { n: "Meera", r: "â€œReporting was smooth, and the UI made it easy to add details.â€" },
    { n: "Sahil", r: "â€œThe search filters are clean. Love the warm vibe and micro animations.â€" },
    { n: "Zoya", r: "â€œFeels like a real product, not a basic app. Everything is polished.â€" }
  ];
  return (
    <Reveal>
      <section>
        <SectionTitle kicker="Testimonials" title="Loved by people who value smooth experiences." />
        <div className="mt-6">
          <Carousel>
            {cards.map((c) => (
              <TiltCard key={c.n} className="w-[19rem] shrink-0 p-5">
                <div className="text-sm text-white">{c.r}</div>
                <div className="mt-4 font-display text-sm font-extrabold tracking-tight">{c.n}</div>
              </TiltCard>
            ))}
          </Carousel>
        </div>
      </section>
    </Reveal>
  );
}

function FAQ() {
  const items = [
    { q: "Is FindAndLost free to use?", a: "Yes. Reporting and browsing are free, with room for premium plans later." },
    { q: "How do you keep contact safe?", a: "We encourage verification questions and avoid sharing sensitive details publicly." },
    { q: "Can I edit a report later?", a: "Yes. In the dashboard and My Reports pages, you can update status and details." }
  ];
  return (
    <Reveal>
      <section>
        <SectionTitle kicker="FAQ" title="Everything you need, answered." />
        <div className="mt-6">
          <Accordion items={items} />
        </div>
      </section>
    </Reveal>
  );
}

function FinalCTA() {
  return (
    <Reveal>
      <section>
        <TiltCard className="relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(212,222,149,0.28),transparent_55%),radial-gradient(circle_at_90%_30%,rgba(186,192,149,0.24),transparent_55%)]" />
          <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="font-display text-2xl font-extrabold tracking-tight">Ready to report?</div>
              <div className="mt-1 text-sm text-white">Create a clean report, browse matches, and reconnect.</div>
            </div>
            <div className="flex gap-3">
              <Link href="/report-lost">
                <Button variant="primary">Report Lost</Button>
              </Link>
              <Link href="/report-found">
                <Button variant="secondary">Report Found</Button>
              </Link>
            </div>
          </div>
        </TiltCard>
      </section>
    </Reveal>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-white">{kicker}</div>
      <div className="mt-2 font-display text-2xl font-extrabold tracking-tight text-white">{title}</div>
    </div>
  );
}
