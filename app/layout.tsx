import type { Metadata, Viewport } from "next";
import "./globals.css";

import { inter, clash } from "./fonts";
import { SITE } from "@/data/site";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://handofgracecollege.com"),

  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.shortName}`,
  },

  description:
    "Practical, future-ready ICT training in Ghana. Software, hardware, multimedia and church media courses, computer sales, repairs and tech support.",

  keywords: [
    "ICT training Ghana",
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
      "Future-ready ICT education in Ghana with practical hands-on training.",
    siteName: SITE.name,
  },

  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description:
      "Future-ready ICT education in Ghana.",
  },

  robots: {
    index: true,
    follow: true,
  },
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
    <html
      lang="en"
      className={`${inter.variable} ${clash.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body bg-slatebg text-ink antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}