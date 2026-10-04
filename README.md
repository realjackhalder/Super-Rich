# SuperRich — Tech Billionaires Encyclopedia & Live Wealth Index

SuperRich is a real-time wealth index and sourced encyclopedia tracking the world's top 50 tech titans from childhood to the present day.

## ✨ Core Features

- **🌐 Live Wealth Index**: Real-time calculated net worth tracking 50 tech billionaires across 12 countries.
- **📍 Verified Municipal Residences**: Sourced reporting of current Country & City residence (strictly municipal level to respect safety and privacy).
- **🍏 Apple Liquid Glass UI**: Clean, floating glass navigation capsule with neutral light/dark themes (no AI rainbow gradients).
- **📜 Childhood to Present Timeline**: Verified historical milestones backed by SEC EDGAR, Wikipedia, and prediction market consensus (Polymarket / Kalshi).
- **⚖️ Legal Cases & Regulatory Actions**: Neutral factual tracking of major federal civil, criminal, and regulatory proceedings.
- **✉️ Public & Court-Released Emails**:
  - *Section A*: Verified corporate, media, and investor relations contact emails.
  - *Section B*: Public trial exhibit email archives filed in open court.
- **🔌 Free Public API**: High-performance REST endpoints (`/api/v1/rankings`, `/api/v1/people/[slug]`) free for external developers.
- **🔒 Admin Control Center**: Simple Username & Password session authentication for managing the review queue and data pipelines.

## 🛠️ Stack & Infrastructure ($0 Budget)

- **Framework**: [Next.js](https://nextjs.org/) 14 (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Apple Liquid Glass neutral design tokens
- **Database**: [PostgreSQL (Neon Serverless)](https://neon.tech/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Theme**: `next-themes` (instant system/light/dark toggle)
- **Authentication**: Zero third-party dependencies, secure HTTP-only encrypted session cookie via `jose`

## 🚀 Getting Started

1. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. Admin panel is available at [http://localhost:3000/admin](http://localhost:3000/admin) (Default: `admin` / `admin123`).