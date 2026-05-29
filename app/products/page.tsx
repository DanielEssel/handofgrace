import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PageHeader } from "@/components/PageHeader";
import { ProductsServices } from "@/components/ProductsServices";

export const metadata: Metadata = {
  title: "Products & Services",
  description:
    "Computer sales, repairs and ongoing tech support from Hand of Grace Multimedia & I.T College in Awutu Bawjiase, Ghana.",
};

export default function ProductsPage() {
  return (
    <SiteShell>
      <PageHeader
        current="Products & Services"
        kicker="Products & Services"
        title="More than a college — your tech partner"
        description="From sales to repairs and ongoing support, we keep your devices running and your tech needs covered."
      />
      <ProductsServices />
    </SiteShell>
  );
}
