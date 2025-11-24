'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ring-offset-neutral-50 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-900/20 hover:shadow-primary-900/30 hover:to-primary-600 dark:from-primary-500 dark:to-primary-600',
        secondary:
          'bg-white text-neutral-700 border border-neutral-200 shadow-sm hover:bg-neutral-50 hover:border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-700',
        destructive: 'bg-danger text-white hover:bg-danger/90 shadow-md shadow-danger/20',
        outline:
          'border-2 border-primary-200 text-primary-700 bg-transparent hover:bg-primary-50 hover:border-primary-300 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/20',
        ghost:
          'text-neutral-600 hover:bg-neutral-100/50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-200',
        link: 'text-primary-600 underline-offset-4 hover:underline dark:text-primary-400',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };