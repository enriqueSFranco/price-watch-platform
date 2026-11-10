import type { PropsWithChildren } from 'react';
import { useScrollObserver } from './use-scroll-observer';
import styles from './navbar.module.css';

export function NavbarRoot({ variant, children }: PropsWithChildren<{variant?: "public" | "private"}>) {
	const { isPast, sentinelRef } = useScrollObserver({
		threshold: 0,
		rootMargin: '0px',
	});

  const positionClasses =
    variant === "public"
      ? "fixed top-0 left-0 right-0"
      : "fixed top-0 left-[260px] right-0";
      const baseClasses =
      "h-[70px] flex items-center justify-between px-4 border-b border-black/10 z-50 transition-all";
    const scrolled = isPast ? "navbarScrolled" : "navbarTransparent";

	return (
		<>
			<div
				ref={sentinelRef}
				style={{
					position: 'absolute',
					top: 0,
					width: '100%',
					height: '1px',
					pointerEvents: 'none',
				}}
			/>
			<nav className={`${baseClasses} ${positionClasses} ${scrolled}`}>{children}</nav>
		</>
	);
}

function NavbarLeft({ children }: PropsWithChildren) {
	// Aquí podemos usar la clase 'styles.navbarLeft' si existe
	return <div className={`flex items-center gap-2.5 w-1/2`}>{children}</div>;
}

// Subcomponente para la sección derecha
function NavbarRight({ children }: PropsWithChildren) {
	return <div className="flex items-center">{children}</div>;
}

export const Navbar = Object.assign(NavbarRoot, {
	Left: NavbarLeft,
	Right: NavbarRight,
});
