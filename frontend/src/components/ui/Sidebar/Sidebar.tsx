'use client';

import { useEffect, useRef, useState } from 'react';
import type { ISidebarItem } from './types';
import { SidebarItem } from './SidebarItem';

import styles from './sidebar.module.css';
import { usePathname } from 'next/navigation';

interface SidebarProps {
	items: ISidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
	const pathname = usePathname();
	const [indicatorStyle, setIndicatorStyle] = useState({
		top: 0,
		height: 0,
		isVisible: false, // Controla si ya se posicionó por primera vez
	});
	const listRef = useRef<HTMLUListElement | null>(null);
	const indicatorRef = useRef<HTMLDivElement | null>(null);

	// efecto que se ejecuta al cambiar de ruta
	useEffect(() => {
		if (!listRef.current || !indicatorRef.current) return;
		// buscar el elemento del link activo con el data-href
		const activeLink = listRef.current.querySelector(`a[data-href="${pathname}"]`);

		if (activeLink) {
			// obtener la posicion y dimensiones del elemento activo
			const linkRect = activeLink.getBoundingClientRect();
			// Obtenemos la posición del contenedor (lista) para calcular el 'top' relativo
			const listRect = listRef.current.getBoundingClientRect();

			// Calcula el 'top' relativo: distancia del link al 'top' de la lista
			const newTop = linkRect.top - listRect.top;
      const newHeight = linkRect.height;

			// Actualiza el estado con los nuevos valores
			setIndicatorStyle({
				top: newTop,
				height: newHeight,
				isVisible: true,
			});
		} else {
			// Si no hay activo (ej: una ruta que no está en el menú), ocultar o resetear
			setIndicatorStyle((prev) => ({
				...prev,
				isVisible: false,
			}));
		}
	}, [pathname]);

	// Opcional: Recalcular en resize para mantener la posición correcta
	useEffect(() => {
		const handleResize = () => {
			if (listRef.current) {
				const activeLink = listRef.current.querySelector(`a[data-href="${pathname}"]`);
				if (activeLink) {
					const linkRect = activeLink.getBoundingClientRect();
          const listRect = listRef.current.getBoundingClientRect();
					setIndicatorStyle({
            top: linkRect.top - listRect.top,
            height: linkRect.height,
            isVisible: true,
          });
				}
			}
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [pathname]);

	return (
		<aside className={styles.sidebarWrapper}>
			<nav>
				<ul ref={listRef} className={`${styles.sidebarList}`}>
					<div ref={indicatorRef} className={styles.indicatorAnimated} style={{
            transform: `translateY(${indicatorStyle.top}px)`,
            height: `${indicatorStyle.height}px`,
            opacity: indicatorStyle.isVisible ? 1 : 0,
          }} />
					{items.map((item) => (
						<SidebarItem key={item.href} {...item} />
					))}
				</ul>
			</nav>
		</aside>
	);
}
