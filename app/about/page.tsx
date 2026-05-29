import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PageHeader } from "@/components/PageHeader";
import { About } from "@/components/About";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Hand of Grace Multimedia & I.T College — a community-focused institution delivering practical ICT education and skills empowerment in Awutu Bawjiase, Ghana.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHeader
        current="About"
        kicker="About Us"
        title="Empowering the next generation of digital talent"
        description="A community-focused institution committed to practical ICT education, skills empowerment and real career readiness."
      />
      <About />
    </SiteShell>
  );
}
