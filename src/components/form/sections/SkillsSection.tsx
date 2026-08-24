import ArraySectionControls from "@/components/form/fields/ArraySectionControls";
import TextArea from "@/components/form/fields/TextArea";
import TextField from "@/components/form/fields/TextField";
import type { Skill } from "@/types/cv";

import styles from "./SectionBlocks.module.css";

interface SkillsSectionProps {
  items: Skill[];
  onAdd: () => void;
  onUpdate: (id: Skill["id"], changes: Partial<Skill>) => void;
  onRemove: (id: Skill["id"]) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const noop = () => undefined;

const SkillsSection = ({ items, onAdd, onUpdate, onRemove, onReorder }: SkillsSectionProps) => {
  return (
    <section className={styles.sectionRoot}>
      <header className={styles.sectionHeader}>
        <button type="button" className={styles.addButton} onClick={onAdd}>
          + Add skill
        </button>
      </header>

      {items.map((item, index) => (
        <article key={item.id} className={styles.itemCard}>
          <h3 className={styles.itemTitle}>Skill {index + 1}</h3>
          <div className={styles.fieldGrid}>
            <TextField
              label="Category"
              value={item.category}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { category: nextValue })}
            />
            <div className={styles.fieldFullWidth}>
              <TextArea
                label="Name"
                value={item.name}
                onChange={noop}
                onDebouncedChange={(nextValue) => onUpdate(item.id, { name: nextValue })}
                placeholder="TypeScript, JavaScript, Python"
                helperText="Separate skills by comma or new line"
              />
            </div>
          </div>
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

export default SkillsSection;
