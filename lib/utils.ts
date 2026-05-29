import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Smooth-scroll to a section id, accounting for the sticky navbar offset. */
export function scrollToSection(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id.replace(/^#/, ""));
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Format a number as Ghana Cedi currency. */
export function formatCedis(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
  }).format(amount);
}
