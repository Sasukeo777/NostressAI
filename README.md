# NoStress AI

Web platform offering research-backed training, articles, videos, and practical resources to reduce mental load with intentional AI.

## Stack
- **Framework**: Next.js 14 (App Router)
- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Tailwind Animate
- **Content**: MDX for long-form content (articles, tips, studies)
- **Database**: Supabase (PostgreSQL + Auth)
- **Payments**: Stripe

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Set up environment variables**:
    Copy `.env.example` to `.env.local` and fill in your Supabase and Stripe keys.

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
app/
  admin/          # Admin dashboard (protected)
  api/            # API routes (webhooks, billing)
  blog/           # Blog index and posts
  courses/        # Course catalog and details
  pro/            # Pricing and subscription page
  profile/        # User settings
  resources/      # Practical tips library
components/
  admin/          # Admin-specific components
  blog/           # Blog components (cards, filters)
  courses/        # Course components
  layout/         # Global layout (Footer, Navbar)
  ui/             # Reusable UI primitives
content/          # MDX source files
lib/              # Utilities (Stripe, Supabase, helpers)
scripts/          # Database seeding and maintenance
```

## Features

### 🔐 Authentication & Profile
- **Supabase Auth**: Secure email/password and social login.
- **Profile Settings**: Manage display name, avatar, and focus pillars.
- **Pillars**: Users select "Focus Pillars" (e.g., Sleep, Screen Time) to personalize their feed.

### 📚 Content Engine
- **Blog**: MDX-powered articles with search and filtering.
- **Courses**: Structured learning modules with progress tracking (coming soon).
- **Resources**: Quick, actionable tips in a "ScrollStack" interface.

### 💳 Payments (Stripe)
- **Subscriptions**: "NoStress+" and "Newsletter-only" plans.
- **Webhooks**: Automatic status updates via Stripe webhooks.
- **See [STRIPE_SETUP.md](./STRIPE_SETUP.md) for detailed configuration.**

### 🏢 Admin Panel
- **Dashboard**: Overview of platform stats (users, content, revenue).
- **Content Management**: (Planned) Interface for managing MDX content.
- **User Management**: View and manage user roles.

## Contributing

### Adding an MDX Article
Create a file in `content/blog/my-article.mdx`:
```mdx
---
title: "Title of the article"
date: 2025-09-29
excerpt: "Short abstract."
category: "stress"
tags: ["ai", "mental-load"]
---

Your **MDX** content here.
```

### Database Migrations
We use Supabase for the database.
- **Push schema**: `npx supabase db push`
- **Seed data**: `npm run seed:pillars` (and other scripts in `scripts/`)

## License
MIT
