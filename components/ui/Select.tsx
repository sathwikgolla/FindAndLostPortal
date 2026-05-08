import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export function Select({
  label,
  value,
  onChange,
  options,
  className
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}) {
  const id = React.useId();
  const hasValue = value.length > 0;
  return (
    <div className={cn("w-full", className)}>
      <div className="glass relative rounded-2xl shadow-soft transition-shadow focus-within:shadow-glow">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="peer h-14 w-full appearance-none rounded-2xl bg-transparent px-4 pt-5 text-sm text-white outline-none"
        >
          <option value="" disabled>
            Select…
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 top-4 text-xs font-medium text-white transition-all",
            "peer-focus:text-white",
            hasValue ? "top-4 text-xs" : ""
          )}
        >
          {label}
        </label>
        <ChevronDown className="pointer-events-none absolute right-4 top-5 h-5 w-5 text-white" />
      </div>
    </div>
  );
}
