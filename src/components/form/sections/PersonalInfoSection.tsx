import TextArea from "@/components/form/fields/TextArea";
import TextField from "@/components/form/fields/TextField";
import type { PersonalInfo } from "@/types/cv";

import styles from "./SectionBlocks.module.css";

interface PersonalInfoSectionProps {
  value: PersonalInfo;
  onUpdate: (changes: Partial<PersonalInfo>) => void;
  errors?: Partial<Record<keyof PersonalInfo, string>>;
}

const noop = () => undefined;

const PersonalInfoSection = ({ value, onUpdate, errors }: PersonalInfoSectionProps) => {
  return (
    <section className={styles.sectionRoot}>
      <header>
        <h2 className={styles.sectionTitle}>Personal Info</h2>
        <p className={styles.sectionDescription}>Your identity and quick intro.</p>
      </header>

      <div className={styles.fieldGrid}>
        <TextField
          label="Full Name"
          value={value.fullName}
          onChange={noop}
          onDebouncedChange={(nextValue) => onUpdate({ fullName: nextValue })}
          errorText={errors?.fullName}
        />
        <TextField
          label="Headline"
          value={value.headline}
          onChange={noop}
          onDebouncedChange={(nextValue) => onUpdate({ headline: nextValue })}
          errorText={errors?.headline}
          placeholder="Ex: Senior Frontend Engineer"
        />
        <TextField
          label="Email"
          value={value.email}
          onChange={noop}
          onDebouncedChange={(nextValue) => onUpdate({ email: nextValue })}
          errorText={errors?.email}
        />
        <TextField
          label="Phone"
          value={value.phone}
          onChange={noop}
          onDebouncedChange={(nextValue) => onUpdate({ phone: nextValue })}
          errorText={errors?.phone}
        />
        <TextField
          label="Location"
          value={value.location}
          onChange={noop}
          onDebouncedChange={(nextValue) => onUpdate({ location: nextValue })}
          errorText={errors?.location}
        />
        <TextField
          label="Website"
          value={value.website}
          onChange={noop}
          onDebouncedChange={(nextValue) => onUpdate({ website: nextValue })}
          errorText={errors?.website}
        />
        <TextField
          label="LinkedIn"
          value={value.linkedin}
          onChange={noop}
          onDebouncedChange={(nextValue) => onUpdate({ linkedin: nextValue })}
          errorText={errors?.linkedin}
        />
        <TextField
          label="GitHub"
          value={value.github}
          onChange={noop}
          onDebouncedChange={(nextValue) => onUpdate({ github: nextValue })}
          errorText={errors?.github}
        />
      </div>

      <TextArea
        label="Professional Summary"
        value={value.summary}
        onChange={noop}
        onDebouncedChange={(nextValue) => onUpdate({ summary: nextValue })}
        errorText={errors?.summary}
      />
    </section>
  );
};

export default PersonalInfoSection;
