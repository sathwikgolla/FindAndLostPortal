import { useEffect, useState } from "react";
import { Briefcase, FileText, KeyRound, Laptop, MapPin, Sparkles } from "lucide-react";
import { SidebarShell } from "@/components/layout/SidebarShell";
import { SearchBar } from "@/components/search/SearchBar";
import { FiltersRow } from "@/components/search/FiltersRow";
import { ItemCard } from "@/components/items/ItemCard";
import { Reveal } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { PageHeader } from "@/components/ui/PageHeader";
import { Chip } from "@/components/ui/Chip";
import * as itemsApi from "@/api/itemsApi";
import type { Item } from "@/utils/types";

export function SearchBrowsePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("Anywhere");
  const [colour, setColour] = useState("All");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState<"active" | "solved">("active");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [chip, setChip] = useState<string>("All");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const t = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await itemsApi.listItems({
          page: 1,
          limit: 24,
          query: q || undefined,
          category: category !== "All" ? category : chip !== "All" ? chip : undefined,
          location: location !== "Anywhere" ? location : undefined,
          colour: colour !== "All" ? colour : undefined,
          type: type !== "All" ? type : undefined,
          status: status === "solved" ? "solved" : undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined
        });
        setItems(res?.data?.items || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load items.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [category, chip, colour, dateFrom, dateTo, location, q, status, type]);

  return (
    <SidebarShell activeHref="/search">
      <div className="space-y-6">
        <PageHeader
          kicker="Search & Browse"
          title="Browse items"
          subtitle="Premium search, filters, category chips, and smooth loading states."
        />

        <Reveal>
          <div className="grid gap-3">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <SearchBar value={q} onChange={setQ} />
              <div className="glass rounded-2xl p-3 shadow-soft">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <MapPin className="h-4 w-4 text-white" />
                  Tip: Use location + category for better matches
                </div>
              </div>
            </div>
            <FiltersRow
              category={category}
              setCategory={setCategory}
              location={location}
              setLocation={setLocation}
              type={type}
              setType={setType}
              status={status}
              setStatus={setStatus}
              colour={colour}
              setColour={setColour}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
            />
            <div className="flex flex-wrap gap-2">
              <Chip active={chip === "All"} onClick={() => setChip("All")} icon={<Sparkles className="h-4 w-4" />}>
                All
              </Chip>
              <Chip active={chip === "Documents"} onClick={() => setChip("Documents")} icon={<FileText className="h-4 w-4" />}>
                Documents
              </Chip>
              <Chip active={chip === "Electronics"} onClick={() => setChip("Electronics")} icon={<Laptop className="h-4 w-4" />}>
                Electronics
              </Chip>
              <Chip active={chip === "Accessories"} onClick={() => setChip("Accessories")} icon={<Briefcase className="h-4 w-4" />}>
                Accessories
              </Chip>
              <Chip active={chip === "Keys"} onClick={() => setChip("Keys")} icon={<KeyRound className="h-4 w-4" />}>
                Keys
              </Chip>
            </div>
          </div>
        </Reveal>

        {loading ? (
          <Reveal>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
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
          </Reveal>
        ) : error ? (
          <div className="max-w-2xl">
            <EmptyState title="Could not load items" message={error} />
          </div>
        ) : items.length ? (
          <Reveal>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((i) => (
                <ItemCard key={i._id} item={i} />
              ))}
            </div>
          </Reveal>
        ) : (
          <div className="max-w-2xl">
            <EmptyState
              title="No items found"
              message="No items found yet. Be the first to report one."
              actionLabel="Reset filters"
              onAction={() => {
                setQ("");
                setCategory("All");
                setLocation("Anywhere");
                setColour("All");
                setType("All");
                setStatus("active");
                setDateFrom("");
                setDateTo("");
              }}
            />
          </div>
        )}
      </div>
    </SidebarShell>
  );
}
