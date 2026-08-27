import { forwardRef } from "react";
import type { CvPreviewViewModel } from "@/lib/mappers/cv-to-preview";
import type { ContactDisplayMode } from "@/store/slices/uiSlice";

import SectionBlock from "../shared/SectionBlock";
import TemplateHeader from "../shared/TemplateHeader";
import TimelineEntry from "../shared/TimelineEntry";
import RichTextBlock from "../shared/RichTextBlock";
import styles from "../shared/TemplatePrimitives.module.css";

interface MinimalistTemplateProps {
  viewModel: CvPreviewViewModel;
  contactDisplayMode: ContactDisplayMode;
}

interface SkillCategoryGroup {
  category: string;
  skills: string[];
}

const splitSkillNames = (rawNames: string): string[] => {
  return rawNames
    .split(/[\n,]+/)
    .map((token) => token.trim())
    .filter(Boolean);
};

const normalizeExternalUrl = (rawUrl: string): string | undefined => {
  const normalized = rawUrl.trim();
  if (!normalized) {
    return undefined;
  }

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  return `https://${normalized}`;
};

const toDisplayCategory = (rawCategory: string): string => {
  const normalized = rawCategory.trim();
  if (!normalized) {
    return "Category";
  }

  return normalized
    .split(/\s+/)
    .map(
      (token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase(),
    )
    .join(" ");
};

const groupSkillsByCategory = (
  skills: CvPreviewViewModel["skills"],
): SkillCategoryGroup[] => {
  const groupsMap = new Map<string, string[]>();

  skills.forEach((item) => {
    const displayCategory = toDisplayCategory(item.category);
    const parsedNames = splitSkillNames(item.name);
    const skillNames = parsedNames.length > 0 ? parsedNames : ["Skill"];
    const existing = groupsMap.get(displayCategory);
    if (existing) {
      existing.push(...skillNames);
      return;
    }

    groupsMap.set(displayCategory, skillNames);
  });

  return Array.from(groupsMap.entries()).map(([category, groupedSkills]) => ({
    category,
    skills: groupedSkills,
  }));
};

const MinimalistTemplate = forwardRef<HTMLElement, MinimalistTemplateProps>(
  ({ viewModel, contactDisplayMode }, ref) => {
    const { identity } = viewModel;
    const groupedSkills = groupSkillsByCategory(viewModel.skills);

    return (
      <article
        ref={ref}
        className={styles.sheet}
        data-template="minimalist"
        data-export-preview-root
      >
        <TemplateHeader
          fullName={identity.fullName}
          headline={identity.headline}
          contacts={identity.contacts}
          contactDisplayMode={contactDisplayMode}
        />

        {identity.summary ? (
          <SectionBlock title="Summary">
            <RichTextBlock
              text={identity.summary}
              className={styles.timelineBody}
            />
          </SectionBlock>
        ) : null}

        {viewModel.workExperience.length > 0 ? (
          <SectionBlock title="Work Experience" sectionKey="workExperience">
            {viewModel.workExperience.map((item) => (
              <TimelineEntry
                key={item.id}
                title={item.company || "Company"}
                secondaryLine={item.role || undefined}
                secondaryLineItalic
                meta={[item.location, item.periodLabel]
                  .filter(Boolean)
                  .join(" | ")}
                body={item.summary}
                bullets={item.highlights}
              />
            ))}
          </SectionBlock>
        ) : null}

        {viewModel.education.length > 0 ? (
          <SectionBlock title="Education" sectionKey="education">
            {viewModel.education.map((item) => {
              const educationCore = [item.degree, item.fieldOfStudy]
                .filter(Boolean)
                .join(". ");
              const gpa = item.gpa ? `GPA: ${item.gpa}` : "";
              const educationMetaSecondary = educationCore;

              return (
                <TimelineEntry
                  key={item.id}
                  title={item.institution || "Institution"}
                  meta={[item.periodLabel, item.location]
                    .filter(Boolean)
                    .join(" / ")}
                  metaSecondary={educationMetaSecondary || undefined}
                  metaSecondaryItalic
                  gpa={gpa}
                  body={item.description}
                />
              );
            })}
          </SectionBlock>
        ) : null}

        {viewModel.skills.length > 0 ? (
          <SectionBlock title="Skills" sectionKey="skills">
            <div className={styles.skillsLayout}>
              {groupedSkills.map((group) => (
                <p key={group.category} className={styles.skillsLine}>
                  <span className={styles.skillsCategory}>
                    {group.category}:
                  </span>{" "}
                  <span className={styles.skillsValues}>
                    {group.skills.join(", ")}
                  </span>
                </p>
              ))}
            </div>
          </SectionBlock>
        ) : null}

        {viewModel.projects.length > 0 ? (
          <SectionBlock title="Projects" sectionKey="projects">
            <div className={styles.projectsList}>
              {viewModel.projects.map((item) => {
                const projectName = item.name || "Project";
                const technologiesLabel = item.technologies.join(", ");
                const projectUrl = normalizeExternalUrl(item.url);

                return (
                  <article key={item.id} className={styles.projectRow}>
                    <div className={styles.projectMain}>
                      {projectUrl ? (
                        <a
                          className={`${styles.timelineTitle} ${styles.href}`.trim()}
                          href={projectUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {projectName}
                        </a>
                      ) : (
                        <span className={styles.timelineTitle}>{projectName}</span>
                      )}
                      {technologiesLabel ? (
                        <>
                          <span className={styles.projectDivider}>|</span>
                          <span className={styles.projectTechnologies}>
                            {technologiesLabel}
                          </span>
                        </>
                      ) : null}
                    </div>
                    {item.periodLabel ? (
                      <span className={styles.timelineMeta}>{item.periodLabel}</span>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </SectionBlock>
        ) : null}
      </article>
    );
  },
);

MinimalistTemplate.displayName = "MinimalistTemplate";

export default MinimalistTemplate;
