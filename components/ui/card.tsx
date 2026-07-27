import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Utility card: white, one hairline, 18px radius, no shadow. Elevation in this
 * system comes from surface-color change, not from shadow.
 */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-line bg-surface", className)} {...props} />;
}
