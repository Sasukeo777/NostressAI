import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Notice | NoStress AI',
  description: 'Legal disclosures regarding the NoStress AI website, hosting, and editorial responsibility.'
};

export default function LegalNoticePage() {
  return (
    <div className="site-container px-4 py-20">
      <header className="max-w-3xl space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Legal Notice</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Information provided pursuant to articles 6-III and 19 of French Law n°2004-575 for confidence in the digital economy (LCEN),
          and for general transparency to EU visitors.
        </p>
      </header>

      <div className="mt-12 space-y-10 max-w-3xl text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-200">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Publisher</h2>
          <p>NoStress AI – independent digital publication specialising in stress reduction and mindful AI. Contact: <a className="underline" href="mailto:legal@nostress-ai.com">legal@nostress-ai.com</a>.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Editorial responsibility</h2>
          <p>
            Publication director: NoStress AI team. Content is produced by internal editors and invited experts. All contributions undergo
            editorial review before publication.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Hosting</h2>
          <p>
            The site is hosted on infrastructure provided by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Data storage
            (database and authentication) is managed by Supabase, based in the EU region. Both providers comply with GDPR and offer
            security measures such as TLS encryption and access controls.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Intellectual property</h2>
          <p>
            Unless stated otherwise, the content (text, images, graphics) on NoStress AI is protected by copyright. Reproduction or reuse
            requires prior written consent. You may quote short extracts with explicit attribution and a link back to the original page.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Hyperlinks</h2>
          <p>
            External links are provided for informational purposes. We do not control and are not responsible for the content or privacy
            practices of third-party sites. If you notice a broken or inappropriate link, please contact us.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Contact</h2>
          <p>
            For any question regarding legal notices, press, or partnership requests, email{' '}
            <a className="underline" href="mailto:legal@nostress-ai.com">
              legal@nostress-ai.com
            </a>{' '}
            or use the contact form available on the site.
          </p>
        </section>
      </div>
    </div>
  );
}
