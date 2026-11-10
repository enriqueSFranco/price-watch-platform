import { useCallback, useEffect, useRef, useState } from 'react';

type ScrollObverserOptions = {
	threshold?: number | number[];
	rootMargin?: string;
};

/**
 * @description Detecta si un elemento (sentinel) ha sido desplazado fuera del viewport
 * @param threshold Umbral para disparar el cambio (0 a 1)
 * @returns {scrolled, sentinelRef}
 */
export function useScrollObserver({ threshold = 0, rootMargin = '0px' }: ScrollObverserOptions) {
	const [isPast, setIsPast] = useState(false);
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
		const entry = entries[0];
		setIsPast(!entry.isIntersecting);
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (!sentinelRef.current) return;

		const observer = new IntersectionObserver(handleIntersect, {
			threshold,
			rootMargin,
		});
		observer.observe(sentinelRef.current);
		return () => observer.disconnect();
	}, [handleIntersect, threshold, rootMargin]);

	return { isPast, sentinelRef };
}
