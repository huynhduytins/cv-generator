import ArraySectionControls from "@/components/form/fields/ArraySectionControls";
import TextField from "@/components/form/fields/TextField";
import type { Skill, SkillLevel } from "@/types/cv";

import styles from "./SectionBlocks.module.css";

interface SkillsSectionProps {
  items: Skill[];
  onAdd: () => void;
  onUpdate: (id: Skill["id"], changes: Partial<Skill>) => void;
  onRemove: (id: Skill["id"]) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const noop = () => undefined;

const SKILL_LEVELS: SkillLevel[] = ["beginner", "intermediate", "advanced", "expert"];

const SkillsSection = ({ items, onAdd, onUpdate, onRemove, onReorder }: SkillsSectionProps) => {
  return (
    <section className={styles.sectionRoot}>
      <header className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <p className={styles.sectionDescription}>Core technologies and proficiencies.</p>
        </div>
        <button type="button" className={styles.addButton} onClick={onAdd}>
          Add skill
        </button>
      </header>

      {items.map((item, index) => (
        <article key={item.id} className={styles.itemCard}>
          <h3 className={styles.itemTitle}>Skill {index + 1}</h3>
          <div className={styles.fieldGrid}>
            <TextField
              label="Name"
              value={item.name}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { name: nextValue })}
            />
            <TextField
              label="Category"
              value={item.category}
              onChange={noop}
              onDebouncedChange={(nextValue) => onUpdate(item.id, { category: nextValue })}
            />
            <label>
              <span className={styles.sectionDescription}>Level</span>
              <select
                className={styles.select}
                value={item.level}
                onChange={(event) => onUpdate(item.id, { level: event.target.value as SkillLevel })}
              >
                {SKILL_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
            <TextField
              label="Years of Experience"
              value={item.yearsOfExperience === null ? "" : String(item.yearsOfExperience)}
              onChange={noop}
              onDebouncedChange={(nextValue) => {
                const years = Number(nextValue);
                onUpdate(item.id, {
                  yearsOfExperience: Number.isNaN(years) ? null : years,
                });
              }}
              helperText="Optional numeric value"
            />
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
