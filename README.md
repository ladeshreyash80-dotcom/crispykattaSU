# Crispy Katta 🌶️

A premium mobile-first food ordering web app for a college food stall — late-night canteen vibes meets Mumbai street-poster aesthetics. Built with **Vite + React 19 + TypeScript + Tailwind CSS v4 + React Router + Zod**. 100% static front-end: no backend, no env vars, no secrets.

---

## Deploy in 3 steps

### 1. Import the repo
Push this folder to GitHub (or drop the zip) and import it into **Vercel** *or* **Netlify**:
- **Vercel:** `https://vercel.com/new` → Import Git Repository → select `crispy-katta`
- **Netlify:** `https://app.netlify.com/drop` (drag the folder) or Sites → Import site

### 2. Set the build command
```bash
npm ci && npm run build
```
(Order: `npm ci` installs exact locked deps from `package-lock.json`, then `npm run build` type-checks and bundles.)

### 3. Set the output directory
```
dist
```
That's it — no environment variables, no secrets. `vercel.json` already ships an SPA rewrite (`/(.*)` → `/index.html`) so deep links like `/menu` and `/track/:orderId` work on Vercel; Netlify serves `dist` with its default SPA handling.

---

## Local dev

```bash
npm ci
npm run dev      # http://localhost:5173
npm run build    # type-check + static bundle → dist/
npm run preview  # serve the production build
```

## What's inside

| Area | Details |
|---|---|
| `src/lib/data.ts` | Single typed data module — menu, categories, store info, hostel wars, admin config |
| `src/lib/schema.ts` | Zod schemas for checkout, profile, referral, admin auth & status transitions |
| `src/lib/store.tsx` | Anonymous profile, cart, orders (idempotent checkout w/ UUIDs), rewards — persisted to `localStorage` |
| `src/lib/money.ts` | All money in **integer paise**, formatted as INR |
| `public/stall/` | Real stall photography (front, counter, aerial) + food shots, each with an illustrated SVG fallback tile |

## Feature map

- **Home** — hero with steam animation, live open/closed pill, popular carousel, category chips, "Our Katta" gallery with tap-to-zoom lightbox, Hostel Wars teaser
- **Menu** — sticky category tabs, veg/non-veg toggle, add buttons that morph into steppers
- **Item sheet** — sizes, add-ins, qty stepper, live total
- **Cart** — subtotals, delivery fee (free over ₹199), rewards credit
- **Checkout** — guest, minimal fields, delivery/pickup toggle, inline Zod validation, idempotent placement (UUID attempt ids)
- **Confirmation** — paper ticket receipt + WhatsApp order button
- **Tracking** — live status timeline driven by the store admin demo
- **Katta Card** — anonymous loyalty stamps, referral bonuses, no login/OTP
- **Hostel Wars** — inter-hostel leaderboard
- **Store info** — hours, map, real photos, gallery lightbox
- **Admin** — password-gated demo kitchen (`katta2026`), alerts, valid-only status transitions
- **Kiosk** — attract screen for the stall tablet
- **PWA** — manifest, theme color, service worker (production only)
