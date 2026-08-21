import type { ReactNode } from "react";

import styles from "./CvBuilderShell.module.css";

interface CvBuilderShellProps {
  navigation: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
}

const CvBuilderShell = ({ navigation, editor, preview }: CvBuilderShellProps) => {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.mainGrid}>
          <section aria-label="CV editor" className={styles.card}>
            <header className={styles.editorHeader}>{navigation}</header>
            {editor}
          </section>

          <aside aria-label="Live preview placeholder" className={`${styles.card} ${styles.preview}`}>
            {preview}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CvBuilderShell;
