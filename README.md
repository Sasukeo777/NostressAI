# NoStress AI

Web platform offering research-backed training, articles, videos and practical resources to reduce mental load with intentional AI.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MDX for long-form content (articles, tips, studies)

## Getting started
```bash
npm install
npm run dev
```
App runs on http://localhost:3000

## Project structure
```
app/              # Routes (App Router)
  approach/       # Holistic method overview
  courses/        # Course index and detail pages
  blog/           # Blog index + posts
  resources/      # Practical resources
  about/          # Manifesto / about page
  videos/         # Video embeds
components/       # UI components (navbar, cards, etc.)
content/          # MDX sources (blog, tips, studies)
lib/              # Data loaders and helpers
```

## Adding an MDX article
Create `content/blog/my-article.mdx`:
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

## Customisation
- Adjust the color palette in `tailwind.config.js`
- Set global metadata and layout tweaks in `app/layout.tsx`

## Compliance & privacy
- Privacy and legal notices live at `/privacy` and `/legal-notice`. Keep these pages up to date when the product or processors change.
- The footer links expose “Privacy”, “Legal”, and a placeholder “Manage cookies” button that will open the consent manager once implemented.
- Contact messages and newsletter signups are reviewable from `/admin/messages` and `/admin/newsletter`, with CSV exports plus one-click deletion for GDPR requests.
- For data-subject requests (access/erasure), direct users to `privacy@nostress.ai` (see Privacy Policy) and action the request via the admin tools above.
- Newsletter/contact forms currently store submissions locally only; wire them to the chosen provider, enable double opt-in, and keep consent timestamps before going live.
- Terms of Service live at `/terms` and a California-specific privacy notice at `/privacy/california`. Review both with counsel before launch.
- Add the following CAN-SPAM-compliant footer (or your provider’s equivalent) to every marketing email once the newsletter is wired:
  ```
  You are receiving this email because you opted in at nostress.ai.
  NoStress AI · (add business address) · (city, state, zip)
  To unsubscribe, click the link in this email or write to privacy@nostress.ai with “Unsubscribe” in the subject line.
  ```

## Analytics & marketing scripts
- Analytics scripts only load after the visitor accepts the “Analytics” category in the consent banner. Enable Plausible (or another script compatible with the same embed) by setting `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (e.g. `nostress.ai`). Optionally override the script URL with `NEXT_PUBLIC_PLAUSIBLE_SCRIPT`.
- A generic marketing script slot is wired to the “Marketing” consent toggle. Set `NEXT_PUBLIC_MARKETING_SCRIPT_URL` to the third-party snippet URL (e.g. a Meta Pixel loader hosted via your tag manager). Leave it blank to disable marketing scripts entirely.
- When consent is withdrawn from the manager, both analytics and marketing scripts are removed from the page. If your provider drops cookies, ensure you also clear them via their API on revocation.

## Next steps (ideas)
- Localise MDX content to English (currently mixed)
- Hook the contact form to an email service (Resend, Brevo, …)
- Newsletter double opt-in flows through Resend. Set `RESEND_API_KEY`, `RESEND_NEWSLETTER_FROM_EMAIL`, and `RESEND_NEWSLETTER_AUDIENCE_ID` to deliver confirmation emails and sync confirmed contacts.
- Add automated tests (Playwright or Jest) when the product stabilises
- Enrich each MDX article/resource with `pillars: []` metadata so the holistic map surfaces richer recommendations

## Supabase integration
1. Create a Supabase project and note the project URL plus anon/service keys.  
2. Duplicate `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.  
   - Optional: configure `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_PLAUSIBLE_SCRIPT`, and `NEXT_PUBLIC_MARKETING_SCRIPT_URL` for consent-gated scripts (see above).
3. Apply migrations:  
   ```bash
   npx supabase db push
   ```  
4. Seed reference data:  
   ```bash
   npm run seed:pillars
   npm run seed:formations
   npm run seed:articles
   npm run seed:resources
   ```  
5. The `avatars` storage bucket is created by the migrations; if you created the project earlier, ensure a public bucket named `avatars` exists in Supabase Storage.  
6. Enable the **Google** provider in Supabase Auth and set the callback URL to `<site-url>/auth/callback`.  
7. Server-side renders use the service client (`lib/supabaseClient.ts`), while server actions/components use the auth-aware helpers in `lib/supabase/auth.ts`.

## Newsletter setup (Resend)
1. Create a [Resend](https://resend.com) project and verify your sending domain (e.g. `nostress-ai.com`).
2. Generate an API key with access to emails and audiences, then set the following environment variables:
   - `RESEND_API_KEY`
   - `RESEND_NEWSLETTER_FROM_EMAIL` (e.g. `NoStress AI <newsletter@nostress-ai.com>`)
   - `RESEND_NEWSLETTER_AUDIENCE_ID` (optional; confirmed contacts are pushed to this audience when present).
3. Ensure `NEXT_PUBLIC_SITE_URL` (or `SITE_URL` on the server) reflects the public site URL so confirmation links resolve correctly.
4. On subscription, visitors now receive a double opt-in email via Resend. They become active once they confirm through `/newsletter/confirm`.
5. Confirmed contacts are stored in Supabase **and** mirrored (if configured) inside the Resend audience for campaigns.

## Admin access
- Create an email/password user in Supabase Auth and set their `profiles.role` to `admin` via the Supabase dashboard.  
- Visit `/login` to sign in. Successful auth redirects to `/admin`, a protected dashboard that surfaces quick counts for articles, formations, and resources.  
- Use the “Sign out” button in the admin header to clear the session. Non-admin accounts are automatically signed out with an error message.

## Licence
MIT
