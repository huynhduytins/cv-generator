import type { DateRange, Id, ISODate } from "./common";

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
  category: string;
}

export interface Project {
  id: Id;
  name: string;
  role: string;
  url: string;
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
  "personalInfo" | "workExperience" | "education" | "skills" | "projects";

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

export const CV_SCHEMA_VERSION = 2;

const PERSONAL_INFO_DEFAULT: PersonalInfo = {
  fullName: "Huynh Duy Tin",
  headline: "Senior Fullstack Engineer",
  email: "hduytins@gmail.com",
  phone: "0981458192",
  location: "Da Nang",
  website: "duytin.works",
  linkedin: "in/hduytins",
  github: "huynhduytins",
  summary: "**Fullstack Engineer** with over 3 years of experience building high-performance, enterprise-scale web applications. Deep expertise in the modern React ecosystem (NextJS, ReactJS, Redux, React Query), Node.js/NestJS, web accessibility (a11y), and robust architectures like Nx Monorepos. Strong advocate for system optimization, production observability, and clean code. Passionate about modular design patterns and delivering seamless user experiences in agile, cross-cultural environments."
};

const WORK_EXPERIENCE_DEFAULT: WorkExperience[] = [
  {
    id: "dc4d2d21-97bf-4eee-b097-4075df29272b" as Id,
    company: "Enouvo IT Solutions",
    role: "Fullstack Engineer",
    location: "Da Nang",
    dateRange: {
      startDate: "2025-01-06" as ISODate,
      endDate: null,
      isPresent: true
    },
    summary: "* Collaborated in an **agile**, cross-cultural team (with Australian BAs and Indian QAs) to deliver a **high-scale** enterprise platform for **Acciona** (a global leader in sustainable infrastructure), aligning technical execution with strict quality standards.\n* Architected and maintained an **Nx monorepo** housing **47 projects**, standardizing **CI/CD pipelines** and boosting cross-team delivery efficiency by **30%**.\n* Engineered an enterprise **Notification Center** featuring real-time **read/unread states**, **priority queues**, and **deep-link** navigation routing across modules.\n* Enhanced a complex internal **Grid framework** for finance/construction workflows, including editable cells, context menus, validation, infinite scroll, and Excel paste safeguards.\n* Optimized heavy data processing using **Web Workers**, eliminating UI thread blocking during multi-level valuation calculations on large datasets (10,000+ records).\n* Implemented a multi-endpoint **GraphQL layer** using **Apollo**, **NestJS**, and **module-based code generation**, achieving **100%** end-to-end type safety and significantly minimizing integration bugs.",
    highlights: []
  },
  {
    id: "02fc2cf8-6f64-424d-9764-24c25c3cec44" as Id,
    company: "bTaskee Co., Ltd",
    role: "Fullstack Engineer",
    location: "Ho Chi Minh",
    dateRange: {
      startDate: "2024-06-22" as ISODate,
      endDate: "2025-01-22" as ISODate,
      isPresent: false
    },
    summary: "* Implemented new features and enhancements on the company's website, resulting in a **30%** increase in user experience.\n* Transformed the company's internal projects from MeteorJS to NextJS and set up from scratch, building pages, configuring **Webpack**, and optimizing the company's website **SEO**.\n* Assisted the product team in configuring and collecting data about user activities with Google Analytics 4.",
    highlights: []
  },
  {
    id: "630d3e93-7f75-4070-a42e-39bd9bf2a987" as Id,
    company: "Shinhan DS",
    role: "Frontend Engineer",
    location: "Ho Chi Minh",
    dateRange: {
      startDate: "2022-12-22" as ISODate,
      endDate: "2024-06-22" as ISODate,
      isPresent: false
    },
    summary: "* Developed a banking transaction management platform that streamlined transaction tracking and status monitoring for Shinhan Bank.\n* Collaborated with the Korean team to develop new product features.\n* Enhanced the development process by integrating a frontend workshop for building UI components, Storybook, resulting in a **20%** improvement in the development timeline.",
    highlights: []
  }
];

const EDUCATION_DEFAULT: Education[] = [
  {
    id: "e9bc1025-6f85-48d3-a2b6-b2fa0b5de126" as Id,
    institution: "Ho Chi Minh City University of Science (HCMUS)",
    degree: "Bachelor",
    fieldOfStudy: "Electronics and Communications Engineering",
    location: "",
    dateRange: {
      startDate: "2019-09-22" as ISODate,
      endDate: "2023-09-22" as ISODate,
      isPresent: false
    },
    description: "",
    gpa: "7.92/10"
  }
]

const SKILLS_DEFAULT: Skill[] = [
  {
    id: "8e92f870-f3a0-4474-bb5f-e51e9654afa6" as Id,
    name: "JavaScript, TypeScript, ReactJS, NextJS, RemixJS, Redux, HTML/CSS.",
    category: "Frontend"
  },
  {
    id: "8c45eb8e-94c2-4ae8-ad62-865e0763c291" as Id,
    name: "NestJS, NodeJS, MongoDB, GraphQL/Apollo",
    category: "Backend"
  },
  {
    id: "639cf593-b1f8-4873-aa39-e01aff2eced5" as Id,
    name: "AWS, Docker, Circle CI, Nx Monorepo, Jira.",
    category: "Tools"
  },
  {
    id: "3a38ef39-9e6a-4f66-9b6b-f51b9f858f1e" as Id,
    name: "English (Professional working proficiency)",
    category: "Languages"
  }
]

const PROJECTS_DEFAULT: Project[] = []

const createEmptyDateRange = (): DateRange => ({
  startDate: "" as ISODate,
  endDate: null,
  isPresent: false,
});

export const createEmptyCvDocument = (): CvDocument => ({
  personalInfo: { ...PERSONAL_INFO_DEFAULT },
  workExperience: [...WORK_EXPERIENCE_DEFAULT],
  education: [...EDUCATION_DEFAULT],
  skills: [...SKILLS_DEFAULT],
  projects: [...PROJECTS_DEFAULT],
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
  category: "",
});

export const createEmptyProject = (id: Id): Project => ({
  id,
  name: "",
  role: "",
  url: "",
  dateRange: createEmptyDateRange(),
  description: "",
  highlights: [],
  technologies: [],
});
