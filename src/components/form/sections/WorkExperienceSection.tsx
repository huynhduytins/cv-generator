import ArraySectionControls from "@/components/form/fields/ArraySectionControls";
import DateField from "@/components/form/fields/DateField";
import TextArea from "@/components/form/fields/TextArea";
import TextField from "@/components/form/fields/TextField";
import type { WorkExperience } from "@/types/cv";
import type { ISODate } from "@/types/common";

import styles from "./SectionBlocks.module.css";

interface WorkExperienceSectionProps {
  items: WorkExperience[];
  onAdd: () => void;
  onUpdate: (id: WorkExperience["id"], changes: Partial<WorkExperience>) => void;
  onRemove: (id: WorkExperience["id"]) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const noop = () => undefined;

const WorkExperienceSection = ({
  items,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}: WorkExperienceSectionProps) => {
  return (
    <section className={styles.sectionRoot}>
      <header className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Work Experience</h2>
          <p className={styles.sectionDescription}>Role history and impact highlights.</p>
        </div>
        <button type="button" className={styles.addButton} onClick={onAdd}>
          Add experience
        </button>
      </header>

      {items.map((item, index) => (
        <article key={item.id} className={styles.itemCard}>
          <h3 className={styles.itemTitle}>Experience {index + 1}</h3>
          <div className={styles.fieldGrid}>
            <TextField
              label="Company"
              value={item.company}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { company: nextValue })}
            />
            <TextField
              label="Role"
              value={item.role}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { role: nextValue })}
            />
            <TextField
              label="Location"
              value={item.location}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { location: nextValue })}
            />
            <DateField
              label="Start Date"
              value={item.dateRange.startDate}
              onChange={(nextValue) =>
                onUpdate(item.id, {
                  dateRange: { ...item.dateRange, startDate: nextValue as ISODate },
                })
              }
            />
          </div>
          <TextArea
            label="Summary"
            value={item.summary}
            onChange={noop}
            onDebouncedChange={(nextValue) => onUpdate(item.id, { summary: nextValue })}
          />
          <ArraySectionControls
            canMoveUp={index > 0}
            canMoveDown={index < items.length - 1}
            onMoveUp={() => onReorder(index, index - 1)}
            onMoveDown={() => onReorder(index, index + 1)}
            onRemove={() => onRemove(item.id)}
          />
        </article>
      ))}
    </section>
  );
};

export default WorkExperienceSection;
