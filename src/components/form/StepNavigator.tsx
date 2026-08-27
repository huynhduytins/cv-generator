import type { CvSectionStep } from "@/types/cv";

import type { SectionNavigationItem } from "./navigation.types";
import styles from "./FormNavigation.module.css";

interface StepNavigatorProps {
  items: SectionNavigationItem[];
  activeStep: CvSectionStep;
  onChangeStep: (step: CvSectionStep) => void;
}

const StepNavigator = ({
  items,
  activeStep,
  onChangeStep,
}: StepNavigatorProps) => {
  return (
    <nav className={styles.stepNav} aria-label="CV step navigator">
      {items.map((item, index) => {
        const isActive = item.key === activeStep;

        return (
          <button
            key={item.key}
            type="button"
            className={styles.stepButton}
            data-active={isActive}
            onClick={() => onChangeStep(item.key)}
            aria-current={isActive ? "step" : undefined}
          >
            <span className={styles.stepIndex}>{index + 1}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default StepNavigator;
