# Hand of Grace Multimedia & I.T College

A premium, conversion-focused informational website built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **React Hook Form + Zod**, and **Paystack**.

Awutu Bawjiase, Ghana · _“A Great Vision Normally Starts With a Small Dream.”_

---

## ✨ Features

- Sticky, blur-backdrop navbar with mobile drawer & smooth-scroll
- Striking animated hero with education-card mockup
- About / Mission / Vision + animated stats strip
- **Priority** Training Programs section (Software · Hardware · Church Media)
- Products & Services grid (sales, repairs, accessories, support)
- **Multi-step registration form** (6 steps) with per-step validation
- **Paystack** inline payment (GH₵100 application fee) gating submission
- Premium typography (Sora + Inter), gold/navy design system, reduced-motion support

---

## 🚀 Getting Started

> ⚠️ `react-paystack@6` lists React 18 as its peer dependency but works fine with
> React 19. Install with `--legacy-peer-deps` (or downgrade React to 18 if you prefer).

```bash
# 1. Install
npm install --legacy-peer-deps

# 2. Configure environment
cp .env.example .env.local
#   → add your Paystack public key:
#     NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxx

# 3. Run
npm run dev      # http://localhost:3000
```

### Paystack

1. Create an account at https://paystack.com and grab your **Public Key**
   (test key starts with `pk_test_`).
2. Put it in `.env.local` as `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`.
3. **Production note:** always verify the transaction `reference` server-side
   via the Paystack `/transaction/verify/:reference` API before granting access.
   `components/PaystackButton.tsx` marks the place to do this.

---

## 🗂 Project Structure

```
app/
  layout.tsx          # fonts + SEO metadata
  page.tsx            # landing page (section assembly)
  globals.css         # design tokens + base styles
components/
  Navbar.tsx          Hero.tsx          About.tsx
  TrainingPrograms.tsx ProductsServices.tsx
  RegistrationHub.tsx  RegistrationForm.tsx  PaystackButton.tsx
  Footer.tsx  Logo.tsx  Section.tsx
  ui/                 # Button, form fields, reveal animation
data/
  site.ts             # brand, nav, contact, fee
  programs.ts         # course catalog (grouped + flat)
  content.ts          # services, stats, about, form steps
lib/
  fonts.ts            # Sora + Inter via next/font
  utils.ts            # cn(), scrollToSection(), formatCedis()
  validation.ts       # Zod schemas (per-step + full)
types/
  index.ts            # all TypeScript interfaces & unions
```

---

## 🎨 Customizing

- **Brand colors / shadows / fonts:** `tailwind.config.ts` + `app/globals.css`
- **Contact details, fee, motto:** `data/site.ts`
- **Courses & categories:** `data/programs.ts`
- **Services / stats / form steps:** `data/content.ts`

Replace the placeholder phone/email/WhatsApp values in `data/site.ts` with the
college's real details before going live.

---

## 🔌 Backend (Paystack + Firebase)

This project includes a real backend: **server-side Paystack verification**,
**Firestore** application storage, **Firebase Storage** uploads, and
**Firebase Auth** so applicants can track their status at `/dashboard`.

See **[`SETUP_BACKEND.md`](./SETUP_BACKEND.md)** for full setup. In short:

1. `cp .env.example .env.local` and fill in the Paystack + Firebase values.
2. Enable Email/Password auth, Firestore, and Storage in the Firebase console.
3. `firebase deploy --only firestore:rules,storage:rules` to publish the rules.

Without these env vars the site still runs — auth/dashboard hide themselves and
the submission API returns a clear "not configured" response.

---

## 📦 Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `npm run dev`    | Start dev server         |
| `npm run build`  | Production build         |
| `npm run start`  | Run the production build |
| `npm run lint`   | Lint                     |

Built with care — _Think IT, Think the Future._
