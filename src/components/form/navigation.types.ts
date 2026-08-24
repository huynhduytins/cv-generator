import type { CvSectionStep } from "@/types/cv";

type SectionValidationState = "idle" | "valid" | "invalid";

export interface SectionNavigationItem {
  key: CvSectionStep;
  label: string;
  description?: string;
  expanded: boolean;
  validationState?: SectionValidationState;
}
