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
- Automate the pillar-based newsletter queue (currently curated manually from the admin export)
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

## Plans & NoStress+
1. `/pro` explains the public plans:
   - **NoStress Free** → limited access + in-app pillar alerts (no email).
   - **NoStress+** → everything unlocked, priority support, and upcoming live labs (no memo included by default).
   - **Newsletter-only** → €0.99/mo for the memo alone. It’s a standalone subscription.
2. In `/profile`, members pick 2–3 favourite pillars. These values drive in-app alerts and newsletter segmentation.
3. `/admin/premium` lets you flip `plan` between `free`, `plus`, and `newsletter`, copy BCC lists, and export CSVs.
4. The paid newsletter is still hand-crafted: draft the email, BCC the newsletter-only list (and NoStress+ only if you choose to include them), and send via the subdomain mailbox.
5. Checkout buttons now hit `/api/billing/create-checkout-session`. Configure the Stripe environment variables below so the newsletter (€0.99) and NoStress+ (€5) flows redirect to Stripe Checkout.

## Billing & Stripe
1. Create two recurring products in Stripe (one for the newsletter, one for NoStress+). Grab their price IDs.
2. Set the following environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_NEWSLETTER`
   - `STRIPE_PRICE_PLUS`
   - `STRIPE_WEBHOOK_SECRET` (keep for when we add the webhook endpoint).
3. `/api/billing/create-checkout-session` requires the user to be signed in. It creates Stripe customers on-demand, stores the `stripe_customer_id` on `profiles`, and writes/upserts the email into `newsletter_signups` for auditing.
4. After Stripe Checkout redirects back, flip the `plan` inside `/admin/premium` manually until the webhook endpoint is added. (The route already sets `stripe_subscription_status = 'checkout_pending'`.)

## Newsletter setup (manual pillars)
1. Members choose their pillars on `/profile` and we persist them on `profiles.favorite_pillars`.
2. Opt-ins still land in `newsletter_signups` with consent metadata. Review/export from `/admin/newsletter`.
3. When new content lands, filter the export by pillar, craft the message manually (from `news@updates.nostress-ai.com`), and keep your own notes until automation lands.

## Transactional email (Resend)
Supabase Auth powers passwordless links + verification emails. Configure its SMTP settings to use [Resend](https://resend.com/):

1. In Supabase → Authentication → Email → SMTP Provider, set host `smtp.resend.com`, port `587`, username `resend`, and the password equal to your Resend API key.
2. Use a verified sender (e.g. `auth@updates.nostress-ai.com`) for `MAIL_FROM_ADDRESS`. Resend’s dashboard walks you through DKIM/SPF.
3. Click “Send test email” to confirm the connection, and restart the API once the credentials are saved. All auth emails now route through Resend while the marketing/newsletter layer stays manual.

## Admin access
- Create an email/password user in Supabase Auth and set their `profiles.role` to `admin` via the Supabase dashboard.  
- Visit `/login` to sign in. Successful auth redirects to `/admin`, a protected dashboard that surfaces quick counts for articles, formations, and resources.  
- Use the “Sign out” button in the admin header to clear the session. Non-admin accounts are automatically signed out with an error message.

## Licence
MIT
