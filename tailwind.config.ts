import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1F3A",
          50: "#F2F5FA",
          100: "#E1E8F2",
          200: "#C2D0E4",
          300: "#94A9C9",
          400: "#5E7AA6",
          500: "#3C567F",
          600: "#2A3F61",
          700: "#1C2C46",
          800: "#0F1E36",
          900: "#0B1F3A",
          950: "#06122299",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FBF7EA",
          100: "#F6ECC9",
          200: "#EDD891",
          300: "#E3C25A",
          400: "#D4AF37",
          500: "#B8932A",
          600: "#947222",
          700: "#70561F",
          800: "#5C461F",
          900: "#4E3C1E",
        },
        slatebg: "#F8FAFC",
        ink: "#1E293B",
        // shadcn-style semantic tokens (driven by CSS variables)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(11,31,58,0.08), 0 8px 24px -8px rgba(11,31,58,0.10)",
        card: "0 1px 2px rgba(11,31,58,0.04), 0 12px 32px -12px rgba(11,31,58,0.14)",
        gold: "0 8px 30px -8px rgba(212,175,55,0.45)",
        navy: "0 18px 50px -18px rgba(11,31,58,0.55)",
        glow: "0 0 0 1px rgba(212,175,55,0.30), 0 0 28px -6px rgba(212,175,55,0.45)",
      },
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(135deg, #E3C25A 0%, #D4AF37 45%, #B8932A 100%)",
        "navy-deep":
          "radial-gradient(120% 120% at 0% 0%, #122a4d 0%, #0B1F3A 55%, #06121f 100%)",
        "mesh":
          "radial-gradient(45% 45% at 15% 20%, rgba(212,175,55,0.18) 0%, transparent 60%), radial-gradient(40% 40% at 85% 10%, rgba(94,122,166,0.22) 0%, transparent 55%), radial-gradient(50% 50% at 80% 90%, rgba(212,175,55,0.10) 0%, transparent 60%)",
        "grid":
          "linear-gradient(to right, rgba(11,31,58,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,31,58,0.05) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 7s ease-in-out infinite",
        "spin-slow": "spin-slow 22s linear infinite",
        shimmer: "shimmer 2.2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
