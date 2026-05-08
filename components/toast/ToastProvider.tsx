import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/utils/cn";

type ToastType = "success" | "info" | "warning";
type Toast = { id: string; type: ToastType; title: string; message?: string };

type ToastContextValue = {
  push: (t: Omit<Toast, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const push = React.useCallback((t: Omit<Toast, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const toast: Toast = { id, ...t };
    setToasts((prev) => [toast, ...prev].slice(0, 4));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3600);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[22rem] flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 30, scale: 0.98, filter: "blur(10px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "pointer-events-auto glass relative overflow-hidden rounded-2xl p-3 shadow-soft"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5 grid h-9 w-9 place-items-center rounded-2xl", iconBg(t.type))}>
                  {icon(t.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{t.title}</div>
                  {t.message ? <div className="mt-0.5 text-xs text-white">{t.message}</div> : null}
                </div>
                <button
                  className="grid h-9 w-9 place-items-center rounded-2xl text-white transition hover:bg-white/10"
                  onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                  aria-label="Dismiss"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#06B6D4]/55 via-[#6D5DF7]/55 to-[#0F2A5F]/45" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function icon(type: ToastType) {
  if (type === "success") return <CheckCircle2 className="h-5 w-5 text-white" />;
  if (type === "warning") return <AlertTriangle className="h-5 w-5 text-white" />;
  return <Info className="h-5 w-5 text-white" />;
}

function iconBg(type: ToastType) {
  if (type === "success") return "bg-emerald-500/12 border border-emerald-500/18";
  if (type === "warning") return "bg-amber-500/12 border border-amber-500/18";
  return "bg-sky-500/12 border border-sky-500/18";
}
