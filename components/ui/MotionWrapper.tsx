'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { ReactNode } from 'react';

interface MotionWrapperProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    className?: string;
    delay?: number;
    variant?: 'fade-in' | 'slide-up' | 'scale' | 'none';
}

export function MotionWrapper({
    children,
    className,
    delay = 0,
    variant = 'fade-in',
    ...props
}: MotionWrapperProps) {
    const variants = {
        'fade-in': {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        },
        'slide-up': {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
        },
        'scale': {
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 },
        },
        'none': {
            hidden: {},
            visible: {},
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
            variants={variants[variant]}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}
