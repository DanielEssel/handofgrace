import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-20 sm:py-28", className)}
    >
      <div className="container-x">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="kicker">{eyebrow}</span>
        </Reveal>
      )}
      <Reveal index={1}>
        <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight text-navy md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal index={2}>
          <p className="mt-4 text-pretty text-base leading-relaxed text-slate-600 md:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
