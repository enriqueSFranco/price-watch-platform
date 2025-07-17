"use client"

import { useEffect, useRef } from "react";
import { useModal, useModalDispatch } from "@/context/modal-context";
import { Button } from "@/ui/atoms/Button/button";
import { IconClose } from "@/ui/atoms/Icons/icon-close";
import styles from "./modal.module.css";

export function Modal() {
  const { isOpen, title, content, footerButtons } = useModal();
  const {closeModal} = useModalDispatch()
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event)
      if (event.key === "Escape") {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    modalRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeModal])

  if(!isOpen) return null

  return (
    <div
      className={styles.modalOverlay}
      onClick={closeModal}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className={styles.modalContainer}
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <h2 id="modal-title">{title}</h2>
          <Button
            text=""
            aria-label="Cerrar modal"
            iconLeft={<IconClose />}
            onClick={closeModal}
          />
        </header>
        <div className={styles.modalContent}>{content}</div>
        {footerButtons && (
          <footer className={styles.modalFooter}>{footerButtons}</footer>
        )}
      </div>
    </div>
  );
}
