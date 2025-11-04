'use client';

import { useConsent } from './ConsentProvider';
import { cn } from '@/lib/utils/cn';

interface ManageCookiesButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function ManageCookiesButton({ className, children }: ManageCookiesButtonProps) {
  const { openManager, ready } = useConsent();

  return (
    <button
      type="button"
      onClick={openManager}
      disabled={!ready}
      className={cn(
        'transition-colors hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-primary-300',
        className
      )}
    >
      {children ?? 'Manage cookies'}
    </button>
  );
}
