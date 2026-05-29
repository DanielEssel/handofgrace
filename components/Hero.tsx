"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Laptop,
  ShieldCheck,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const heroPills = [
  { icon: GraduationCap, label: "Practical Skills" },
  { icon: Laptop, label: "Hands-on Training" },
  { icon: ShieldCheck, label: "Certified Courses" },
  { icon: BriefcaseBusiness, label: "Career Ready" },
];

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-navy-deep pt-32 pb-24 text-white sm:pt-36 sm:pb-32"
    >
      {/* Layered backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute inset-0 bg-grid [background-size:42px_42px] opacity-[0.06]" />
      {/* Animated accent shapes */}
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-gold/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute right-[-6rem] bottom-0 size-80 rounded-full bg-navy-400/30 blur-3xl animate-float [animation-delay:1.5s]" />

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left — copy */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-200 backdrop-blur"
            >
              <Sparkles className="size-3.5" />
              {SITE.tagline}
            </motion.span>

            <motion.h1
              variants={item}
              className="mt-6 text-balance text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl"
            >
              Future-Ready{" "}
              <span className="text-gold-sheen">ICT Education</span> in
              Awutu&nbsp;Bawjiase
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/70 md:text-lg"
            >
              Build in-demand technology skills with hands-on training in
              software, hardware and church media. Learn from mentors, earn
              recognised certificates, and step confidently into your career.
            </motion.p>

            {/* Motto */}
            <motion.p
              variants={item}
              className="mt-6 border-l-2 border-gold/60 pl-4 font-heading text-sm italic text-gold-100/90 md:text-base"
            >
              &ldquo;{SITE.motto}&rdquo;
            </motion.p>

            <motion.div
              variants={item}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link href="/registration">
                <Button variant="primary" size="lg" className="shimmer-overlay">
                  Register for Training
                  <ArrowRight />
                </Button>
              </Link>
              <Link href="/programs">
                <Button variant="outline-light" size="lg">
                  Explore Programs
                </Button>
              </Link>
            </motion.div>

            {/* Pills */}
            <motion.ul
              variants={item}
              className="mt-10 flex flex-wrap gap-2.5"
            >
              {heroPills.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/80 backdrop-blur"
                >
                  <Icon className="size-3.5 text-gold-300" />
                  {label}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right — education card mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative mx-auto w-full max-w-md"
          >
            {/* Floating badge — top */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-8 z-20 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white p-3 shadow-card"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-gold/15 text-gold-600">
                <GraduationCap className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-navy">11+ Courses</p>
                <p className="text-[11px] text-navy/50">Across 3 tracks</p>
              </div>
            </motion.div>

            {/* Floating badge — bottom */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -right-3 bottom-10 z-20 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white p-3 shadow-card"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-navy text-gold-300">
                <ShieldCheck className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-navy">Certified</p>
                <p className="text-[11px] text-navy/50">CompTIA A+ / N+</p>
              </div>
            </motion.div>

            {/* Main card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-6 shadow-navy backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gold-sheen" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">
                    Student Card
                  </p>
                  <p className="mt-1 font-heading text-lg font-bold text-navy">
                    Enrollment 2025
                  </p>
                </div>
                <span className="grid size-11 place-items-center rounded-2xl bg-navy text-gold-300">
                  <Laptop className="size-5" />
                </span>
              </div>

              {/* Progress card */}
              <div className="mt-6 rounded-2xl bg-slatebg p-4">
                <div className="flex items-center justify-between text-xs font-medium text-navy/60">
                  <span>Course Progress</span>
                  <span className="text-gold-600">78%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-gold-sheen"
                  />
                </div>
              </div>

              {/* Mini feature rows */}
              <ul className="mt-5 space-y-2.5">
                {[
                  { label: "Graphic Design", value: "Active" },
                  { label: "Networking (N+)", value: "Enrolled" },
                  { label: "Live Audio & Streaming", value: "New" },
                ].map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between rounded-xl border border-navy/5 bg-white px-3.5 py-2.5"
                  >
                    <span className="text-sm font-medium text-navy">
                      {row.label}
                    </span>
                    <span className="rounded-full bg-gold/12 px-2.5 py-0.5 text-[11px] font-semibold text-gold-700">
                      {row.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave separator */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <svg
          viewBox="0 0 1440 80"
          className="h-12 w-full fill-slatebg sm:h-16"
          preserveAspectRatio="none"
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
