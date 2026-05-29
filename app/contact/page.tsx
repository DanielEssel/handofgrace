import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PageHeader } from "@/components/PageHeader";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Hand of Grace Multimedia & I.T College in Awutu Bawjiase, Ghana. Call, email or message us on WhatsApp.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHeader
        current="Contact"
        kicker="Contact"
        title="We're here to help"
        description="Questions about courses, fees or enrollment? Reach out and our team will get back to you."
      />
      <ContactSection />
    </SiteShell>
  );
}
