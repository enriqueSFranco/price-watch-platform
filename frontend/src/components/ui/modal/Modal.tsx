'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModal, useModalDispatch } from '@/context/modal-context';
import { Button } from '@/sections/core/desing-system/Button/button';
import { IconClose } from '@/sections/core/Icons/IcClose';
import styles from './modal.module.css';
import clsx from 'clsx';

export function Modal() {
	const [isRendered, setIsRendered] = useState(false);
	const [isAnimationActive, setIsAnimationActive] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);
	const { isOpen, title, content, footerButtons } = useModal();
	const { closeModal } = useModalDispatch();

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closeModal();
			}
		},
		[closeModal],
	);

	const lockScroll = useCallback(() => {
		document.body.style.overflow = 'hidden';
	}, []);

	const unlockScroll = useCallback(() => {
		document.body.style.overflow = '';
	}, []);

	useEffect(() => {
		let animationOutTimeout: ReturnType<typeof setTimeout>;
		let animationInTimeout: ReturnType<typeof setTimeout>;

		if (isOpen) {
			setIsRendered(true);
			lockScroll();
			animationInTimeout = setTimeout(() => {
				setIsAnimationActive(true);
				modalRef.current?.focus();
				document.addEventListener('keydown', handleKeyDown);
			}, 50);
		} else {
			if (isRendered) {
				setIsAnimationActive(false);
				unlockScroll();
				document.removeEventListener('keydown', handleKeyDown);
				animationOutTimeout = setTimeout(() => {
					setIsRendered(false);
				}, 300);
			}
		}
		return () => {
			clearTimeout(animationInTimeout);
			clearTimeout(animationOutTimeout);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, isRendered, handleKeyDown, lockScroll, unlockScroll]);

	if (!isRendered) return null;

	const containerClasses = clsx(styles.modalContainer, {
		[styles.entered]: isAnimationActive,
	});
	const overlayClasses = clsx(styles.modalOverlay, {
		[styles.visible]: isAnimationActive,
	});

	return createPortal(
		<div className={overlayClasses} onClick={closeModal} aria-modal="true" role="dialog">
			<div
				ref={modalRef}
				className={containerClasses}
				aria-labelledby="modal-title"
				tabIndex={-1}
				onClick={(e) => e.stopPropagation()}
			>
				<header className={styles.modalHeader}>
					<h2 id="modal-title" className="text-2xl text-center font-light text-black">
						{title}
					</h2>
					<Button aria-label="Cerrar modal" variant="ghost" onClick={closeModal}>
						<IconClose />
					</Button>
				</header>
				<div className={styles.modalContent}>{content}</div>
				{footerButtons && <footer className={styles.modalFooter}>{footerButtons}</footer>}
			</div>
		</div>,
		document.body,
	);
}
