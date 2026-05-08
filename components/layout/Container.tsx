import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("w-full px-4 sm:px-6 lg:px-10", className)}>{children}</div>;
}
