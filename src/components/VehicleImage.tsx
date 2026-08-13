'use client'

import { useCallback, useState } from 'react';
import { Car } from 'lucide-react';

interface VehicleImageProps {
    /** Photo URL from the VMG feed — may be empty or point at a dead file */
    src: string;
    alt: string;
    className?: string;
    loading?: 'lazy' | 'eager';
}

/**
 * Vehicle photo with a branded fallback and a fade-in.
 *
 * The VMG feed doesn't guarantee a photo for every stock item, and some URLs
 * it does supply have gone stale. A bare <img> with an empty or broken src
 * renders as the browser's torn-page icon, which looks like the site is
 * failing rather than the listing simply lacking a picture yet. This keeps
 * the card intact and says what's actually true.
 */
export function VehicleImage({ src, alt, className = '', loading = 'lazy' }: VehicleImageProps) {
    const [failed, setFailed] = useState(false);
    const [loaded, setLoaded] = useState(false);

    /**
     * A cached image can finish decoding before React attaches onLoad, so the
     * event never fires and the image would stay faded out. Checking
     * `complete` as soon as we hold the node closes that gap — the fade is
     * only ever allowed to delay paint, never to prevent it.
     */
    const measureOnMount = useCallback((node: HTMLImageElement | null) => {
        if (node?.complete) setLoaded(true);
    }, []);

    const hasUsableSrc = typeof src === 'string' && src.trim().length > 0;

    if (!hasUsableSrc || failed) {
        return (
            <div
                className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 ${className}`}
                role="img"
                aria-label={`${alt} — photo coming soon`}
            >
                <Car className="w-10 h-10" strokeWidth={1.5} />
                <span className="text-xs font-medium px-2 text-center">Photo coming soon</span>
            </div>
        );
    }

    return (
        <img
            ref={measureOnMount}
            src={src}
            alt={alt}
            loading={loading}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
    );
}
