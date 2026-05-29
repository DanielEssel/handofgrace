import { SiteShell } from "@/components/SiteShell";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TrainingPrograms } from "@/components/TrainingPrograms";
import { ProductsServices } from "@/components/ProductsServices";
import { HomeRegisterCta } from "@/components/HomeRegisterCta";

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <About />
      <TrainingPrograms />
      <ProductsServices />
      <HomeRegisterCta />
    </SiteShell>
  );
}
