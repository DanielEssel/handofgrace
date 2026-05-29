import { Section, SectionHeader } from "@/components/Section";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT_FEATURES, STATS } from "@/data/content";

export function About() {
  return (
    <Section id="about" className="bg-slatebg">
      <SectionHeader
        eyebrow="About Us"
        title={
          <>
            Empowering the next generation of{" "}
            <span className="text-gold-sheen">digital talent</span>
          </>
        }
        description="Hand of Grace Multimedia & I.T College is a community-focused institution committed to practical ICT education, skills empowerment and real career readiness."
      />

      {/* Feature grid */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT_FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <Reveal key={feature.title} index={i}>
              <article className="group h-full rounded-3xl border border-navy/8 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <span className="grid size-12 place-items-center rounded-2xl bg-navy text-gold-300 transition-colors group-hover:bg-gold group-hover:text-navy">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-navy">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Stats strip */}
      <Reveal index={1}>
        <div className="mt-12 overflow-hidden rounded-3xl border border-navy/10 bg-navy-deep p-2">
          <div className="grid divide-y divide-white/10 rounded-2xl sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 px-6 py-7"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/5 text-gold-300">
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <p className="font-heading text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-white/60">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
