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
- Privacy and legal notices live at `/privacy`, `/privacy/california`, `/legal-notice`, and `/terms`. Update them whenever processors or contact details change.
- Footer links expose “Privacy”, “Legal”, and a placeholder “Manage cookies” button that will eventually open the consent manager.
- Newsletter signups remain reviewable from `/admin/newsletter`; exports include consent timestamps for GDPR handling.
- For all data-subject requests (access/erasure), route people to `legal@nostress-ai.com` as described in the policies and action the request via the admin tools above.
- Contact now happens via direct email (`contact@nostress-ai.com`), so there is no stored contact-form data.
- Add the following CAN-SPAM-compliant footer (or your provider’s equivalent) to every marketing email once the newsletter is wired:
  ```
  You are receiving this email because you opted in at nostress.ai.
  NoStress AI · (add business address) · (city, state, zip)
  To unsubscribe, click the link in this email or write to legal@nostress-ai.com with “Unsubscribe” in the subject line.
  ```

## Analytics & marketing scripts
- Analytics scripts only load after the visitor accepts the “Analytics” category in the consent banner. Enable Plausible (or another script compatible with the same embed) by setting `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (e.g. `nostress.ai`). Optionally override the script URL with `NEXT_PUBLIC_PLAUSIBLE_SCRIPT`.
- A generic marketing script slot is wired to the “Marketing” consent toggle. Set `NEXT_PUBLIC_MARKETING_SCRIPT_URL` to the third-party snippet URL (e.g. a Meta Pixel loader hosted via your tag manager). Leave it blank to disable marketing scripts entirely.
- When consent is withdrawn from the manager, both analytics and marketing scripts are removed from the page. If your provider drops cookies, ensure you also clear them via their API on revocation.

## Next steps (ideas)
- Localise MDX content to English (currently mixed).
- Wire up Stripe webhooks in production and add automated plan-change emails.
- Automate the pillar-based newsletter queue (currently curated manually from the admin export).
- Add automated tests (Playwright or Jest) when the product stabilises.
- Enrich each MDX article/resource with `pillars: []` metadata so the holistic map surfaces richer recommendations.

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
   - **NoStress+** → everything unlocked, priority support, upcoming live labs, and the monthly memo included.
   - **Newsletter-only** → €0.99/mo for the memo alone. It’s a standalone subscription.
2. In `/profile`, members pick 2–3 favourite pillars. These values drive in-app alerts and newsletter segmentation.
3. `/admin/premium` lets you flip `plan` between `free`, `plus`, and `newsletter`, copy BCC lists, and export CSVs.
4. The paid newsletter is still hand-crafted: draft the email, BCC the newsletter-only list (and NoStress+) and send via the subdomain mailbox until ConvertKit automation lands.
5. Checkout buttons hit `/api/billing/checkout`. Configure the Stripe environment variables below so the newsletter (€0.99) and NoStress+ flows redirect to Stripe Checkout.

## Billing & Stripe
1. Create two recurring products in Stripe (one for the newsletter, one for NoStress+). Grab their price IDs.
2. Set the following environment variables (Preview + Production):
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_NEWSLETTER`
   - `STRIPE_PRICE_PLUS`
   - `STRIPE_WEBHOOK_SECRET`
3. `/api/billing/checkout` requires the user to be signed in. It creates Stripe customers on demand, stores `stripe_customer_id` on `profiles`, and writes/upserts the email into `newsletter_signups` for auditing.
4. Configure Stripe webhooks (Developers → Webhooks) to point to `<site-url>/api/billing/webhook` and paste the signing secret into `STRIPE_WEBHOOK_SECRET`. This route updates `plan`/subscription status automatically, so no manual admin toggle is needed.

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
