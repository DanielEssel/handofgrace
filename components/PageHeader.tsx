import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  /** Breadcrumb label for the current page. */
  current: string;
}

/** Navy banner used at the top of interior pages, with breadcrumb. */
export function PageHeader({
  kicker,
  title,
  description,
  current,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-navy-deep pt-32 pb-16 text-white sm:pt-36 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute inset-0 bg-grid [background-size:42px_42px] opacity-[0.06]" />
      <div className="pointer-events-none absolute -left-24 top-6 size-72 rounded-full bg-gold/15 blur-3xl" />

      <div className="container-x relative">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1.5 text-xs font-medium text-white/55">
          <Link href="/" className="transition-colors hover:text-gold-200">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-gold-200">{current}</span>
        </nav>

        {kicker && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">
            {kicker}
          </p>
        )}
        <h1 className="mt-2 max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/70">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
