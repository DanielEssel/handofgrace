import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

interface LogoProps {
  className?: string;
  /** Use light text for dark backgrounds. */
  light?: boolean;
  showText?: boolean;
}

export function Logo({
  className,
  light = false,
  showText = true,
}: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative shrink-0 overflow-hidden rounded-xl">
        <Image
          src="/logo.png"
          alt="Hand of Grace Logo"
          width={40}
          height={40}
          priority
          className="rounded-xl object-cover"
        />
      </span>

      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-heading text-[15px] font-bold tracking-tight",
              light ? "text-white" : "text-navy"
            )}
          >
            Hand of Grace
          </span>

          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.18em]",
              light ? "text-gold-200" : "text-gold-600"
            )}
          >
            Multimedia & I.T College
          </span>
        </span>
      )}
    </span>
  );
}