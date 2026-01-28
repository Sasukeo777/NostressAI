import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | NoStress AI',
  description: 'Understand the terms and conditions that govern the use of NoStress AI.'
};

const sections = [
  {
    heading: '1. Acceptance of the terms',
    body: (
      <p>
        By accessing or using NoStress AI (the “Service”), you agree to be bound by these Terms of Service (“Terms”) and our Privacy
        Policy. If you do not agree, you must not access or use the Service. If you use the Service on behalf of an organisation, you
        represent that you are authorised to bind that organisation, and “you” also refers to that organisation.
      </p>
    )
  },
  {
    heading: '2. Eligibility & accounts',
    body: (
      <>
        <p>
          You must be at least 18 years old to use the Service. Certain areas (such as the admin dashboard) require an account issued
          by NoStress AI. You are responsible for safeguarding your credentials and for all activity under your account. Notify us
          immediately if you suspect unauthorised use.
        </p>
      </>
    )
  },
  {
    heading: '3. Permitted use',
    body: (
      <ul className="space-y-2 list-disc list-inside">
        <li>Use the Service only for lawful purposes and in accordance with these Terms.</li>
        <li>Do not attempt to probe, scan, or test the vulnerability of any system or network, or breach security measures.</li>
        <li>Do not reverse engineer, decompile, or otherwise attempt to derive the source code of any part of the Service.</li>
        <li>Do not upload or transmit harmful code, spam, or content that is defamatory, infringing, or otherwise unlawful.</li>
      </ul>
    )
  },
  {
    heading: '4. Content & intellectual property',
    body: (
      <>
        <p>
          The Service, including all text, graphics, logos, and other materials, is owned by NoStress AI or its licensors and is
          protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written
          consent. If you submit content (for example, via forms), you grant us a non-exclusive, worldwide licence to use, reproduce,
          and process that content solely to provide the Service.
        </p>
      </>
    )
  },
  {
    heading: '5. Third-party services',
    body: (
      <p>
        The Service may reference third-party tools or integrations (e.g., Supabase for authentication and storage, or an email
        provider for newsletters). Your use of those services is subject to the applicable third-party terms. We are not responsible for
        third-party content or practices.
      </p>
    )
  },
  {
    heading: '6. Disclaimers',
    body: (
      <>
        <p>
          The Service is provided “as is” and “as available.” We make no warranties, express or implied, regarding the Service,
          including but not limited to merchantability, fitness for a particular purpose, or non-infringement. NoStress AI aims to offer
          educational content; it does not replace personalised medical, psychological, or legal advice. Always consult a qualified
          professional for personalised support.
        </p>
      </>
    )
  },
  {
    heading: '7. Limitation of liability',
    body: (
      <p>
        To the fullest extent permitted by law, NoStress AI, its contributors, and partners shall not be liable for any indirect,
        incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
        indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of the
        Service.
      </p>
    )
  },
  {
    heading: '8. Indemnification',
    body: (
      <p>
        You agree to indemnify and hold harmless NoStress AI and its team from and against any claims, liabilities, damages, losses,
        and expenses (including reasonable legal fees) arising from your use of the Service or violation of these Terms.
      </p>
    )
  },
  {
    heading: '9. Suspension & termination',
    body: (
      <p>
        We may suspend or terminate your access to the Service at any time if we reasonably believe you have violated these Terms or
        if required by law. Upon termination, your right to use the Service will end immediately, but sections that by their nature
        should survive (e.g., intellectual property, disclaimers, limitations) will remain in effect.
      </p>
    )
  },
  {
    heading: '10. Governing law',
    body: (
      <p>
        These Terms are governed by the laws of the European Union and the country where NoStress AI operates, without regard to its
        conflict of law provisions. Any disputes will be resolved in the competent courts of that jurisdiction, unless another forum is
        required by applicable law.
      </p>
    )
  },
  {
    heading: '11. Changes to the Terms',
    body: (
      <p>
        We may update these Terms from time to time to reflect operational or legal changes. When we do, we will update the revision
        date below and, where appropriate, notify users via the Service. Continued use after changes become effective constitutes your
        acceptance of the revised Terms.
      </p>
    )
  },
  {
    heading: '12. Contact',
    body: (
      <p>
        Questions about these Terms can be sent to{' '}
        <a className="underline" href="mailto:legal@nostress-ai.com">
          legal@nostress-ai.com
        </a>
        . Please include “Terms of Service” in the subject line for faster routing.
      </p>
    )
  }
];

export default function TermsOfServicePage() {
  return (
    <div className="site-container px-4 py-20">
      <header className="max-w-3xl space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Terms of Service</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          These Terms govern your use of NoStress AI. Please read them carefully before accessing the platform or any associated
          services.
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
          Last updated: 2024-12-11
        </p>
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
