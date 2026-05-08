import { Search } from "lucide-react";
import { cn } from "@/utils/cn";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search items by title, location, category…",
  className
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("glass relative rounded-2xl shadow-soft transition-shadow focus-within:shadow-glow", className)}>
      <Search className="pointer-events-none absolute left-4 top-4.5 h-5 w-5 text-white" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-4 text-sm text-white outline-none placeholder:text-white"
      />
    </div>
  );
}
