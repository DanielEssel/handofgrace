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

export function ContactSection() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hello Hand of Grace College, I'd like to enquire about training programs."
  )}`;

  const mapsQuery = encodeURIComponent(
    SITE.locations.join(" and ")
  );

  return (
    <Section className="bg-slatebg">
      <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">

        {/* ───────────────── Contact Card ───────────────── */}
        <Reveal>
          <div className="rounded-3xl border border-navy/10 bg-white p-7 shadow-card">

            <h2 className="font-heading text-2xl font-bold tracking-premium text-navy">
              Get in touch
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              We&apos;d love to hear from you. Reach us through any
              of the channels below.
            </p>

            <ul className="mt-7 space-y-5">

              {/* Locations */}
              <li>
                <div className="flex items-start gap-3.5">

                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-navy/5 text-gold-600">
                    <MapPin className="size-5" />
                  </span>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">
                      Visit Us
                    </p>

                    <div className="mt-1 flex flex-col gap-1">
                      {SITE.locations.map((location) => (
                        <p
                          key={location.address}
                          className="text-sm font-medium text-navy"
                        >
                          {location.address}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </li>

              {/* Phones */}
              <li>
                <div className="flex items-start gap-3.5">

                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-navy/5 text-gold-600">
                    <PhoneCall className="size-5" />
                  </span>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">
                      Call Us
                    </p>

                    <div className="mt-1 flex flex-col gap-1">
                      {SITE.phones.map((phone) => (
                        <a
                          key={phone.raw}
                          href={`tel:${phone.raw}`}
                          className="text-sm font-medium text-navy transition-colors hover:text-gold-600"
                        >
                          {phone.display}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </li>

              {/* Email */}
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="block rounded-2xl transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-start gap-3.5">

                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-navy/5 text-gold-600">
                      <Mail className="size-5" />
                    </span>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">
                        Email Us
                      </p>

                      <p className="mt-1 text-sm font-medium text-navy">
                        {SITE.email}
                      </p>
                    </div>
                  </div>
                </a>
              </li>

              {/* Hours */}
              <li>
                <div className="flex items-start gap-3.5">

                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-navy/5 text-gold-600">
                    <Clock3 className="size-5" />
                  </span>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">
                      Office Hours
                    </p>

                    <p className="mt-1 text-sm font-medium text-navy">
                      {SITE.hours}
                    </p>
                  </div>
                </div>
              </li>

            </ul>

            {/* Buttons */}
            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </Button>
              </a>

              <a
                href={`tel:${SITE.phones[0].raw}`}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <PhoneCall className="size-4" />
                  Call Us
                </Button>
              </a>

            </div>
          </div>
        </Reveal>

        {/* ───────────────── Map ───────────────── */}
        <Reveal index={1}>
          <div className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-card">

            <iframe
              title="Hand of Grace College locations"
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