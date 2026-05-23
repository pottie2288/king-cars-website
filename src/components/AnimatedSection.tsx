import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps) {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <div
            ref={ref}
            className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
