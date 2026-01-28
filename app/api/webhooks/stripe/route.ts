import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    if (!webhookSecret) {
        return NextResponse.json({ error: 'Stripe webhook secret is not configured.' }, { status: 500 });
    }

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`[Webhook Error] ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.user_id;
                const plan = session.metadata?.plan;

                if (userId && plan) {
                    await supabase
                        .from('profiles')
                        .update({
                            plan: plan,
                            stripe_customer_id: session.customer as string,
                            stripe_subscription_status: 'active'
                        })
                        .eq('user_id', userId);
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                const subscriptionId = invoice.subscription as string;
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const userId = subscription.metadata?.user_id;
                const plan = subscription.metadata?.plan;

                if (userId && plan) {
                    await supabase
                        .from('profiles')
                        .update({
                            plan: plan,
                            stripe_subscription_status: 'active'
                        })
                        .eq('user_id', userId);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const userId = subscription.metadata?.user_id;

                if (userId) {
                    await supabase
                        .from('profiles')
                        .update({
                            plan: 'free',
                            stripe_subscription_status: 'canceled'
                        })
                        .eq('user_id', userId);
                }
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error('Error handling webhook event:', error);
        return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
