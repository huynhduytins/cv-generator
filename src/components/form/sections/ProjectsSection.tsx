import ArraySectionControls from "@/components/form/fields/ArraySectionControls";
import DateField from "@/components/form/fields/DateField";
import TextArea from "@/components/form/fields/TextArea";
import TextField from "@/components/form/fields/TextField";
import type { Project } from "@/types/cv";
import type { ISODate } from "@/types/common";

import styles from "./SectionBlocks.module.css";

interface ProjectsSectionProps {
  items: Project[];
  onAdd: () => void;
  onUpdate: (id: Project["id"], changes: Partial<Project>) => void;
  onRemove: (id: Project["id"]) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const noop = () => undefined;

const ProjectsSection = ({ items, onAdd, onUpdate, onRemove, onReorder }: ProjectsSectionProps) => {
  return (
    <section className={styles.sectionRoot}>
      <header className={styles.sectionHeader}>
        <button type="button" className={styles.addButton} onClick={onAdd}>
          + Add project
        </button>
      </header>

      {items.map((item, index) => (
        <article key={item.id} className={styles.itemCard}>
          <h3 className={styles.itemTitle}>Project {index + 1}</h3>
          <div className={styles.fieldGrid}>
            <TextField
              label="Project Name"
              value={item.name}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { name: nextValue })}
            />
            <TextField
              label="Role"
              value={item.role}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { role: nextValue })}
            />
            <TextField
              label="URL"
              value={item.url}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { url: nextValue })}
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

export default ProjectsSection;
