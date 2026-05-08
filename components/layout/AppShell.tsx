import { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { cn } from "@/utils/cn";
import { StartupBackground } from "@/components/layout/StartupBackground";

export function AppShell({
  children,
  showNav = true,
  className
}: {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}) {
  return (
    <StartupBackground>
      <div className={cn("min-h-screen", className)}>
        {showNav ? <FloatingNav /> : null}
        <Container className="pt-4 pb-14">{children}</Container>
      </div>
    </StartupBackground>
  );
}
