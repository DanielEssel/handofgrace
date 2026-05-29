import type { NavLink } from "@/types";

export const SITE = {
  name: "Hand of Grace Multimedia & I.T College",
  shortName: "Hand of Grace",
  initials: "HG",
  motto: "A Great Vision Normally Starts With a Small Dream",
  tagline: "Think IT, Think the Future",
  location: "Awutu Bawjiase, Central Region, Ghana",
  email: "info@handofgracecollege.com",
  phone: "+233 20 000 0000",
  phoneRaw: "+233200000000",
  whatsapp: "233200000000",
  hours: "Mon – Sat · 8:00 AM – 5:00 PM",
} as const;

export const APPLICATION_FEE = 100; // GH₵ 100

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Training Programs", href: "/programs" },
  { label: "Products & Services", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export const REGISTER_ANCHOR = "/registration";
