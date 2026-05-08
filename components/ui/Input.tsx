import * as React from "react";
import { cn } from "@/utils/cn";

export function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
  name,
  error,
  className,
  autoComplete
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  name?: string;
  error?: string;
  className?: string;
  autoComplete?: string;
}) {
  const id = React.useId();
  const hasValue = value.length > 0;
  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "glass relative rounded-2xl",
          "transition-shadow focus-within:shadow-glow"
        )}
      >
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "peer h-14 w-full rounded-2xl bg-transparent px-4 pt-5 text-sm outline-none",
            "text-white placeholder:text-transparent",
            error ? "ring-2 ring-red-500/50" : "ring-0"
          )}
          placeholder={label}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 top-4 text-xs font-medium text-white transition-all",
            "peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium",
            "peer-focus:top-4 peer-focus:text-xs peer-focus:text-white",
            hasValue ? "top-4 text-xs" : ""
          )}
        >
          {label}
        </label>
      </div>
      {error ? (
        <div className="mt-2 text-xs font-medium text-white">{error}</div>
      ) : null}
    </div>
  );
}
