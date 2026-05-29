import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

interface LogoProps {
  className?: string;
  /** Use light text for dark backgrounds. */
  light?: boolean;
  showText?: boolean;
}

export function Logo({ className, light = false, showText = true }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-navy shadow-navy">
        <span className="absolute inset-0 bg-gold-sheen opacity-90" />
        <svg
          viewBox="0 0 32 32"
          className="relative size-6 text-navy"
          fill="none"
          aria-hidden="true"
        >
          {/* Stylised "HG" monogram */}
          <path
            d="M7 6v20M7 16h10M17 6v20"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M25 11a6 6 0 1 0 0 10h0v-5h-3.5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-heading text-[15px] font-bold tracking-tight",
              light ? "text-white" : "text-navy",
            )}
          >
            Hand of Grace
          </span>
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.18em]",
              light ? "text-gold-200" : "text-gold-600",
            )}
          >
            Multimedia & I.T College
          </span>
        </span>
      )}
    </span>
  );
}
