import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createSupabaseClientWithCookies } from '@/lib/supabase/auth';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';

const stripePriceNewsletter = process.env.STRIPE_PRICE_NEWSLETTER;
const stripePricePlus = process.env.STRIPE_PRICE_PLUS;

type PlanType = 'newsletter' | 'plus';

const planToPrice: Record<PlanType, string | undefined> = {
  newsletter: stripePriceNewsletter,
  plus: stripePricePlus
};

function resolveBaseUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured;
  const origin = request.headers.get('origin');
  if (origin) return origin;
  return 'http://localhost:3000';
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const plan = payload?.plan as PlanType | undefined;
  if (!plan || (plan !== 'newsletter' && plan !== 'plus')) {
    return NextResponse.json({ error: 'Unsupported plan.' }, { status: 400 });
  }

  const priceId = planToPrice[plan];
  if (!priceId) {
    return NextResponse.json({ error: `Missing Stripe price for plan "${plan}".` }, { status: 500 });
  }

  const cookieStore = cookies();
  const supabaseAuth = createSupabaseClientWithCookies(cookieStore);
  const {
    data: { session }
  } = await supabaseAuth.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'You must sign in before subscribing.' }, { status: 401 });
  }

  const email = session.user.email;
  if (!email) {
    return NextResponse.json({ error: 'Your account email is missing. Update it first.' }, { status: 400 });
  }

  const serviceSupabase = getSupabaseServiceClient();
  const { data: profile, error: profileError } = await serviceSupabase
    .from('profiles')
    .select('stripe_customer_id, favorite_pillars')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (profileError) {
    console.error('[billing] profile error', profileError);
    return NextResponse.json({ error: 'Unable to load profile.' }, { status: 500 });
  }

  let stripeCustomerId = profile?.stripe_customer_id ?? null;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { user_id: session.user.id }
    });
    stripeCustomerId = customer.id;
    await serviceSupabase.from('profiles').update({ stripe_customer_id: stripeCustomerId }).eq('user_id', session.user.id);
  }

  const baseUrl = resolveBaseUrl(request);
  const successUrl = typeof payload?.successUrl === 'string' ? payload.successUrl : `${baseUrl}/pro?checkout=success`;
  const cancelUrl =
    typeof payload?.cancelUrl === 'string' ? payload.cancelUrl : `${baseUrl}/pro?checkout=cancelled`;

  // Keep newsletter_signups table in sync for auditing/export.
  const normalisedEmail = email.toLowerCase();
  await serviceSupabase.from('newsletter_signups').upsert(
    {
      email: normalisedEmail,
      consent: true,
      consent_at: new Date().toISOString(),
      status: 'pending',
      source_path: plan === 'plus' ? 'stripe_plus' : 'stripe_newsletter',
      double_opt_in_token: null,
      double_opt_in_sent_at: null,
      confirmed_at: null,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'email' }
  );

  await serviceSupabase
    .from('profiles')
    .update({ stripe_subscription_status: 'checkout_pending' })
    .eq('user_id', session.user.id);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    billing_address_collection: 'auto',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    customer: stripeCustomerId ?? undefined,
    customer_email: stripeCustomerId ? undefined : email,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: session.user.id,
      plan,
      pillars: Array.isArray(profile?.favorite_pillars) ? profile?.favorite_pillars.join(',') : ''
    },
    subscription_data: {
      metadata: {
        user_id: session.user.id,
        plan
      }
    }
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: 'Stripe did not return a checkout URL.' }, { status: 500 });
  }

  return NextResponse.json({ url: checkoutSession.url });
}
