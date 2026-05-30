import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const clash = localFont({
  src: "../public/fonts/ClashDisplay-Variable.ttf",
  variable: "--font-heading",
});