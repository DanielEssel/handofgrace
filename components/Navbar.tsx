"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AccountMenu } from "@/components/auth/AccountMenu";
import { cn } from "@/lib/utils";
import { NAV_LINKS, REGISTER_ANCHOR, SITE } from "@/data/site";
import { Logo } from "./Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-x">
        <nav
          className={cn(
            "mt-3 flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5",
            "glass border border-navy/10",
            scrolled ? "shadow-soft" : "shadow-sm",
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="Hand of Grace Home"
          >
            <Logo />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-navy/5 text-navy"
                      : "text-navy/70 hover:bg-navy/5 hover:text-navy",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <a href={`tel:${SITE.phoneRaw}`} aria-label="Call us">
              <Button variant="ghost" size="sm">
                <Phone />
                Call
              </Button>
            </a>
            <AccountMenu />
            <Link href={REGISTER_ANCHOR}>
              <Button variant="primary" size="sm" className="shimmer-overlay">
                Register Now
                <ArrowRight />
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-xl border border-navy/10 bg-white/70 text-navy lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="container-x relative z-50 lg:hidden"
            >
              <div className="mt-2 overflow-hidden rounded-3xl border border-navy/10 bg-white p-3 shadow-card">
                <ul className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-medium transition-colors",
                          isActive(link.href)
                            ? "bg-slatebg text-navy"
                            : "text-navy hover:bg-slatebg",
                        )}
                      >
                        {link.label}
                        <ArrowRight className="size-4 text-navy/30" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex flex-col gap-2 border-t border-navy/10 p-2 pt-3">
                  <Link href={REGISTER_ANCHOR} className="w-full">
                    <Button variant="primary" size="lg" className="w-full">
                      Register Now
                      <ArrowRight />
                    </Button>
                  </Link>
                  <a href={`tel:${SITE.phoneRaw}`} className="w-full">
                    <Button variant="outline" size="lg" className="w-full">
                      <Phone />
                      Call {SITE.phone}
                    </Button>
                  </a>
                  <AccountMenu compact />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
