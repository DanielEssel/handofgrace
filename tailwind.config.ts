import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],

  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        "2xl": "1360px",
      },
    },

    extend: {
      /* ─────────────────────────────
       * COLORS
       * ───────────────────────────── */
      colors: {
        navy: {
          DEFAULT: "#0B1F3A",
          50: "#F5F8FC",
          100: "#E7EEF8",
          200: "#CBD8EC",
          300: "#A5B9DA",
          400: "#7893BE",
          500: "#56709A",
          600: "#3D5478",
          700: "#2A3B57",
          800: "#17263A",
          900: "#0B1F3A",
          950: "#050D18",
        },

        gold: {
          DEFAULT: "#D4AF37",
          50: "#FFFBEF",
          100: "#FCF2CC",
          200: "#F5DF8B",
          300: "#E8C95C",
          400: "#D4AF37",
          500: "#BC962B",
          600: "#9A7722",
          700: "#765B1D",
          800: "#5F491C",
          900: "#4D3B1B",
        },

        slatebg: "#F8FAFC",
        ink: "#172033",

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

      /* ─────────────────────────────
       * TYPOGRAPHY
       * ───────────────────────────── */
      fontFamily: {
        heading: [
          "var(--font-heading)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],

        body: [
          "var(--font-body)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],

        sans: [
          "var(--font-body)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },

      letterSpacing: {
        tighter: "-0.045em",
        premium: "-0.035em",
      },

      lineHeight: {
        hero: "0.95",
      },

      /* ─────────────────────────────
       * RADII
       * ───────────────────────────── */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",

        xl: "1rem",
        "2xl": "1.35rem",
        "3xl": "1.85rem",
        "4xl": "2.4rem",
      },

      /* ─────────────────────────────
       * SHADOWS
       * ───────────────────────────── */
      boxShadow: {
        soft:
          "0 2px 10px rgba(15,23,42,0.04), 0 10px 30px rgba(15,23,42,0.06)",

        card:
          "0 1px 2px rgba(15,23,42,0.04), 0 18px 40px -18px rgba(15,23,42,0.16)",

        premium:
          "0 10px 40px -10px rgba(11,31,58,0.22), 0 20px 80px -20px rgba(11,31,58,0.20)",

        gold:
          "0 12px 40px -10px rgba(212,175,55,0.45)",

        glow:
          "0 0 0 1px rgba(212,175,55,0.20), 0 0 32px rgba(212,175,55,0.18)",

        navy:
          "0 24px 80px -24px rgba(11,31,58,0.55)",
      },

      /* ─────────────────────────────
       * BACKGROUNDS
       * ───────────────────────────── */
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(135deg, #F3D77A 0%, #D4AF37 45%, #B8932A 100%)",

        "navy-deep":
          "radial-gradient(circle at top left, #17345C 0%, #0B1F3A 45%, #050D18 100%)",

        mesh:
          "radial-gradient(circle at 15% 20%, rgba(212,175,55,0.14) 0%, transparent 32%), radial-gradient(circle at 85% 10%, rgba(94,122,166,0.18) 0%, transparent 30%), radial-gradient(circle at 80% 90%, rgba(212,175,55,0.10) 0%, transparent 34%)",

        grid:
          "linear-gradient(to right, rgba(11,31,58,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,31,58,0.04) 1px, transparent 1px)",

        spotlight:
          "radial-gradient(circle at center, rgba(255,255,255,0.7) 0%, transparent 70%)",
      },

      backgroundSize: {
        grid: "36px 36px",
      },

      /* ─────────────────────────────
       * ANIMATIONS
       * ───────────────────────────── */
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(16px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        float: {
          "0%,100%": {
            transform: "translateY(0px)",
          },

          "50%": {
            transform: "translateY(-12px)",
          },
        },

        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },

        "spin-slow": {
          to: {
            transform: "rotate(360deg)",
          },
        },

        pulseGlow: {
          "0%,100%": {
            opacity: "0.65",
          },

          "50%": {
            opacity: "1",
          },
        },
      },

      animation: {
        "fade-up":
          "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",

        float:
          "float 7s ease-in-out infinite",

        shimmer:
          "shimmer 2.2s linear infinite",

        "spin-slow":
          "spin-slow 22s linear infinite",

        glow:
          "pulseGlow 3.5s ease-in-out infinite",
      },

      /* ─────────────────────────────
       * BLUR
       * ───────────────────────────── */
      backdropBlur: {
        xs: "2px",
      },

      /* ─────────────────────────────
       * TRANSITIONS
       * ───────────────────────────── */
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};

export default config;