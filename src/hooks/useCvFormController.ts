import { useMemo } from "react";

import { createId } from "@/lib/create-id";
import {
  type CvDocument,
  createEmptyEducation,
  createEmptyProject,
  createEmptySkill,
  createEmptyWorkExperience,
  CV_SECTION_LABELS,
  CV_SECTION_ORDER,
} from "@/types/cv";
import type {
  CvSectionStep,
  Education,
  PersonalInfo,
  Project,
  Skill,
  WorkExperience,
} from "@/types/cv";
import type { DeepPartial, Id, ISODate } from "@/types/common";

import { useCvStore } from "../store/cv-store";

export interface CvFormController {
  document: CvDocument;
  activeStep: CvSectionStep;
  expandedSections: Record<CvSectionStep, boolean>;
  lastSavedAt: ISODate | null;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  sectionItems: { key: CvSectionStep; label: string; expanded: boolean }[];
  setActiveStep: (step: CvSectionStep) => void;
  setSectionExpanded: (section: CvSectionStep, expanded: boolean) => void;
  toggleSectionExpanded: (section: CvSectionStep) => void;
  updatePersonalInfo: (changes: DeepPartial<PersonalInfo>) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (id: Id, changes: DeepPartial<WorkExperience>) => void;
  removeWorkExperience: (id: Id) => void;
  reorderWorkExperience: (fromIndex: number, toIndex: number) => void;
  addEducation: () => void;
  updateEducation: (id: Id, changes: DeepPartial<Education>) => void;
  removeEducation: (id: Id) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;
  addSkill: () => void;
  updateSkill: (id: Id, changes: DeepPartial<Skill>) => void;
  removeSkill: (id: Id) => void;
  reorderSkill: (fromIndex: number, toIndex: number) => void;
  addProject: () => void;
  updateProject: (id: Id, changes: DeepPartial<Project>) => void;
  removeProject: (id: Id) => void;
  reorderProject: (fromIndex: number, toIndex: number) => void;
}

export const useCvFormController = (): CvFormController => {
  const activeStep = useCvStore((state) => state.activeStep);
  const expandedSections = useCvStore((state) => state.expandedSections);
  const lastSavedAt = useCvStore((state) => state.lastSavedAt);

  const personalInfo = useCvStore((state) => state.document.personalInfo);
  const document = useCvStore((state) => state.document);
  const workExperience = useCvStore((state) => state.document.workExperience);
  const education = useCvStore((state) => state.document.education);
  const skills = useCvStore((state) => state.document.skills);
  const projects = useCvStore((state) => state.document.projects);

  console.log({ document, personalInfo })

  const setActiveStep = useCvStore((state) => state.setActiveStep);
  const setSectionExpanded = useCvStore((state) => state.setSectionExpanded);
  const toggleSectionExpanded = useCvStore(
    (state) => state.toggleSectionExpanded,
  );

  const setPersonalInfo = useCvStore((state) => state.setPersonalInfo);
  const addSectionItem = useCvStore((state) => state.addSectionItem);
  const updateSectionItem = useCvStore((state) => state.updateSectionItem);
  const removeSectionItem = useCvStore((state) => state.removeSectionItem);
  const reorderSectionItems = useCvStore((state) => state.reorderSectionItems);

  const sectionItems = useMemo(
    () =>
      CV_SECTION_ORDER.map((key) => ({
        key,
        label: CV_SECTION_LABELS[key],
        expanded: expandedSections[key],
      })),
    [expandedSections],
  );

  return {
    document,
    activeStep,
    expandedSections,
    lastSavedAt,
    personalInfo,
    workExperience,
    education,
    skills,
    projects,
    sectionItems,
    setActiveStep,
    setSectionExpanded,
    toggleSectionExpanded,
    updatePersonalInfo: (changes) => {
      setPersonalInfo(changes);
    },
    addWorkExperience: () => {
      addSectionItem("workExperience", createEmptyWorkExperience(createId()));
    },
    updateWorkExperience: (id, changes) => {
      updateSectionItem("workExperience", id, changes);
    },
    removeWorkExperience: (id) => {
      removeSectionItem("workExperience", id);
    },
    reorderWorkExperience: (fromIndex, toIndex) => {
      reorderSectionItems("workExperience", fromIndex, toIndex);
    },
    addEducation: () => {
      addSectionItem("education", createEmptyEducation(createId()));
    },
    updateEducation: (id, changes) => {
      updateSectionItem("education", id, changes);
    },
    removeEducation: (id) => {
      removeSectionItem("education", id);
    },
    reorderEducation: (fromIndex, toIndex) => {
      reorderSectionItems("education", fromIndex, toIndex);
    },
    addSkill: () => {
      addSectionItem("skills", createEmptySkill(createId()));
    },
    updateSkill: (id, changes) => {
      updateSectionItem("skills", id, changes);
    },
    removeSkill: (id) => {
      removeSectionItem("skills", id);
    },
    reorderSkill: (fromIndex, toIndex) => {
      reorderSectionItems("skills", fromIndex, toIndex);
    },
    addProject: () => {
      addSectionItem("projects", createEmptyProject(createId()));
    },
    updateProject: (id, changes) => {
      updateSectionItem("projects", id, changes);
    },
    removeProject: (id) => {
      removeSectionItem("projects", id);
    },
    reorderProject: (fromIndex, toIndex) => {
      reorderSectionItems("projects", fromIndex, toIndex);
    },
  };
};
