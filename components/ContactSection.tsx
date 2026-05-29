"use client";

import {
  MapPin,
  PhoneCall,
  Mail,
  Clock3,
  MessageCircle,
} from "lucide-react";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/data/site";

const contactItems = [
  { icon: MapPin, label: "Visit Us", value: SITE.location },
  {
    icon: PhoneCall,
    label: "Call Us",
    value: SITE.phone,
    href: `tel:${SITE.phoneRaw}`,
  },
  {
    icon: Mail,
    label: "Email Us",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  { icon: Clock3, label: "Office Hours", value: SITE.hours },
];

export function ContactSection() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hello Hand of Grace College, I'd like to enquire about training programs.",
  )}`;
  const mapsQuery = encodeURIComponent(SITE.location);

  return (
    <Section className="bg-slatebg">
      <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Details */}
        <Reveal>
          <div className="rounded-3xl border border-navy/10 bg-white p-7 shadow-soft">
            <h2 className="font-heading text-2xl font-bold text-navy">
              Get in touch
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              We&apos;d love to hear from you. Reach us through any of the
              channels below.
            </p>

            <ul className="mt-7 space-y-5">
              {contactItems.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <div className="flex items-start gap-3.5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-navy/5 text-gold-600">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">
                        {label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-navy">
                        {value}
                      </p>
                    </div>
                  </div>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        className="block rounded-2xl transition-colors hover:bg-slatebg"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="primary" size="lg" className="w-full">
                  <MessageCircle /> WhatsApp
                </Button>
              </a>
              <a href={`tel:${SITE.phoneRaw}`} className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  <PhoneCall /> Call Us
                </Button>
              </a>
            </div>
          </div>
        </Reveal>

        {/* Map */}
        <Reveal index={1}>
          <div className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-soft">
            <iframe
              title="Hand of Grace College location"
              src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
