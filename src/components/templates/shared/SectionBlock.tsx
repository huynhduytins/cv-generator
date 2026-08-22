import type { ReactNode } from "react";

import styles from "./TemplatePrimitives.module.css";

interface SectionBlockProps {
  title: string;
  children: ReactNode;
}

const SectionBlock = ({ title, children }: SectionBlockProps) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <hr className={styles.sectionDivider} />
      {children}
    </section>
  );
};

export default SectionBlock;
