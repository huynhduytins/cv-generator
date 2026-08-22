import type { CvPreviewViewModel } from "@/lib/mappers/cv-to-preview";
import type { ContactDisplayMode } from "@/store/slices/uiSlice";

import SectionBlock from "../shared/SectionBlock";
import TagList from "../shared/TagList";
import TemplateHeader from "../shared/TemplateHeader";
import TimelineEntry from "../shared/TimelineEntry";
import RichTextBlock from "../shared/RichTextBlock";
import styles from "../shared/TemplatePrimitives.module.css";

interface MinimalistTemplateProps {
  viewModel: CvPreviewViewModel;
  contactDisplayMode: ContactDisplayMode;
}

const MinimalistTemplate = ({ viewModel, contactDisplayMode }: MinimalistTemplateProps) => {
  const { identity } = viewModel;

  return (
    <article className={styles.sheet} data-template="minimalist">
      <TemplateHeader
        fullName={identity.fullName}
        headline={identity.headline}
        contacts={identity.contacts}
        contactDisplayMode={contactDisplayMode}
      />

      {identity.summary ? (
        <SectionBlock title="Summary">
          <RichTextBlock text={identity.summary} className={styles.timelineBody} />
        </SectionBlock>
      ) : null}

      {viewModel.workExperience.length > 0 ? (
        <SectionBlock title="Work Experience">
          {viewModel.workExperience.map((item) => (
            <TimelineEntry
              key={item.id}
              title={item.company || "Company"}
              secondaryLine={item.role || undefined}
              secondaryLineItalic
              meta={[item.location, item.periodLabel].filter(Boolean).join(" | ")}
              body={item.summary}
              bullets={item.highlights}
            />
          ))}
        </SectionBlock>
      ) : null}

      {viewModel.education.length > 0 ? (
        <SectionBlock title="Education">
          {viewModel.education.map((item) => {
            const educationCore = [item.degree, item.fieldOfStudy]
              .filter(Boolean)
              .join(". ");
            const gpa = item.gpa ? `GPA: ${item.gpa}` : "";
            const educationMetaSecondary = educationCore;

            return <TimelineEntry
              key={item.id}
              title={item.institution || "Institution"}
              meta={[item.periodLabel, item.location].filter(Boolean).join(" / ")}
              metaSecondary={educationMetaSecondary || undefined}
              metaSecondaryItalic
              gpa={gpa}
              body={item.description}
            />
          })}
        </SectionBlock>
      ) : null}

      {viewModel.skills.length > 0 ? (
        <SectionBlock title="Skills">
          <div className={styles.timelineRow}>
            <TagList
              tags={viewModel.skills.map((item) => {
                const levelPart = item.level ? ` (${item.level})` : "";
                return `${item.name || "Skill"}${levelPart}`;
              })}
            />
          </div>
        </SectionBlock>
      ) : null}

      {viewModel.projects.length > 0 ? (
        <SectionBlock title="Projects">
          {viewModel.projects.map((item) => (
            <TimelineEntry
              key={item.id}
              title={item.name || "Project"}
              subtitle={item.role || undefined}
              meta={item.periodLabel}
              body={item.description}
              bullets={item.highlights}
              footer={<TagList tags={item.technologies} />}
            />
          ))}
        </SectionBlock>
      ) : null}
    </article>
  );
};

export default MinimalistTemplate;
