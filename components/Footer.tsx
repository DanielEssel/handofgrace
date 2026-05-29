"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NAV_LINKS, SITE } from "@/data/site";

export function Footer() {
  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {SITE.tagline}. Practical ICT training, computer sales, repairs
              and tech support in {SITE.location}.
            </p>
            <p className="mt-4 border-l-2 border-gold/50 pl-3 text-sm italic text-gold-100/80">
              &ldquo;{SITE.motto}&rdquo;
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-gold-300/80">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-gold-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/registration"
                  className="text-sm text-white/70 transition-colors hover:text-gold-200"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-gold-300/80">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-300" />
                {SITE.location}
              </li>
              <li>
                <a href={`tel:${SITE.phoneRaw}`} className="flex items-center gap-3 transition-colors hover:text-gold-200">
                  <Phone className="size-4 shrink-0 text-gold-300" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 transition-colors hover:text-gold-200">
                  <Mail className="size-4 shrink-0 text-gold-300" />
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <button
            onClick={scrollTop}
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:border-gold/50 hover:text-gold-200"
          >
            Back to top <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
