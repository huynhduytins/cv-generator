import { useEffect, useRef } from "react";

import { useCvStore } from "@/store/cv-store";
import { selectPreviewViewModel } from "@/store/selectors/preview-selectors";
import type { CvSectionStep } from "@/types/cv";

import MinimalistTemplate from "../templates/minimalist/MinimalistTemplate";
import styles from "./LivePreview.module.css";

const LivePreview = () => {
  const previewModel = useCvStore(selectPreviewViewModel);
  const activeStep = useCvStore((state) => state.activeStep);
  const contactDisplayMode = useCvStore((state) => state.contactDisplayMode);
  const setContactDisplayMode = useCvStore((state) => state.setContactDisplayMode);
  const viewportRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <section className={styles.root} aria-label="Live CV preview">
      <div className={styles.toolbar}>
        <p className={styles.meta}>Live Preview (Minimalist)</p>
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
      </div>
      <div className={styles.previewViewport} ref={viewportRef}>
        <MinimalistTemplate viewModel={previewModel} contactDisplayMode={contactDisplayMode} />
      </div>
    </section>
  );
};

export default LivePreview;
