import type { NavLink } from "@/types";

export const SITE = {
  name: "Hand of Grace Multimedia & I.T College",
  shortName: "Hand of Grace",
  initials: "HOG",
  motto: "A Great Vision Normally Starts With a Small Dream",
  tagline: "Think IT, Think the Future",

  location: [
    { address: "Awutu Bawjiase, Central Region, Ghana", region: "Central" },
    { address: "Adeiso, Eastern Region, Ghana",         region: "Eastern"  },
  ],

  email:    "info@hofgmultimedia.com",
  whatsapp: "+233 024 932 3980",
  hours:    "Mon – Sat · 8:00 AM – 5:00 PM",

  phones: [
    { display: "+233 024 932 3980", raw: "+233024932 3980" },
    { display: "+233 054 193 2243", raw: "+233054193 2243" },
  ],
} as const;

export const APPLICATION_FEE = 100; // GH₵

export const NAV_LINKS: NavLink[] = [
  { label: "Home",               href: "/"            },
  { label: "About",              href: "/about"       },
  { label: "Programs",           href: "/programs"    },
  { label: "Products & Services",href: "/products"    },
  { label: "Contact",            href: "/contact"     },
];

export const REGISTER_ANCHOR = "/registration";