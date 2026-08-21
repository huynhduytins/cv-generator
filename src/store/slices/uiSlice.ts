import type { StateCreator } from "zustand";

import { CV_SECTION_ORDER, type CvSectionStep } from "../../types/cv";

import type { CvStore } from "../cv-store";

export interface UiSlice {
  activeStep: CvSectionStep;
  expandedSections: Record<CvSectionStep, boolean>;
  setActiveStep: (step: CvSectionStep) => void;
  setSectionExpanded: (section: CvSectionStep, expanded: boolean) => void;
  toggleSectionExpanded: (section: CvSectionStep) => void;
  resetUiState: () => void;
}

const defaultExpandedSections: Record<CvSectionStep, boolean> = {
  personalInfo: true,
  workExperience: false,
  education: false,
  skills: false,
  projects: false,
};

const getExclusiveExpandedSections = (
  activeSection: CvSectionStep,
): Record<CvSectionStep, boolean> => {
  return CV_SECTION_ORDER.reduce<Record<CvSectionStep, boolean>>(
    (accumulator, section) => {
      accumulator[section] = section === activeSection;
      return accumulator;
    },
    {
      personalInfo: false,
      workExperience: false,
      education: false,
      skills: false,
      projects: false,
    },
  );
};

export const createUiSlice: StateCreator<
  CvStore,
  [["zustand/persist", unknown]],
  [],
  UiSlice
> = (set) => ({
  activeStep: "personalInfo",
  expandedSections: { ...defaultExpandedSections },
  setActiveStep: (step) => {
    set({
      activeStep: step,
      expandedSections: getExclusiveExpandedSections(step),
    });
  },
  setSectionExpanded: (section, expanded) => {
    if (!expanded) {
      return;
    }

    set({
      activeStep: section,
      expandedSections: getExclusiveExpandedSections(section),
    });
  },
  toggleSectionExpanded: (section) => {
    set({
      activeStep: section,
      expandedSections: getExclusiveExpandedSections(section),
    });
  },
  resetUiState: () => {
    set({
      activeStep: "personalInfo",
      expandedSections: { ...defaultExpandedSections },
    });
  },
});
