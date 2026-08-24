import { useCallback, useEffect, useRef, useState } from "react";

import PdfPreviewModal from "@/components/export/PdfPreviewModal";
import type { ExportPdfRequestPayload } from "@/lib/pdf/export-types";
import { useCvStore } from "@/store/cv-store";
import { selectPreviewViewModel } from "@/store/selectors/preview-selectors";
import type { CvSectionStep } from "@/types/cv";

import MinimalistTemplate from "../templates/minimalist/MinimalistTemplate";
import styles from "./LivePreview.module.css";

interface GeneratedPdfPreview {
  blobUrl: string;
  filename: string;
}

const extractFilename = (contentDisposition: string | null): string => {
  if (!contentDisposition) {
    return "cv.pdf";
  }

  const match = contentDisposition.match(/filename="([^"]+)"/i);
  if (!match?.[1]) {
    return "cv.pdf";
  }
  return match[1];
};

const serializeDocumentStyles = (): string => {
  const styleNodes = Array.from(
    document.querySelectorAll<HTMLStyleElement | HTMLLinkElement>('style, link[rel="stylesheet"]'),
  );

  return styleNodes
    .map((node) => node.outerHTML)
    .join("\n");
};

const waitForTransitionFrame = async (delayMs: number): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(() => {
      window.requestAnimationFrame(() => resolve());
    }, delayMs);
  });
};

const createInlineStyledSnapshot = (rootElement: HTMLElement): string => {
  const clonedRoot = rootElement.cloneNode(true) as HTMLElement;
  const sourceElements = [rootElement, ...Array.from(rootElement.querySelectorAll<HTMLElement>("*"))];
  const clonedElements = [clonedRoot, ...Array.from(clonedRoot.querySelectorAll<HTMLElement>("*"))];

  sourceElements.forEach((sourceElement, index) => {
    const clonedElement = clonedElements[index];
    if (!clonedElement) {
      return;
    }

    const computedStyle = window.getComputedStyle(sourceElement);
    const cssText = Array.from(computedStyle).reduce((accumulator, propertyName) => {
      return `${accumulator}${propertyName}:${computedStyle.getPropertyValue(propertyName)};`;
    }, "");

    clonedElement.setAttribute("style", cssText);
  });

  // Keep preview styling intact in UI, but remove sheet border in exported PDF.
  clonedRoot.style.border = "none";

  return clonedRoot.outerHTML;
};

const LivePreview = () => {
  const previewModel = useCvStore(selectPreviewViewModel);
  const activeStep = useCvStore((state) => state.activeStep);
  const contactDisplayMode = useCvStore((state) => state.contactDisplayMode);
  const setContactDisplayMode = useCvStore((state) => state.setContactDisplayMode);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const exportRootRef = useRef<HTMLDivElement | null>(null);
  const [isPdfBusy, setIsPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<GeneratedPdfPreview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const sectionSelectorMap: Partial<Record<CvSectionStep, string>> = {
      workExperience: '[data-preview-section="workExperience"]',
      education: '[data-preview-section="education"]',
      skills: '[data-preview-section="skills"]',
      projects: '[data-preview-section="projects"]',
    };

    if (activeStep === "personalInfo") {
      if (typeof viewport.scrollTo === "function") {
        viewport.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        viewport.scrollTop = 0;
      }
      return;
    }

    const selector = sectionSelectorMap[activeStep];
    if (!selector) {
      return;
    }

    const targetSection = viewport.querySelector<HTMLElement>(selector);
    if (!targetSection) {
      return;
    }

    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, [activeStep]);

  const clearPdfPreview = useCallback(() => {
    setPdfPreview((current) => {
      if (current?.blobUrl) {
        window.URL.revokeObjectURL(current.blobUrl);
      }
      return null;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (pdfPreview?.blobUrl) {
        window.URL.revokeObjectURL(pdfPreview.blobUrl);
      }
    };
  }, [pdfPreview]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    clearPdfPreview();
  }, [clearPdfPreview]);

  const handleGeneratePdf = useCallback(async () => {
    setPdfError(null);
    setIsPdfBusy(true);
    clearPdfPreview();

    try {
      const exportRoot = exportRootRef.current;
      if (!exportRoot) {
        throw new Error("Preview container is not ready.");
      }
      const previewCard = exportRoot.closest("aside");
      const mainGrid = previewCard?.parentElement;

      if (mainGrid) {
        mainGrid.setAttribute("data-export-hover", "true");
        await waitForTransitionFrame(240);
      }

      const payload: ExportPdfRequestPayload = {
        viewModel: previewModel,
        snapshotHtml: createInlineStyledSnapshot(exportRoot),
        stylesHtml: serializeDocumentStyles(),
        containerWidthPx: exportRoot.getBoundingClientRect().width,
      };

      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("PDF generation request failed.");
      }

      const pdfBlob = await response.blob();
      const blobUrl = window.URL.createObjectURL(pdfBlob);
      const filename = extractFilename(response.headers.get("content-disposition"));

      setPdfPreview({ blobUrl, filename });
      setIsModalOpen(true);
    } catch {
      setPdfError("Unable to generate PDF preview. Please try again.");
    } finally {
      const exportRoot = exportRootRef.current;
      const previewCard = exportRoot?.closest("aside");
      const mainGrid = previewCard?.parentElement;
      if (mainGrid) {
        mainGrid.removeAttribute("data-export-hover");
      }
      setIsPdfBusy(false);
    }
  }, [clearPdfPreview, previewModel]);

  const handleExport = useCallback(() => {
    if (!pdfPreview) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = pdfPreview.blobUrl;
    anchor.download = pdfPreview.filename;
    anchor.rel = "noopener";
    anchor.click();
    closeModal();
  }, [closeModal, pdfPreview]);

  return (
    <>
      <section className={styles.root} aria-label="Live CV preview">
        <div className={styles.toolbar}>
          <p className={styles.meta}>Live Preview (Minimalist)</p>
          <div className={styles.toolbarActions}>
            <div className={styles.switchGroup} role="group" aria-label="Contact display mode">
              <button
                type="button"
                className={styles.switchButton}
                data-active={contactDisplayMode === "label"}
                onClick={() => setContactDisplayMode("label")}
              >
                Label
              </button>
              <button
                type="button"
                className={styles.switchButton}
                data-active={contactDisplayMode === "icon"}
                onClick={() => setContactDisplayMode("icon")}
              >
                Icon
              </button>
            </div>
            <button
              type="button"
              className={styles.generatePdfButton}
              onClick={() => {
                handleGeneratePdf();
              }}
              disabled={isPdfBusy}
            >
              {isPdfBusy ? "Generating..." : "Generate PDF"}
            </button>
          </div>
        </div>
        {pdfError ? <p className={styles.errorText}>{pdfError}</p> : null}
        <div className={styles.previewViewport} ref={viewportRef}>
          <MinimalistTemplate
            ref={exportRootRef}
            viewModel={previewModel}
            contactDisplayMode={contactDisplayMode}
          />
        </div>
      </section>
      <PdfPreviewModal
        isOpen={isModalOpen}
        pdfUrl={pdfPreview?.blobUrl ?? null}
        onCancel={closeModal}
        onExport={handleExport}
        isBusy={isPdfBusy}
      />
    </>
  );
};

export default LivePreview;
