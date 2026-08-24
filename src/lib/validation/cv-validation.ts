import type { CvDocument, CvSectionStep, PersonalInfo } from "@/types/cv";

type FieldErrors<T> = Partial<Record<keyof T, string>>;

export interface CvValidationResult {
  personalInfoErrors: FieldErrors<PersonalInfo>;
  sectionStates: Record<CvSectionStep, "idle" | "valid" | "invalid">;
}

const validatePersonalInfo = (
  value: PersonalInfo,
): FieldErrors<PersonalInfo> => {
  void value;
  return {};
};

const hasErrors = <T extends Record<string, string | undefined>>(
  errors: T,
): boolean => Object.values(errors).some((value) => Boolean(value));

export const validateCvDocument = (
  document: CvDocument,
): CvValidationResult => {
  const personalInfoErrors = validatePersonalInfo(document.personalInfo);

  return {
    personalInfoErrors,
    sectionStates: {
      personalInfo: hasErrors(personalInfoErrors) ? "invalid" : "idle",
      workExperience: document.workExperience.length > 0 ? "valid" : "idle",
      education: document.education.length > 0 ? "valid" : "idle",
      skills: document.skills.length > 0 ? "valid" : "idle",
      projects: document.projects.length > 0 ? "valid" : "idle",
    },
  };
};
