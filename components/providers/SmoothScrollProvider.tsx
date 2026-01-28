'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

interface SmoothScrollContextType {
    lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
    lenis: null,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export const SmoothScrollProvider = ({ children }: { children: React.ReactNode }) => {
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const rafHandle = useRef<number | null>(null);

    useEffect(() => {
        // Initialize Lenis
        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2,
            infinite: false,
        });

        setLenis(lenisInstance);

        // RAF Loop
        const raf = (time: number) => {
            lenisInstance.raf(time);
            rafHandle.current = requestAnimationFrame(raf);
        };
        rafHandle.current = requestAnimationFrame(raf);

        // ResizeObserver to handle dynamic content height changes (e.g., MDX blog content)
        // This fixes the bug where Lenis stops scrolling mid-article
        const resizeObserver = new ResizeObserver(() => {
            lenisInstance.resize();
        });
        resizeObserver.observe(document.body);

        // Destroy on unmount
        return () => {
            if (rafHandle.current) {
                cancelAnimationFrame(rafHandle.current);
            }
            resizeObserver.disconnect();
            lenisInstance.destroy();
            setLenis(null);
        };
    }, []);

    return (
        <SmoothScrollContext.Provider value={{ lenis }}>
            {children}
        </SmoothScrollContext.Provider>
    );
};
