import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const fallback = [
  "bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.18),transparent_60%),linear-gradient(135deg,rgba(7,17,31,0.85),rgba(15,42,95,0.55),rgba(109,93,247,0.35))]",
  "bg-[radial-gradient(circle_at_70%_20%,rgba(109,93,247,0.18),transparent_60%),linear-gradient(135deg,rgba(7,17,31,0.86),rgba(15,42,95,0.50),rgba(6,182,212,0.28))]",
  "bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.10),transparent_60%),linear-gradient(135deg,rgba(7,17,31,0.88),rgba(15,42,95,0.46),rgba(109,93,247,0.28))]"
];

export function ItemGallery({ title, images }: { title: string; images?: string[] }) {
  const pics = images && images.length ? images.slice(0, 3) : [];
  return (
    <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
      <motion.div
        className={cn("glass relative overflow-hidden rounded-2xl shadow-soft", fallback[0])}
        initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {pics[0] ? (
          <img src={pics[0]} alt={title} loading="lazy" className="h-full w-full object-cover aspect-[16/11]" />
        ) : (
          <div className="aspect-[16/11] w-full" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-sm font-semibold text-white">{title}</div>
        </div>
      </motion.div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {(pics.length ? pics.slice(1) : fallback.slice(1)).map((x, i) => (
          <motion.button
            key={i}
            className={cn("glass relative overflow-hidden rounded-2xl shadow-soft transition hover:shadow-glow", pics.length ? "" : (x as string))}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {pics.length ? (
              <img src={x as string} alt={`${title} ${i + 2}`} loading="lazy" className="h-full w-full object-cover aspect-[16/11]" />
            ) : (
              <div className="aspect-[16/11] w-full" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
