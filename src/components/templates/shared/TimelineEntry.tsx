import type { ReactNode } from "react";

import styles from "./TemplatePrimitives.module.css";
import RichTextBlock from "./RichTextBlock";

interface TimelineEntryProps {
  title: string;
  subtitle?: string;
  meta?: string;
  body?: string;
  bullets?: string[];
  footer?: ReactNode;
}

const TimelineEntry = ({ title, subtitle, meta, body, bullets, footer }: TimelineEntryProps) => {
  return (
    <article className={styles.timelineRow}>
      <div className={styles.timelineHeader}>
        <h3 className={styles.timelineTitle}>
          {title}
          {subtitle ? `, ${subtitle}` : ""}
        </h3>
        {meta ? <p className={styles.timelineMeta}>{meta}</p> : null}
      </div>
      {body ? <RichTextBlock text={body} className={styles.timelineBody} /> : null}
      {bullets && bullets.length > 0 ? (
        <ul className={styles.list}>
          {bullets.map((item, index) => (
            <li key={`${item}-${index}`} className={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {footer}
    </article>
  );
};

export default TimelineEntry;
