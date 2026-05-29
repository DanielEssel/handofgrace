import { Sora, Inter } from "next/font/google";

/**
 * Premium font pairing for Hand of Grace Multimedia & I.T College.
 *
 * - Sora  -> headings (modern, premium educational-tech presence)
 * - Inter -> body (clean, highly readable)
 *
 * Both are exposed as CSS variables so Tailwind can reference them via
 * `font-heading` and `font-body` (configured in tailwind.config.ts).
 */
export const fontHeading = Sora({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
});

export const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

/** Combined class string to apply on <html>. */
export const fontVariables = `${fontHeading.variable} ${fontBody.variable}`;
