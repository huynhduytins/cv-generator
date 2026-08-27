import type { KeyboardEvent, ReactNode } from "react";

import type { CvSectionStep } from "@/types/cv";

import type { SectionNavigationItem } from "./navigation.types";
import styles from "./FormNavigation.module.css";

interface AccordionNavigatorProps {
  items: SectionNavigationItem[];
  onToggleSection: (section: CvSectionStep) => void;
  renderSectionContent: (section: CvSectionStep) => ReactNode;
}

const handleHeaderKeyDown = (
  event: KeyboardEvent<HTMLButtonElement>,
  onToggle: () => void,
): void => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onToggle();
  }
};

const AccordionNavigator = ({
  items,
  onToggleSection,
  renderSectionContent,
}: AccordionNavigatorProps) => {

  return (
    <div className={styles.accordion} aria-label="CV section editor">
      {items.map((item) => {
        const panelId = `${item.key}-panel`;
        const headerId = `${item.key}-header`;

        return (
          <section
            key={item.key}
            className={styles.accordionItem}
            aria-labelledby={headerId}
          >
            <div className={styles.headerRow}>
              <button
                id={headerId}
                type="button"
                className={styles.headerButton}
                aria-controls={panelId}
                aria-expanded={item.expanded}
                onClick={() => onToggleSection(item.key)}
                onKeyDown={(event) =>
                  handleHeaderKeyDown(event, () => onToggleSection(item.key))
                }
              >
                <span>{item.label}</span>
                {item.validationState ? (
                  <span
                    className={styles.badge}
                    data-state={item.validationState}
                  >
                    {item.validationState}
                  </span>
                ) : null}
              </button>
            </div>

            {item.description ? (
              <p className={styles.description}>{item.description}</p>
            ) : null}

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={styles.panelWrapper}
              data-expanded={item.expanded}
            >
              <div className={styles.panelInner}>
                {renderSectionContent(item.key)}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default AccordionNavigator;
