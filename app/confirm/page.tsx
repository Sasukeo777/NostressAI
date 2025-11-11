import Link from 'next/link';

export default function ConfirmPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-8 w-full rounded-2xl border border-primary-200/60 bg-primary-50/60 px-6 py-8 shadow-sm dark:border-primary-900/40 dark:bg-primary-900/10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-600 dark:text-primary-300">
          NoStress AI
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Email confirmed
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          Thanks for validating your address. Your account is now active—you can sign in with your email and password
          to access courses, saved progress, and newsletter preferences.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-500 dark:text-neutral-300">
        <Link href="/login" className="underline">
          Go to sign in
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/" className="underline">
          Visit the homepage
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/privacy" className="underline">
          Privacy policy
        </Link>
      </div>
    </main>
  );
}
