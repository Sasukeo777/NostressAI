import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'California Privacy Notice | NoStress AI',
  description: 'Additional disclosures for California residents under the CCPA/CPRA.'
};

const sections = [
  {
    heading: '1. Scope',
    body: (
      <p>
        This California Privacy Notice supplements the information in our{' '}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>{' '}
        and applies solely to individuals who reside in California. It describes how we collect, use, and disclose Personal
        Information (“PI”) as defined under the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act
        (CPRA).
      </p>
    )
  },
  {
    heading: '2. Categories of personal information we collect',
    body: (
      <>
        <p>
          In the preceding 12 months we have collected the following categories of PI, as described in Section 2 of the Privacy Policy:
        </p>
        <ul className="space-y-2 list-disc list-inside">
          <li>
            Identifiers (e.g., name, email address) and contact details you submit via forms or account registration.
          </li>
          <li>Internet or network activity (basic usage logs captured by our hosting provider for security and operations).</li>
          <li>Inferences or support records generated when you contact us for assistance.</li>
        </ul>
        <p className="mt-3">
          We do not knowingly collect “sensitive” personal information as defined by the CPRA.
        </p>
      </>
    )
  },
  {
    heading: '3. Sources of personal information',
    body: (
      <p>
        We obtain PI directly from you (e.g., through forms, account sign-ins, newsletter subscriptions) and automatically from your
        device when you access the Service (e.g., server logs). We may also generate PI internally (e.g., notes related to support
        interactions).
      </p>
    )
  },
  {
    heading: '4. Purposes for using personal information',
    body: (
      <p>
        We use PI for the business purposes outlined in Section 3 of the Privacy Policy, such as providing the Service, communicating
        with you, maintaining security, and complying with legal obligations. We do not “sell” or “share” PI for cross-context
        behavioural advertising as those terms are defined under the CCPA/CPRA.
      </p>
    )
  },
  {
    heading: '5. Disclosure of personal information',
    body: (
      <p>
        We disclose PI to service providers that support the Service (e.g., Supabase for hosting and authentication, email providers for
        communications) pursuant to written contracts that restrict their use of PI. We do not knowingly disclose PI to other third
        parties outside these service providers, except as required by law.
      </p>
    )
  },
  {
    heading: '6. Your California privacy rights',
    body: (
      <ul className="space-y-2 list-disc list-inside">
        <li>
          <strong>Right to know</strong> the categories and specific pieces of PI we collect, use, and disclose.
        </li>
        <li>
          <strong>Right to delete</strong> PI we have collected, subject to certain exceptions (e.g., compliance obligations).
        </li>
        <li>
          <strong>Right to correct</strong> inaccurate PI that we maintain about you.
        </li>
        <li>
          <strong>Right to opt out of sale or sharing</strong> of PI (not applicable because we do not sell or share PI for cross-context
          behavioural advertising).
        </li>
        <li>
          <strong>Right to limit use and disclosure of sensitive PI</strong> (not applicable because we do not collect sensitive PI).
        </li>
        <li>
          <strong>Right to non-discrimination</strong> for exercising any of the rights above.
        </li>
      </ul>
    )
  },
  {
    heading: '7. Submitting requests',
    body: (
      <>
        <p>
          To exercise your California privacy rights, email{' '}
          <a className="underline" href="mailto:legal@nostress-ai.com">
            legal@nostress-ai.com
          </a>{' '}
          with the subject line “CCPA Request.” Please describe the request (access, deletion, correction) and provide the email address
          associated with your interactions. We will verify your identity before acting on the request, which may require additional
          information or documentation. You may also authorise an agent to submit a request on your behalf; in that case we will require
          proof of authorisation.
        </p>
        <p className="mt-3">
          We aim to respond within 45 days. If we need additional time (up to a total of 90 days), we will notify you.
        </p>
      </>
    )
  },
  {
    heading: '8. Data retention',
    body: (
      <p>
        We retain PI for as long as necessary to fulfil the purposes outlined in our Privacy Policy, comply with legal obligations, and
        resolve disputes. When retention is no longer necessary, we delete or anonymise the information in accordance with our internal
        policies.
      </p>
    )
  },
  {
    heading: '9. Changes to this notice',
    body: (
      <p>
        We may revise this notice periodically. When we do, we will update the revision date below and, if material changes occur, we
        will provide additional notice as required by law. Continued use of the Service after changes become effective constitutes your
        acknowledgement of those changes.
      </p>
    )
  },
  {
    heading: '10. Contact',
    body: (
      <p>
        For questions about this notice or how we handle California privacy rights, contact{' '}
        <a className="underline" href="mailto:legal@nostress-ai.com">
          legal@nostress-ai.com
        </a>
        .
      </p>
    )
  }
];

export default function CaliforniaPrivacyNoticePage() {
  return (
    <div className="site-container px-4 py-20">
      <header className="max-w-3xl space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">California Privacy Notice</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Additional disclosures for California residents about the personal information we collect, use, and disclose, and the rights
          available under the CCPA/CPRA.
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
          Last updated: {new Date().toISOString().slice(0, 10)}
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
