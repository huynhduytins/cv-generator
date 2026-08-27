import type { CvSectionStep } from "@/types/cv";

export interface SectionNavigationItem {
  key: CvSectionStep;
  label: string;
  description?: string;
  expanded: boolean;
}
