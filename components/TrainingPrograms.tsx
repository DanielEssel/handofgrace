"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/Section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { PROGRAM_CATEGORIES } from "@/data/programs";

export function TrainingPrograms() {
  return (
    <Section id="programs" className="relative bg-white">
      {/* Decorative top accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <SectionHeader
        eyebrow="Training Programs"
        title={
          <>
            Choose your path into{" "}
            <span className="text-gold-sheen">technology</span>
          </>
        }
        description="Industry-relevant courses across three specialised tracks. Every program is hands-on, mentor-led and designed to make you job-ready."
      />

      <div className="mt-16 space-y-14">
        {PROGRAM_CATEGORIES.map((category, ci) => {
          const CatIcon = category.icon;
          return (
            <div key={category.id}>
              {/* Category header */}
              <Reveal>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${category.accent} text-navy ring-1 ring-navy/5`}
                    >
                      <CatIcon className="size-7 text-gold-600" />
                    </span>
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-navy md:text-3xl">
                        {category.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {category.tagline}
                      </p>
                    </div>
                  </div>
                  <Link href="/registration" className="self-start sm:self-auto">
                    <Button variant="outline" size="sm">
                      Enroll in {category.title}
                      <ArrowRight />
                    </Button>
                  </Link>
                </div>
              </Reveal>

              {/* Course cards */}
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.courses.map((course, i) => {
                  const Icon = course.icon;
                  return (
                    <Reveal key={course.name} index={(ci + i) % 4}>
                      <article className="group relative h-full overflow-hidden rounded-3xl border border-navy/8 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-card">
                        {/* Hover glow */}
                        <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-gold/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="relative flex items-start gap-4">
                          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-navy text-gold-300 transition-all duration-300 group-hover:scale-105 group-hover:bg-gold group-hover:text-navy">
                            <Icon className="size-6" />
                          </span>
                          <div>
                            <h4 className="text-lg font-semibold leading-snug text-navy">
                              {course.name}
                            </h4>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                              {course.blurb}
                            </p>
                          </div>
                        </div>
                        <div className="relative mt-5 flex items-center gap-1.5 text-sm font-semibold text-gold-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                          Start learning
                          <ArrowRight className="size-4" />
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
