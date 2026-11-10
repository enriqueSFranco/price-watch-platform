'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './infinite-moving-cards.module.css';

interface InfiniteMovingCardsProps<T> {
	items: T[];
	renderItem: (item: T, index: number) => React.ReactNode;
	speed: 'normal' | 'slow' | 'fast';
	direction: 'left' | 'right';
	pauseOnHover: boolean;
}

export function InfiniteMovingCards<T>({
	items,
	renderItem,
	direction = 'left',
	speed = 'normal',
	pauseOnHover = true,
}: InfiniteMovingCardsProps<T>) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const scrollerRef = useRef<HTMLUListElement | null>(null);
	const [isPaused, setIsPaused] = useState(false);

	const addAnimation = useCallback(() => {
		if (containerRef.current && scrollerRef.current) {
			const scrollers = document.querySelectorAll(`.${styles.scroller}`);
			scrollers.forEach((scroller) => {
				scroller.setAttribute('data-animated', 'true');
			});

			const scrollerContent = Array.from(scrollerRef.current.children);
			scrollerContent.forEach((item) => {
				const duplicatedItem = item.cloneNode(true) as HTMLElement;
				duplicatedItem.setAttribute('aria-hidden', 'true');
				scrollerRef.current?.appendChild(duplicatedItem);
			});
			const gapValue = getComputedStyle(scrollerRef.current).getPropertyValue('gap');
			scrollerRef.current.style.setProperty('--gap-width', gapValue || '0px');
		}
	}, []);

	useEffect(() => {
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			addAnimation();
		}
	}, [addAnimation]);

	const handleMouseEnter = useCallback(() => {
		if (pauseOnHover) {
			setIsPaused(true);
		}
	}, [pauseOnHover]);

	const handleMouseLeave = useCallback(() => {
		if (pauseOnHover) {
			setIsPaused(false);
		}
	}, [pauseOnHover]);

	const containerClass = clsx(styles.scroller, { [styles.paused]: isPaused });

	return (
		<div
			className={containerClass}
			role="region"
			ref={containerRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			data-direction={direction}
			data-speed={speed}
		>
			<ul className={clsx(styles.carouselList, styles.scrollerInner)} role="list" aria-live="off" ref={scrollerRef}>
				{items.map((item, index) => (
					<li key={`carousel-item-${index}`} role="listitem" className={styles.carouselList__item}>
						{renderItem(item, index)}
					</li>
				))}
			</ul>
		</div>
	);
}
