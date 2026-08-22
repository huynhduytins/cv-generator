import type { CvDocument, CvSectionStep, Education, Project, Skill, WorkExperience } from "@/types/cv";

export interface PreviewContactItem {
  key: "email" | "phone" | "location" | "website" | "linkedin" | "github";
  label: string;
  value: string;
  href?: string;
}

export interface PreviewWorkExperienceItem {
  id: WorkExperience["id"];
  company: string;
  role: string;
  location: string;
  periodLabel: string;
  summary: string;
  highlights: string[];
}

export interface PreviewEducationItem {
  id: Education["id"];
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  periodLabel: string;
  description: string;
}

export interface PreviewSkillItem {
  id: Skill["id"];
  name: string;
  level: Skill["level"];
  category: string;
  yearsOfExperience: Skill["yearsOfExperience"];
}

export interface PreviewProjectItem {
  id: Project["id"];
  name: string;
  role: string;
  url: string;
  repositoryUrl: string;
  periodLabel: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface CvPreviewViewModel {
  identity: {
    fullName: string;
    headline: string;
    summary: string;
    contacts: PreviewContactItem[];
  };
  workExperience: PreviewWorkExperienceItem[];
  education: PreviewEducationItem[];
  skills: PreviewSkillItem[];
  projects: PreviewProjectItem[];
  visibleSections: CvSectionStep[];
  updatedAt: string;
}

const formatDateLabel = (rawDate: string): string => {
  if (!rawDate) {
    return "";
  }

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return rawDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
};

const buildPeriodLabel = (
  startDate: string,
  endDate: string | null,
  isPresent: boolean,
): string => {
  const startLabel = formatDateLabel(startDate);
  const endLabel = isPresent ? "Present" : formatDateLabel(endDate ?? "");

  if (!startLabel && !endLabel) {
    return "";
  }

  if (!startLabel) {
    return endLabel;
  }

  if (!endLabel) {
    return startLabel;
  }

  return `${startLabel} - ${endLabel}`;
};

const toLinkIfNeeded = (key: PreviewContactItem["key"], value: string): string | undefined => {
  if (!value.trim()) {
    return undefined;
  }

  if (key === "email") {
    return `mailto:${value}`;
  }

  if (key === "phone") {
    return `tel:${value}`;
  }

  if (key === "website" || key === "linkedin" || key === "github") {
    let prefix = key === 'website' || value.includes(`${key}.com`) ? '' : `${key}.com/`
    return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${prefix + value}`;
  }

  return undefined;
};

const compact = <T>(items: Array<T | null>): T[] => {
  return items.filter((item): item is T => item !== null);
};

const mapContacts = (document: CvDocument): PreviewContactItem[] => {
  const source = document.personalInfo;

  return compact<PreviewContactItem>([
    source.location.trim()
      ? {
        key: "location",
        label: "Location",
        value: source.location.trim(),
      }
      : null,
    source.email.trim()
      ? {
        key: "email",
        label: "Email",
        value: source.email.trim(),
        href: toLinkIfNeeded("email", source.email.trim()),
      }
      : null,
    source.phone.trim()
      ? {
        key: "phone",
        label: "Phone",
        value: source.phone.trim(),
        href: toLinkIfNeeded("phone", source.phone.trim()),
      }
      : null,
    source.website.trim()
      ? {
        key: "website",
        label: "Website",
        value: source.website.trim(),
        href: toLinkIfNeeded("website", source.website.trim()),
      }
      : null,
    source.github.trim()
      ? {
        key: "github",
        label: "GitHub",
        value: source.github.trim(),
        href: toLinkIfNeeded("github", source.github.trim()),
      }
      : null,
    source.linkedin.trim()
      ? {
        key: "linkedin",
        label: "LinkedIn",
        value: source.linkedin.trim(),
        href: toLinkIfNeeded("linkedin", source.linkedin.trim()),
      }
      : null,
  ]);
};

export const mapCvToPreview = (document: CvDocument): CvPreviewViewModel => {
  const mappedWork = document.workExperience.map((item) => ({
    id: item.id,
    company: item.company.trim(),
    role: item.role.trim(),
    location: item.location.trim(),
    periodLabel: buildPeriodLabel(item.dateRange.startDate, item.dateRange.endDate, item.dateRange.isPresent),
    summary: item.summary.trim(),
    highlights: item.highlights.map((entry) => entry.trim()).filter(Boolean),
  }));

  const mappedEducation = document.education.map((item) => ({
    id: item.id,
    institution: item.institution.trim(),
    degree: item.degree.trim(),
    fieldOfStudy: item.fieldOfStudy.trim(),
    location: item.location.trim(),
    periodLabel: buildPeriodLabel(item.dateRange.startDate, item.dateRange.endDate, item.dateRange.isPresent),
    description: item.description.trim(),
  }));

  const mappedProjects = document.projects.map((item) => ({
    id: item.id,
    name: item.name.trim(),
    role: item.role.trim(),
    url: item.url.trim(),
    repositoryUrl: item.repositoryUrl.trim(),
    periodLabel: buildPeriodLabel(item.dateRange.startDate, item.dateRange.endDate, item.dateRange.isPresent),
    description: item.description.trim(),
    highlights: item.highlights.map((entry) => entry.trim()).filter(Boolean),
    technologies: item.technologies.map((entry) => entry.trim()).filter(Boolean),
  }));

  const mappedSkills = document.skills.map((item) => ({
    id: item.id,
    name: item.name.trim(),
    level: item.level,
    category: item.category.trim(),
    yearsOfExperience: item.yearsOfExperience,
  }));

  const visibleSections: CvSectionStep[] = compact<CvSectionStep>([
    mappedWork.length > 0 ? "workExperience" : null,
    mappedEducation.length > 0 ? "education" : null,
    mappedSkills.length > 0 ? "skills" : null,
    mappedProjects.length > 0 ? "projects" : null,
  ]);

  return {
    identity: {
      fullName: document.personalInfo.fullName.trim() || "Your Name",
      headline: document.personalInfo.headline.trim(),
      summary: document.personalInfo.summary.trim(),
      contacts: mapContacts(document),
    },
    workExperience: mappedWork,
    education: mappedEducation,
    skills: mappedSkills,
    projects: mappedProjects,
    visibleSections,
    updatedAt: document.updatedAt,
  };
};
