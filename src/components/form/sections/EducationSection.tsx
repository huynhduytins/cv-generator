import ArraySectionControls from "@/components/form/fields/ArraySectionControls";
import DateField from "@/components/form/fields/DateField";
import TextArea from "@/components/form/fields/TextArea";
import TextField from "@/components/form/fields/TextField";
import type { Education } from "@/types/cv";
import type { ISODate } from "@/types/common";

import styles from "./SectionBlocks.module.css";

interface EducationSectionProps {
  items: Education[];
  onAdd: () => void;
  onUpdate: (id: Education["id"], changes: Partial<Education>) => void;
  onRemove: (id: Education["id"]) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const noop = () => undefined;

const EducationSection = ({ items, onAdd, onUpdate, onRemove, onReorder }: EducationSectionProps) => {
  return (
    <section className={styles.sectionRoot}>
      <header className={styles.sectionHeader}>
        <button type="button" className={styles.addButton} onClick={onAdd}>
          + Add education
        </button>
      </header>

      {items.map((item, index) => (
        <article key={item.id} className={styles.itemCard}>
          <h3 className={styles.itemTitle}>Education {index + 1}</h3>
          <div className={styles.fieldGrid}>
            <TextField
              label="Institution"
              value={item.institution}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { institution: nextValue })}
            />
            <TextField
              label="Degree"
              value={item.degree}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { degree: nextValue })}
            />
            <TextField
              label="Field of Study"
              value={item.fieldOfStudy}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { fieldOfStudy: nextValue })}
            />
            <TextField
              label="GPA"
              value={item.gpa}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { gpa: nextValue })}
              placeholder="e.g. 3.8/4.0"
            />
            <DateField
              label="Start Date"
              value={item.dateRange.startDate}
              onChange={(nextValue) =>
                onUpdate(item.id, {
                  dateRange: {
                    ...item.dateRange,
                    startDate: nextValue as ISODate,
                    isPresent: false,
                  },
                })
              }
            />
            <DateField
              label="End Date"
              value={item.dateRange.endDate ?? ""}
              onChange={(nextValue) =>
                onUpdate(item.id, {
                  dateRange: {
                    ...item.dateRange,
                    endDate: nextValue ? (nextValue as ISODate) : null,
                    isPresent: false,
                  },
                })
              }
            />
          </div>
          <TextArea
            label="Description"
            value={item.description}
            onChange={noop}
            onDebouncedChange={(nextValue) => onUpdate(item.id, { description: nextValue })}
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

export default EducationSection;
