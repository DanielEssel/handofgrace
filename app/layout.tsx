import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { SITE } from "@/data/site";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://handofgracecollege.com"),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.shortName}`,
  },
  description:
    "Practical, future-ready ICT training in Awutu Bawjiase, Ghana. Software, hardware & church media courses, computer sales, repairs and tech support. Register today.",
  keywords: [
    "ICT training Ghana",
    "computer training Awutu Bawjiase",
    "graphic design course",
    "CompTIA A+ Ghana",
    "networking course",
    "church media training",
    "Hand of Grace College",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_GH",
    title: `${SITE.name} | ${SITE.tagline}`,
    description:
      "Future-ready ICT education in Awutu Bawjiase, Ghana. Register for hands-on training in software, hardware and church media.",
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: "Future-ready ICT education in Awutu Bawjiase, Ghana.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
