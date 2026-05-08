import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export function Accordion({
  items
}: {
  items: { q: string; a: string }[];
}) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <AccordionItem key={idx} question={item.q} answer={item.a} />
      ))}
    </div>
  );
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="glass overflow-hidden rounded-2xl shadow-soft">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <div className="text-sm font-semibold">{question}</div>
        <ChevronDown className={cn("h-5 w-5 text-white transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-white">{answer}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
