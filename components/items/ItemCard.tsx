import * as React from "react";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { Item } from "@/utils/types";
import { StatusBadge } from "@/components/ui/Badge";

function ItemCardImpl({ item }: { item: Item }) {
  const urls = Array.isArray(item.imageUrl) ? item.imageUrl : item.imageUrl ? [item.imageUrl] : [];
  const img = urls.length ? urls[0] : null;
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 320, damping: 26 }}>
      <Link
        href={`/items/${encodeURIComponent(item._id)}`}
        className={cn(
          "group relative block overflow-hidden rounded-2xl",
          "glass shadow-soft hover:shadow-glow focus-ring"
        )}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent">
          {img ? (
            <img
              src={img}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_55%)]" />
              <div className="absolute inset-0 scale-[1.02] bg-[conic-gradient(from_210deg_at_50%_50%,rgba(6,182,212,0.20),rgba(109,93,247,0.18),rgba(15,42,95,0.14),rgba(6,182,212,0.20))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white">
                  No image available
                </div>
              </div>
            </>
          )}
          <div className="absolute left-4 top-4">
            <StatusBadge status={item.status} />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent opacity-80" />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate font-display text-base font-bold tracking-tight text-white">
                {item.title}
              </div>
              <div className="mt-1 inline-flex flex-wrap items-center gap-2 text-xs text-white">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {item.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {String(item.date).slice(0, 10)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
                  {item.category}
                </span>
                {item.colour ? <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">{item.colour}</span> : null}
              </div>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-white">
              {item.type}
            </span>
          </div>
          <div className="mt-2 text-xs text-white">
            {item.exactLocation ? `Exact: ${item.exactLocation}` : "No exact location available"}
          </div>
          <div className="mt-3 line-clamp-2 text-sm text-white">{item.description}</div>
        </div>
      </Link>
    </motion.div>
  );
}

export const ItemCard = Object.assign(React.memo(ItemCardImpl), { displayName: "ItemCard" });
