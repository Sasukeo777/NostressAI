'use client';

import Link from 'next/link';
import { Mail, Sparkles, Calendar, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CONTACT_EMAIL = 'contact@nostress-ai.com';
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Hello NoStress AI')}`;

const responseHighlights = [
  { icon: Sparkles, title: 'What we cover', body: 'Speaking requests, partnerships, questions on formations, or custom stress audits for teams.' },
  { icon: Calendar, title: 'Response time', body: 'We reply within two business days. If it is urgent, mention the timeline in the subject line.' },
  { icon: PhoneCall, title: 'Prefer async', body: 'We start every conversation by email so you keep a written thread. From there we can book a call if useful.' }
];

export default function ContactPage() {
  return (
    <div className="space-y-12 max-w-3xl">
      <section className="accent-panel rounded-[32px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-600 dark:text-primary-200">Contact</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-neutral-800 dark:text-neutral-50">Let’s keep it simple.</h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-300">
          Instead of another form, write to us directly. It keeps context in your inbox, lets you attach docs, and saves you from guessing if a message went through.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href={MAILTO}>
            <Button size="lg" className="gap-2">
              <Mail className="h-4 w-4" />
              Email us
            </Button>
          </a>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{CONTACT_EMAIL}</p>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        {responseHighlights.map((item) => (
          <article key={item.title} className="accent-panel rounded-2xl p-5 text-sm text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/70 p-2 text-neutral-700 shadow-sm dark:bg-neutral-900/50 dark:text-neutral-100">
                <item.icon className="h-4 w-4" />
              </span>
              <p className="font-semibold text-neutral-800 dark:text-neutral-100">{item.title}</p>
            </div>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300">{item.body}</p>
          </article>
        ))}
      </div>

      <section className="accent-panel rounded-[28px] p-8 text-sm text-neutral-600 dark:text-neutral-300">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-50">Need something structured?</h2>
        <p className="mt-3">
          For paid audits, in-company trainings, or media interviews, outline the audience, desired outcome, and timeframe. We’ll reply with next steps or a booking link.
        </p>
        <p className="mt-4">
          After we confirm availability, you’ll receive a calendar link in email so we keep the entire thread in one place.
        </p>
      </section>
    </div>
  );
}
