"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-heading font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary Gold CTA
        primary:
          "bg-gold-sheen text-navy shadow-gold hover:shadow-glow hover:-translate-y-0.5 [&_svg]:size-4",
        // Secondary outline CTA
        outline:
          "border border-navy/15 bg-white/70 text-navy backdrop-blur hover:border-gold/50 hover:bg-white hover:-translate-y-0.5 hover:shadow-soft [&_svg]:size-4",
        // Solid navy
        navy: "bg-navy text-white shadow-navy hover:bg-navy-800 hover:-translate-y-0.5 [&_svg]:size-4",
        // Ghost navigation button
        ghost:
          "text-navy/70 hover:text-navy hover:bg-navy/5 [&_svg]:size-4",
        // Outline on dark surfaces
        "outline-light":
          "border border-white/25 text-white hover:bg-white/10 hover:border-white/50 [&_svg]:size-4",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 py-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
