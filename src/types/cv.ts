import type { DateRange, Id, ISODate, Nullable } from "./common";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface WorkExperience {
  id: Id;
  company: string;
  role: string;
  location: string;
  dateRange: DateRange;
  summary: string;
  highlights: string[];
}

export interface Education {
  id: Id;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  gpa: string;
  location: string;
  dateRange: DateRange;
  description: string;
}

export interface Skill {
  id: Id;
  name: string;
  level: SkillLevel;
  category: string;
  yearsOfExperience: Nullable<number>;
}

export interface Project {
  id: Id;
  name: string;
  role: string;
  url: string;
  repositoryUrl: string;
  dateRange: DateRange;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface CvDocument {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  updatedAt: ISODate;
}

export type CvSectionStep =
  | "personalInfo"
  | "workExperience"
  | "education"
  | "skills"
  | "projects";

export const CV_SECTION_ORDER: CvSectionStep[] = [
  "personalInfo",
  "workExperience",
  "education",
  "skills",
  "projects",
];

export const CV_SECTION_LABELS: Record<CvSectionStep, string> = {
  personalInfo: "Personal Info",
  workExperience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
};

export const CV_SCHEMA_VERSION = 1;

export const EMPTY_PERSONAL_INFO: PersonalInfo = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  github: "",
  summary: "",
};

export const createEmptyDateRange = (): DateRange => ({
  startDate: "" as ISODate,
  endDate: null,
  isPresent: false,
});

export const createEmptyCvDocument = (): CvDocument => ({
  personalInfo: { ...EMPTY_PERSONAL_INFO },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  updatedAt: new Date().toISOString() as ISODate,
});

export const createEmptyWorkExperience = (id: Id): WorkExperience => ({
  id,
  company: "",
  role: "",
  location: "",
  dateRange: createEmptyDateRange(),
  summary: "",
  highlights: [],
});

export const createEmptyEducation = (id: Id): Education => ({
  id,
  institution: "",
  degree: "",
  fieldOfStudy: "",
  gpa: "",
  location: "",
  dateRange: createEmptyDateRange(),
  description: "",
});

export const createEmptySkill = (id: Id): Skill => ({
  id,
  name: "",
  level: "intermediate",
  category: "",
  yearsOfExperience: null,
});

export const createEmptyProject = (id: Id): Project => ({
  id,
  name: "",
  role: "",
  url: "",
  repositoryUrl: "",
  dateRange: createEmptyDateRange(),
  description: "",
  highlights: [],
  technologies: [],
});
