import Link from "next/link";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE, APPLICATION_FEE } from "@/data/site";
import { formatCedis } from "@/lib/utils";

/** Bottom-of-homepage band that drives users to the registration page. */
export function HomeRegisterCta() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hello Hand of Grace College, I'd like to enquire about training programs.",
  )}`;

  return (
    <section className="relative overflow-hidden bg-navy-deep py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" />
      <div className="pointer-events-none absolute -left-20 top-1/3 size-80 rounded-full bg-gold/15 blur-3xl" />

      <div className="container-x relative text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-200 backdrop-blur">
          <Sparkles className="size-3.5" />
          Enroll Today
        </span>
        <h2 className="mx-auto mt-5 max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
          Start your journey for just{" "}
          <span className="text-gold-sheen">{formatCedis(APPLICATION_FEE)}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/70">
          Apply online in minutes and pay your application fee securely. Our
          admissions team will reach out to confirm your enrollment.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/registration">
            <Button variant="primary" size="lg" className="shimmer-overlay">
              Register Now
              <ArrowRight />
            </Button>
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline-light" size="lg">
              <MessageCircle /> Chat on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
