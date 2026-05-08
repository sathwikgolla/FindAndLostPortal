import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export function TopProgress() {
  const router = useRouter();
  const [active, setActive] = useState(false);

  useEffect(() => {
    let t = 0;
    const start = () => {
      window.clearTimeout(t);
      setActive(true);
    };
    const done = () => {
      t = window.setTimeout(() => setActive(false), 250);
    };
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
      window.clearTimeout(t);
    };
  }, [router.events]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-[200] h-[3px] origin-left"
      initial={false}
      animate={
        active
          ? {
              opacity: 1,
              scaleX: [0.1, 0.7, 0.92],
              transition: { duration: 0.9, ease: "easeOut" }
            }
          : { opacity: 0, scaleX: 1, transition: { duration: 0.2 } }
      }
      style={{
        background: "linear-gradient(90deg, #06B6D4, #6D5DF7, #0F2A5F)"
      }}
    />
  );
}

