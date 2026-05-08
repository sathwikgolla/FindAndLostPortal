import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

export function ThemeToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <span className="inline-block h-10 w-10 rounded-full bg-[rgba(255,255,255,0.75)]" />;

  const isDark = (theme === "dark" || resolvedTheme === "dark") ?? false;
  return (
    <IconButton
      ariaLabel={isDark ? "Dark mode enabled" : "Enable dark mode"}
      onClick={() => setTheme("dark")}
      variant="glass"
      className={
        tone === "dark"
          ? "bg-white/10 hover:bg-white/15 border border-white/10 text-white"
          : undefined
      }
    >
      <Moon className="h-5 w-5" />
    </IconButton>
  );
}
