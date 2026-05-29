"use client";

import {
  MapPin,
  PhoneCall,
  Mail,
  Clock3,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";
import { SITE, APPLICATION_FEE } from "@/data/site";
import { formatCedis } from "@/lib/utils";

const contactItems = [
  { icon: MapPin, label: "Visit Us", value: SITE.location },
  { icon: PhoneCall, label: "Call Us", value: SITE.phone, href: `tel:${SITE.phoneRaw}` },
  { icon: Mail, label: "Email Us", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Clock3, label: "Office Hours", value: SITE.hours },
];

const trustPoints = [
  { icon: ShieldCheck, text: "Secure Paystack payments" },
  { icon: BadgeCheck, text: "Recognised certificates" },
  { icon: Sparkles, text: "Hands-on, mentor-led" },
];

export function RegistrationHub() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hello Hand of Grace College, I'd like to enquire about training programs.",
  )}`;

  return (
    <section
      id="register"
      className="relative scroll-mt-24 overflow-hidden bg-navy-deep py-20 text-white sm:py-28"
    >
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" />
      <div className="pointer-events-none absolute -left-20 top-1/3 size-80 rounded-full bg-gold/15 blur-3xl" />

      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-200 backdrop-blur">
            <Sparkles className="size-3.5" />
            Student Registration
          </span>
          <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Start your journey for just{" "}
            <span className="text-gold-sheen">{formatCedis(APPLICATION_FEE)}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/70">
            Complete the application below and pay your application fee securely.
            Our team will reach out to confirm your enrollment.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left — contact & trust */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="font-heading text-xl font-bold">Get in touch</h3>
              <p className="mt-1 text-sm text-white/60">
                Prefer to talk first? Reach us directly.
              </p>

              <ul className="mt-6 space-y-4">
                {contactItems.map(({ icon: Icon, label, value, href }) => {
                  const content = (
                    <div className="flex items-start gap-3.5">
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/5 text-gold-300">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-300/80">
                          {label}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-white/90">
                          {value}
                        </p>
                      </div>
                    </div>
                  );
                  return (
                    <li key={label}>
                      {href ? (
                        <a href={href} className="block rounded-2xl transition-colors hover:bg-white/5">
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* CTAs */}
              <div className="mt-6 flex flex-col gap-2.5">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="lg" className="w-full">
                    <MessageCircle /> Chat on WhatsApp
                  </Button>
                </a>
                <a href={`tel:${SITE.phoneRaw}`}>
                  <Button variant="outline-light" size="lg" className="w-full">
                    <PhoneCall /> Call Admissions
                  </Button>
                </a>
              </div>
            </div>

            {/* Trust strip */}
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
              {trustPoints.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur"
                >
                  <Icon className="size-4 shrink-0 text-gold-300" />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — the form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Gold accent glow ring */}
            <div className="pointer-events-none absolute -inset-px rounded-[1.85rem] bg-gold-sheen opacity-30 blur-[2px]" />
            <div className="relative">
              <RegistrationForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
