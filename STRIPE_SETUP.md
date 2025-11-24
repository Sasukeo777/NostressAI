# Stripe Setup Guide 💳

This guide details the current status of the Stripe integration for NoStress AI and the steps required to fully activate payments.

## ✅ What is Done

### 1. Infrastructure
- **Stripe Client**: A shared utility (`lib/stripe.ts`) is initialized with the latest API version.
- **Environment Variables**: The project is configured to read Stripe keys from `.env.local`.

### 2. Checkout Flow
- **API Route**: `/api/billing/create-checkout-session` handles session creation.
  - Creates a Stripe Customer if one doesn't exist.
  - Syncs the `stripe_customer_id` to the user's profile in Supabase.
  - Supports both "NoStress+" and "Newsletter" plans.
- **UI Integration**: The `/pro` page features working "Subscribe" buttons that redirect to Stripe.
- **Feedback**: A `CheckoutStatus` component displays success or cancellation messages upon return.

### 3. Webhooks
- **Handler**: `/api/webhooks/stripe` is ready to process events.
- **Events Handled**:
  - `checkout.session.completed`: Activates the subscription in Supabase.
  - `invoice.payment_succeeded`: Extends subscription validity.
  - `customer.subscription.deleted`: Revokes access (downgrades to free).

---

## 🛠️ What is Left to Do

### 1. Stripe Dashboard Configuration
You need to configure your Stripe account to talk to this application.

1.  **Create Products**:
    - Go to **Products** in your Stripe Dashboard.
    - Create a product for **NoStress+** (e.g., €5/month). Copy the **Price ID** (starts with `price_...`).
    - Create a product for **Newsletter** (e.g., €0.99/month). Copy the **Price ID**.

2.  **Get API Keys**:
    - Go to **Developers > API keys**.
    - Copy the **Secret Key** (`sk_test_...` or `sk_live_...`).
    - Copy the **Publishable Key** (`pk_test_...` or `pk_live_...`).

3.  **Configure Webhooks**:
    - Go to **Developers > Webhooks**.
    - Add an endpoint pointing to your deployed URL: `https://your-domain.com/api/webhooks/stripe`.
    - Select the following events:
        - `checkout.session.completed`
        - `invoice.payment_succeeded`
        - `customer.subscription.deleted`
    - Copy the **Signing Secret** (`whsec_...`).

### 2. Environment Variables
Update your `.env.local` (and Vercel environment variables) with the keys from above:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PLUS=price_...       # ID for NoStress+
STRIPE_PRICE_NEWSLETTER=price_... # ID for Newsletter
```

### 3. Testing
- **Local Testing**: Use the Stripe CLI to forward webhooks to localhost:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```
- **Live Testing**: Deploy the app and perform a real transaction (or use test cards in test mode).

---

## 📂 Key Files
- `lib/stripe.ts`: Stripe client initialization.
- `app/api/billing/create-checkout-session/route.ts`: Checkout logic.
- `app/api/webhooks/stripe/route.ts`: Webhook event processing.
- `app/pro/page.tsx`: Pricing page and UI.
