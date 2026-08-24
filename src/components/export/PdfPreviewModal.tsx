"use client";

import { useEffect } from "react";

import styles from "./PdfPreviewModal.module.css";

interface PdfPreviewModalProps {
  isOpen: boolean;
  pdfUrl: string | null;
  onCancel: () => void;
  onExport: () => void;
  isBusy: boolean;
}

const PdfPreviewModal = ({
  isOpen,
  pdfUrl,
  onCancel,
  onExport,
  isBusy,
}: PdfPreviewModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="PDF preview dialog">
      <div className={styles.modal}>
        <p className={styles.title}>Your CV look like this. Do you want to export?</p>
        <div className={styles.viewer}>
          {pdfUrl ? (
            <iframe className={styles.iframe} title="Generated CV PDF" src={pdfUrl} />
          ) : (
            <p className={styles.placeholder}>Generating preview...</p>
          )}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={onCancel} disabled={isBusy}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onExport}
            disabled={!pdfUrl || isBusy}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;
