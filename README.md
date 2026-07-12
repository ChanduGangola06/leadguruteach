# LeadGuruTeach

A modern Ed-Tech and affiliate marketing platform built with **Next.js App Router**, **React**, **Tailwind CSS**, and rich animations. LeadGuruTeach is a redesigned experience inspired by [LeadsGuru](https://www.leadsguru.in/) — focused on skill development, course bundles, and earning through referrals.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)

---

## Overview

LeadGuruTeach helps students and young professionals **learn in-demand skills**, explore premium course bundles, and **earn through affiliate marketing**. The app includes:

- A fully animated **landing page**
- **12 featured course cards** with advanced hover effects
- **6 bundle detail pages** (Bronze → Startup)
- **Authentication** (Login / Signup)
- A **student dashboard** with stats, progress, and earnings chart

---

## Features

### Landing Page
| Section | Description |
|---------|-------------|
| **Navbar** | Glassmorphism sticky header with gradient logo and CTA buttons |
| **Image Banner** | Full-width auto-sliding carousel (3s interval) below the menu |
| **Hero** | Staggered headline reveal + Lottie carousel cycling 6 course types |
| **Course Content** | 12 courses in a 4-column grid with 3D tilt, shine, and zoom hover |
| **Stats** | Animated counters (2 Lakh+ students, 100+ trainers, etc.) |
| **Process** | Educate · Innovate · Dominate with Lottie animations |
| **Packages** | 6 glassmorphic pricing cards with 3D tilt effect |
| **Instructors** | Infinite horizontal marquee of expert mentors |
| **Testimonials** | Grid on desktop, swipeable slider on mobile |
| **Footer** | Newsletter signup, quick links, and course package links |

### Bundle Detail Pages (`/bundle/[slug]`)
Each of the 6 packages has a dedicated page with:
- Hero with tagline and stats
- Course overview and specialization
- Journey / benefits section
- Full course list and expandable content accordion
- Certificate steps
- Sticky pricing card with **Buy Now**
- FAQ accordion
- Student testimonials
- Mobile sticky buy bar

**Available bundles:**
- `/bundle/bronze-bundle`
- `/bundle/silver-package`
- `/bundle/gold-package`
- `/bundle/platinum-package`
- `/bundle/diamond-package`
- `/bundle/startup-package`

### Authentication (`/auth`)
- Split-screen layout with Spline 3D / visual panel
- Smooth Login ↔ Signup toggle via Framer Motion
- Floating labels with neon focus glow
- Submit button with loading spinner

### Dashboard (`/dashboard`)
- Collapsible sidebar (desktop) and slide-in menu (mobile)
- Top nav with notifications and avatar dropdown
- Animated stat widgets with counting numbers
- Course progress bars (animated fill)
- Affiliate earnings chart (SVG path animation)
- Sub-routes: Courses, Affiliate, Earnings, Settings

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom glassmorphism utilities |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Vector animations | [Lottie React](https://lottiefiles.com) |
| 3D (Auth) | [@splinetool/react-spline](https://spline.design) |
| Icons | [Lucide React](https://lucide.dev) |
| Fonts | Outfit (headings), Inter (body) via `next/font` |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd leadguruteach

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

---

## Project Structure

```
leadguruteach/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout (fonts, metadata)
│   ├── globals.css              # Theme, glassmorphism, animations
│   ├── (auth)/auth/page.tsx     # Login / Signup
│   ├── bundle/[slug]/page.tsx   # Dynamic bundle detail pages
│   └── dashboard/               # Dashboard layout + pages
│
├── components/
│   ├── Navbar.tsx
│   ├── Header.tsx               # Fixed navbar wrapper
│   ├── Footer.tsx
│   ├── ImageBanner.tsx          # Full-width image carousel
│   ├── sections/                # Hero, Stats, Process, Courses, etc.
│   ├── bundle/                  # Bundle detail UI components
│   ├── dashboard/               # Sidebar, TopNav
│   └── ui/                      # SplineScene, AnimatedCounter
│
├── lib/
│   ├── data.ts                  # Stats, packages, instructors, testimonials
│   ├── bundles.ts               # Full bundle detail content + FAQs
│   ├── featuredCourses.ts       # 12 featured course cards
│   └── types.ts                 # TypeScript interfaces
│
├── tailwind.config.ts           # Custom colors, animations, shadows
└── next.config.ts               # Image domains, Spline transpile
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/auth` | Login & Signup |
| `/bundle/bronze-bundle` | Bronze Bundle details |
| `/bundle/silver-package` | Silver Package details |
| `/bundle/gold-package` | Gold Package details |
| `/bundle/platinum-package` | Platinum Package details |
| `/bundle/diamond-package` | Diamond Package details |
| `/bundle/startup-package` | Startup Package details |
| `/dashboard` | Student dashboard overview |
| `/dashboard/courses` | My Courses |
| `/dashboard/affiliate` | Affiliate panel |
| `/dashboard/earnings` | Earnings history |
| `/dashboard/settings` | Account settings |

---

## Design System

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Navy | `#0B1120` | Background |
| Purple Vibrant | `#7C3AED` | Accents, gradients |
| Cyan Neon | `#06B6D4` | Highlights, CTAs |

### UI Patterns
- **Glassmorphism** — `.glass`, `.glass-strong` with backdrop blur
- **Gradient text** — `.gradient-text` for headings
- **Glow effects** — `.shadow-glow`, `.shadow-glow-cyan`
- **Background mesh** — `.bg-mesh` radial gradients

### Typography
- **Outfit** — Headings (`font-heading`)
- **Inter** — Body text

---

## Customization

### Add or edit course bundles
Edit `lib/bundles.ts` for full bundle content (overview, courses, FAQs).

### Update featured courses (12-card grid)
Edit `lib/featuredCourses.ts` — change titles, images, categories, and links.

### Change banner slides
Edit the `slides` array in `components/ImageBanner.tsx`.

### Hero Lottie courses
Edit `courseAnimations` in `components/sections/HeroLottie.tsx`.

### Package cards on landing page
Edit `coursePackages` in `lib/data.ts`.

---

## Image & External Assets

Remote images are loaded from **Unsplash** (`images.unsplash.com`). Configure additional domains in `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
  ],
},
```

Lottie animations are fetched from `assets1.lottiefiles.com` at runtime.

---

## Deployment

### Vercel (recommended)

```bash
npm run build
# Deploy via Vercel CLI or connect your Git repository at vercel.com
```

### Self-hosted

```bash
npm run build
npm run start
```

Ensure Node.js 18+ is available on the host.

---

## Browser Support

Modern browsers with ES202+ support (Chrome, Firefox, Safari, Edge). Animations degrade gracefully on older devices.

---

## License

Private project — all rights reserved.

---

## Acknowledgments

- Inspired by [LeadsGuru](https://www.leadsguru.in/)
- Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [Framer Motion](https://www.framer.com/motion/)
