import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/** Wraps page content with the global navbar and footer. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
