import { Section, SectionHeader } from "@/components/Section";
import { Reveal } from "@/components/ui/reveal";
import { SERVICES } from "@/data/content";

export function ProductsServices() {
  return (
    <Section id="products" className="bg-slatebg">
      <SectionHeader
        eyebrow="Products & Services"
        title={
          <>
            More than a college —{" "}
            <span className="text-gold-sheen">your tech partner</span>
          </>
        }
        description="From sales to repairs and ongoing support, we keep your devices running and your tech needs covered."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, i) => {
          const Icon = service.icon;
          return (
            <Reveal key={service.title} index={i % 3}>
              <article className="group flex h-full items-start gap-4 rounded-3xl border border-navy/8 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold/12 text-gold-600 transition-all duration-300 group-hover:bg-gold group-hover:text-navy">
                  <Icon className="size-6" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-navy">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
