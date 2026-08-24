import type { ReactNode } from "react";

import styles from "./TemplatePrimitives.module.css";

interface SectionBlockProps {
  title: string;
  children: ReactNode;
  sectionKey?: "workExperience" | "education" | "skills" | "projects";
}

const SectionBlock = ({ title, children, sectionKey }: SectionBlockProps) => {
  return (
    <section className={styles.section} data-preview-section={sectionKey}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <hr className={styles.sectionDivider} />
      {children}
    </section>
  );
};

export default SectionBlock;
