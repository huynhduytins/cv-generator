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
  technologies: string;
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

export const CV_SCHEMA_VERSION = 3;

const PERSONAL_INFO_DEFAULT: PersonalInfo = {
  fullName: "Huynh Duy Tin",
  headline: "Fullstack Engineer - Strong Frontend",
  email: "hduytins@gmail.com",
  phone: "0981458192",
  location: "Da Nang",
  website: "duytin.works",
  linkedin: "in/hduytins",
  github: "huynhduytins",
  summary: "**Fullstack Engineer (Strong Frontend)** with **3+ years of experience** building high-performance, enterprise-scale web applications. Deep mastery of the **modern React ecosystem** (Next.js, TypeScript), large-scale frontend architecture (**Nx Monorepos**), and heavy client-side computing (**Web Workers**). Proficient in backend development with **Node.js/NestJS** and **GraphQL** to deliver end-to-end, type-safe solutions in global agile environments."
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
    summary: "* Architected and maintained an **Nx monorepo (47 projects)**, standardizing CI/CD pipelines and **boosting delivery efficiency by 30%**.\n* Optimized heavy data processing using **Web Workers**, eliminating UI thread blocking during multi-level valuation calculations on **10,000+ records**.\n* Implemented a multi-endpoint GraphQL layer using **Apollo and NestJS**, achieving **100% end-to-end type safety** via module-based code generation.\n* Built complex enterprise modules: a real-time **Notification Center** and an advanced **Grid UI framework** with validation and safe **Excel-paste handling**.\n* Partnered with a cross-cultural team (Australian BAs/Indian QAs) to deliver a **high-scale enterprise platform** for **Acciona**, meeting strict global quality standards.",
    technologies: "ReactJS, Nx Monorepo, NestJS, AWS, Docker, GraphQL/Apollo, Jest, Sentry, Circle CI.",
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
    summary: "* Boosted **page load speed by 35%** and improved organic traffic by converting internal **MeteorJS app to NextJS** with optimized **SSR and SEO setup**.\n* Integrated **Google Analytics 4** tracking frameworks to capture key user behavioral data, empowering the product team with **data-driven insights**.",
    technologies: "ReactJS, NextJS, NodeJS, Typescript, MongoDB, Jest, Cypress.",
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
    summary: "* Collaborated with **cross-functional Korean engineering teams** to develop a **high-reliability banking transaction platform** using **React** and **TypeScript**, accelerating transaction tracking efficiency.\n* Integrated **Storybook** to build a modular UI component library, achieving a **20% improvement in development timelines** across the team.",
    technologies: "ReactJS, Redux, React Query, Storybook, Typescript, Jest.",
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
    gpa: ""
  }
];

const SKILLS_DEFAULT: Skill[] = [
  {
    id: "8e92f870-f3a0-4474-bb5f-e51e9654afa6" as Id,
    name: "JavaScript (ES6+), TypeScript, ReactJS, NextJS, Redux, Zustand, React Query, Web Workers, HTML5/CSS3.",
    category: "Frontend"
  },
  {
    id: "8c45eb8e-94c2-4ae8-ad62-865e0763c291" as Id,
    name: "Node.js, NestJS, GraphQL (Apollo), RESTful APIs, MongoDB.",
    category: "Backend"
  },
  {
    id: "639cf593-b1f8-4873-aa39-e01aff2eced5" as Id,
    name: "AWS, Docker, CircleCI, Nx Monorepo, Webpack, CI/CD.",
    category: "Tools"
  },
  {
    id: "3a38ef39-9e6a-4f66-9b6b-f51b9f858f1e" as Id,
    name: "English (Professional working proficiency)",
    category: "Languages"
  }
];

const PROJECTS_DEFAULT: Project[] = [
  {
    id: "5528d832-c943-431f-82a0-4a64078e5b6e" as Id,
    name: "CV Generator",
    role: "",
    url: "cv-generator.duytin.works/",
    dateRange: {
      startDate: "" as ISODate, // Empty strings cast as ISODate to match your pattern if dates are missing
      endDate: null,
      isPresent: false
    },
    description: "* Developed a client-side AI writing assistant using **Transformers.js** and **Web Workers**\n* Built privacy-focused resume generation with real-time live preview, state management via Zustand, and instant PDF export.",
    highlights: [],
    technologies: [
      "Nextjs",
      "Web Workers",
      "Transformers.js",
      "Zustand"
    ]
  },
  {
    id: "a77cf5e5-6c72-4f5f-bf3e-f2d47a87adf8" as Id,
    name: "Finding Ball",
    role: "",
    url: "https://game-with-small-viewport-modal.vercel.app/",
    dateRange: {
      startDate: "" as ISODate,
      endDate: null,
      isPresent: false
    },
    description: "* A game with complex state transitions and component lifecycles within a responsive, modal-based viewport.",
    highlights: [],
    technologies: [
      "React",
      "React Aria",
      "Framer Motion"
    ]
  },
];

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
  technologies: "",
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
