import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import "@/styles/globals.css";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { MotionLayout } from "@/components/motion/MotionLayout";
import { TopProgress } from "@/components/ui/TopProgress";
import { AuthProvider } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function App({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    const onDone = () => {
      if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };
    router.events.on("routeChangeComplete", onDone);
    return () => {
      router.events.off("routeChangeComplete", onDone);
    };
  }, [router.events]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ToastProvider>
        <AuthProvider>
          <TopProgress />
          <AnimatePresence mode="wait" initial={false}>
            <MotionLayout key={router.asPath}>
              <Component {...pageProps} />
            </MotionLayout>
          </AnimatePresence>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
