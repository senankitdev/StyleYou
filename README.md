# StyleYou — AI Virtual Try-On (Frontend)

> **See it on you before you buy.**

StyleYou is a mobile-first web app that lets users create a 2D avatar from a face photo and body measurements, paste a dress link from any online store, and see how the dress looks on them with an estimated fit.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values when the backend is ready:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** (with custom design tokens)
- **Framer Motion** (animations)
- **React Hook Form + Zod** (form validation)
- **Lucide React** (icons)

## Folder Structure

```
app/                          Route pages
├── page.tsx                  Landing (/)
├── auth/page.tsx             Login / Sign Up (/auth)
├── profile/page.tsx          Photo & Measurements (/profile)
├── avatar/page.tsx           Avatar display (/avatar)
├── try-on/page.tsx           Dress selection (/try-on)
├── processing/page.tsx       Animated processing (/processing)
├── result/[id]/page.tsx      Try-on result (/result/[id])
└── saved/page.tsx            Saved looks grid (/saved)

components/
├── ui/                       Reusable UI primitives
│   ├── Button, Input, Card, Modal, Toast
│   ├── FileUpload, Stepper, LoadingSteps
│   ├── EmptyState, Skeleton
├── layout/                   Layout components
│   ├── Navbar, BottomTabBar, Footer, PageContainer
└── Providers.tsx             Context providers wrapper

lib/
├── api/                      Mock service layer
│   ├── avatar.service.ts
│   ├── dress.service.ts
│   ├── tryon.service.ts
│   └── looks.service.ts
├── types.ts                  TypeScript interfaces
├── validators.ts             Zod validation schemas
├── constants.ts              App constants & sample data
└── utils.ts                  Helper utilities

context/                      React Contexts
├── AuthContext.tsx
├── AvatarContext.tsx
├── TryOnContext.tsx
└── ToastContext.tsx

hooks/
└── useRouteGuard.ts          Mock route protection
```

## Mock Service Layer

All service functions return mock data after a simulated delay. Each is marked with `// TODO: replace with real API call`.

| Function | File | Future Endpoint | Notes |
|---|---|---|---|
| `createAvatar(profile, photo)` | `avatar.service.ts` | `POST /api/avatar` | 2s delay, returns placeholder URLs |
| `deleteMyData()` | `avatar.service.ts` | `DELETE /api/user/data` | 1s delay, clears local state |
| `importDress(url)` | `dress.service.ts` | `POST /api/dress/import` | 1.5s delay, 20% simulated failure rate |
| `uploadDress(file)` | `dress.service.ts` | `POST /api/dress/upload` | 1s delay |
| `generateTryOn(avatarId, dressUrl)` | `tryon.service.ts` | `POST /api/tryon` | 0.5s delay, random size + fit notes |
| `saveLook(result)` | `looks.service.ts` | `POST /api/looks` | 0.5s delay, persists to localStorage |
| `getSavedLooks()` | `looks.service.ts` | `GET /api/looks` | 0.5s delay, reads from localStorage |
| `deleteSavedLook(id)` | `looks.service.ts` | `DELETE /api/looks/:id` | 0.3s delay |

## Mock Flow

The complete mock flow works end-to-end:

1. **Landing** → Click "Create Your Avatar"
2. **Auth** → Sign up with any email/password
3. **Profile** → Upload a photo, fill measurements, accept consent
4. **Avatar** → View your avatar, click "Try a Dress"
5. **Try-On** → Select a sample dress or paste a link
6. **Processing** → Watch animated steps
7. **Result** → See estimated fit, save the look
8. **Saved** → View all saved looks

## Design System

- **Palette:** Warm cream/tan/brown fashion-forward theme
- **Fonts:** Playfair Display (headings) + Inter (body)
- **Mobile-first:** Designed for 375px, responsive to desktop
- **Navigation:** Bottom tab bar (mobile), top navbar (desktop)
