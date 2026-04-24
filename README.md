# Skin Essential Plus

A luxury, futuristic beauty website built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Offers skin treatments, spa therapy, eyelash sketching, and full skincare solutions — rendered through a glassmorphism-driven, cinematic design system.

---

## ✨ Features

- **Glassmorphism hero carousel** — full viewport, 4 slides, Embla + Autoplay, keyboard + touch accessible, cinematic Ken Burns effect
- **Dynamic navbar** — transparent over hero, blurred solid on scroll (>80px), full mobile drawer
- **Interactive services cards** — gradient border hover, image zoom, icon micro-rotation
- **Why Choose Us** — sticky heading + staggered trust point cards
- **About snippet** — split layout with floating image + live-counter stats
- **Before/After slider** — pointer-draggable comparison with Framer Motion
- **Testimonials carousel** — glassmorphism cards with scale-focus centering
- **Booking CTA** — bold deep-teal banner with floating glow orbs
- **Instagram grid** — 2/3/4-column responsive with hover overlay
- **Contact** — OpenStreetMap iframe + glass contact card
- **Newsletter** — glow focus state, submission feedback
- **Footer** — 4-column layout with socials
- **Accessibility** — keyboard nav, ARIA labels, reduced-motion support
- **Performance** — `next/image` with AVIF/WebP, lazy loading, priority hints, font subsetting

---

## 🎨 Design System

### Colors

| Token   | Hex       | Usage                        |
| ------- | --------- | ---------------------------- |
| `ivory` | `#FCFBFC` | Primary background           |
| `mauve` | `#8A6F88` | Accent, borders, glow        |
| `sage`  | `#4F7288` | Secondary accent             |
| `deep`  | `#47676A` | Primary text, buttons, dark  |

### Typography

- **Display** — Cormorant Garamond (luxury serif headlines)
- **Serif** — Playfair Display (alternate serif)
- **Sans** — Manrope (body, UI)

### Motion

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (cinematic)
- Standard durations: 500ms (UI), 700–900ms (reveal), 6–7s (Ken Burns)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ or 20+
- npm / pnpm / yarn

### Install

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm run start
```

### Type-check

```bash
npm run type-check
```

---

## 📁 Project Structure

```
skin-essential-plus/
├── app/
│   ├── globals.css          # Tailwind + brand utilities
│   ├── layout.tsx           # Root layout with fonts + metadata
│   └── page.tsx             # Homepage composition
├── components/
│   ├── hero/
│   │   └── HeroCarousel.tsx
│   ├── navbar/
│   │   └── Navbar.tsx
│   ├── sections/
│   │   ├── About.tsx
│   │   ├── BeforeAfter.tsx
│   │   ├── BookingCTA.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Instagram.tsx
│   │   ├── Newsletter.tsx
│   │   ├── Services.tsx
│   │   ├── Testimonials.tsx
│   │   └── WhyChooseUs.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── GlassCard.tsx
│       ├── Logo.tsx
│       └── SectionHeading.tsx
├── lib/
│   ├── constants.ts         # Site content, nav, data
│   └── utils.ts             # cn() helper
├── types/
│   └── index.ts             # Shared TypeScript types
├── public/
│   └── images/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🧩 Customization

- **Content** → edit `lib/constants.ts`
- **Colors** → edit `tailwind.config.ts` + `app/globals.css`
- **Fonts** → edit `app/layout.tsx`
- **Images** — Unsplash URLs used as placeholders; swap with your own and add domains to `next.config.ts` `images.remotePatterns`

---

## 📝 Notes

- All components are strictly typed — no `any`.
- Every client component uses the `"use client"` directive.
- `next/image` is used everywhere for automatic optimization.
- The Before/After slider uses pointer events for universal input support.
- `prefers-reduced-motion` is respected globally in `globals.css`.

---

Crafted with intention. ✦
