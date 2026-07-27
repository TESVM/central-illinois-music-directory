import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Two button grammars, per DESIGN.md: the blue pill for actions, and a compact
 * rect for utility chrome. `active:scale-95` is the system-wide press state.
 */
const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center text-body font-normal transition-transform active:scale-95 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:pointer-events-none disabled:text-ink-subtle",
  {
    variants: {
      variant: {
        // The signature Apple action.
        default: "rounded-full bg-brand-700 px-[22px] py-[11px] text-white disabled:bg-line",
        // The "ghost pill" — the second CTA when two sit together.
        secondary:
          "rounded-full border border-brand-700 bg-transparent px-[22px] py-[11px] text-brand-700",
        // Pearl capsule for tertiary actions on cards.
        pearl: "rounded-md bg-pearl px-[14px] py-2 text-sm text-ink-muted ring-1 ring-line-soft",
        // Compact dark utility rect, used in chrome.
        utility: "min-h-0 rounded-sm bg-ink px-[15px] py-2 text-sm text-white",
        // Plain inline action.
        ghost: "min-h-0 px-1 text-body text-brand-700"
      },
      size: {
        default: "",
        sm: "min-h-0 px-4 py-2 text-sm",
        lg: "px-7 py-3.5 text-lg font-light"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
