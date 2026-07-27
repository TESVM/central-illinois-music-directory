import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-pearl px-3 py-1 text-sm text-ink-muted ring-1 ring-line-soft",
        className
      )}
    >
      {children}
    </span>
  );
}
