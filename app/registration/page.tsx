import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { RegistrationHub } from "@/components/RegistrationHub";

export const metadata: Metadata = {
  title: "Registration",
  description:
    "Apply to Hand of Grace Multimedia & I.T College. Complete the online application and pay your application fee securely via Paystack.",
};

export default function RegistrationPage() {
  return (
    <SiteShell>
      {/* Spacer so the navy hub clears the fixed navbar */}
      <div className="pt-20" />
      <RegistrationHub />
    </SiteShell>
  );
}
