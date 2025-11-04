import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | NoStress AI',
  description:
    'Learn how NoStress AI collects, stores, and protects personal data across articles, courses, newsletters, and contact forms.'
};

const sections = [
  {
    heading: '1. Who we are',
    body: (
      <>
        <p>
          NoStress AI is a project operated by the NoStress AI team (“we”, “us”, “our”). Our mission is to help knowledge workers
          and families reduce mental load with a holistic, research-backed approach. You can contact us at{' '}
          <a className="underline" href="mailto:care@nostress.ai">care@nostress.ai</a>.
        </p>
      </>
    )
  },
  {
    heading: '2. Data we process',
    body: (
      <>
        <ul className="space-y-2 list-disc list-inside">
          <li>
            <strong>Account data</strong>: when you sign in via Supabase Auth (email/password or OAuth) we store your email address,
            authentication identifiers, and metadata required to manage access.
          </li>
          <li>
            <strong>Contact form data</strong>: name, email address, and message content submitted via the contact form. We keep a
            support log to respond to enquiries.
          </li>
          <li>
            <strong>Newsletter signups</strong>: email address and consent status when you subscribe to updates. We may store
            confirmation timestamps for compliance.
          </li>
          <li>
            <strong>Usage & device data</strong>: basic technical logs (IP address, browser information) produced by our hosting
            provider for operational and security purposes. We do not currently run analytics trackers or marketing pixels.
          </li>
        </ul>
      </>
    )
  },
  {
    heading: '3. Why we process data',
    body: (
      <ul className="space-y-2 list-disc list-inside">
        <li>To provide access to the platform, including protected admin tools and personalised content.</li>
        <li>To respond to questions or collaboration requests submitted through forms or email.</li>
        <li>To send optional newsletters or updates when you opt in (with the ability to unsubscribe at any time).</li>
        <li>To maintain platform security, prevent abuse, and comply with legal obligations.</li>
      </ul>
    )
  },
  {
    heading: '4. Legal bases',
    body: (
      <ul className="space-y-2 list-disc list-inside">
        <li><strong>Contractual necessity</strong> for account authentication and delivery of purchased or registered services.</li>
        <li><strong>Legitimate interest</strong> for ensuring service integrity, preventing abuse, and improving the product.</li>
        <li><strong>Consent</strong> for marketing communications such as newsletters or optional cookies.</li>
        <li><strong>Legal obligation</strong> to retain minimal records for accounting or compliance when applicable.</li>
      </ul>
    )
  },
  {
    heading: '5. Data storage & retention',
    body: (
      <>
        <p>
          Data is primarily stored in Supabase (EU data centre). Contact messages are retained for up to 12 months unless a legal
          obligation requires longer retention. Newsletter data is kept until you unsubscribe. Authentication records remain while
          your account is active.
        </p>
      </>
    )
  },
  {
    heading: '6. Processors & sub-processors',
    body: (
      <ul className="space-y-2 list-disc list-inside">
        <li>
          <strong>Supabase</strong> – hosting, database, and authentication (EU region).{' '}
          <a className="underline" href="https://supabase.com/privacy" target="_blank" rel="noreferrer">
            Privacy policy
          </a>
          .
        </li>
        <li>
          <strong>Email provider</strong> – newsletter delivery. We will update this section once the production provider is
          finalised.
        </li>
        <li>
          <strong>Deployment host</strong> – infrastructure used to serve the Next.js app (e.g. Vercel). Their logs may include IP
          addresses for security monitoring.
        </li>
      </ul>
    )
  },
  {
    heading: '7. Cookies & similar technologies',
    body: (
      <>
        <p>
          Essential cookies are required for authentication and session management. Optional analytics or marketing cookies are not
          activated without your consent. A dedicated consent banner will allow you to review and change preferences at any time.
        </p>
      </>
    )
  },
  {
    heading: '8. Your rights',
    body: (
      <ul className="space-y-2 list-disc list-inside">
        <li>Access your data and obtain a copy.</li>
        <li>Rectify inaccurate data.</li>
        <li>Request deletion (“right to be forgotten”).</li>
        <li>Object to or restrict certain processing activities.</li>
        <li>Withdraw consent at any time (e.g. unsubscribe from newsletters).</li>
      </ul>
    )
  },
  {
    heading: '9. Exercising your rights',
    body: (
      <>
        <p>
          To exercise any GDPR rights, email{' '}
          <a className="underline" href="mailto:privacy@nostress.ai">
            privacy@nostress.ai
          </a>
          . Include the email address associated with your account or submission. We will respond within 30 days and may ask for
          additional information to verify your identity.
        </p>
      </>
    )
  },
  {
    heading: '10. Updates to this policy',
    body: (
      <>
        <p>This policy may evolve as we launch new services or integrate third-party tools. We will update the revision date below.</p>
      </>
    )
  }
];

export default function PrivacyPolicyPage() {
  return (
    <div className="site-container px-4 py-20">
      <header className="max-w-3xl space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Privacy Policy</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Transparency matters. This page explains what personal data we collect, how we use it, and the rights you have as a visitor
          or customer of NoStress AI.
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>
      </header>

      <div className="mt-12 space-y-12 max-w-3xl text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-200">
        {sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{section.heading}</h2>
            <div className="space-y-3 text-neutral-700 dark:text-neutral-300">{section.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
