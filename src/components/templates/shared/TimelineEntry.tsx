import type { ReactNode } from "react";
import { FiExternalLink } from "react-icons/fi";

import styles from "./TemplatePrimitives.module.css";
import RichTextBlock from "./RichTextBlock";

interface TimelineEntryProps {
  title: string;
  subtitle?: string;
  titleHref?: string;
  secondaryLine?: string;
  secondaryLineItalic?: boolean;
  meta?: string;
  gpa?: string;
  metaSecondary?: string;
  metaSecondaryItalic?: boolean;
  body?: string;
  bullets?: string[];
  footer?: ReactNode;
}

const TimelineEntry = ({
  title,
  subtitle,
  titleHref,
  secondaryLine,
  secondaryLineItalic = false,
  meta,
  gpa,
  metaSecondary,
  metaSecondaryItalic = false,
  body,
  bullets,
  footer,
}: TimelineEntryProps) => {
  return (
    <article className={styles.timelineRow}>
      <div className={styles.timelineHeader}>
        <div>
          <h3 className={styles.timelineTitle}>
            <span>{title}</span>
            {titleHref ? (
              <a
                className={styles.timelineTitleIconLink}
                href={titleHref}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${title} link`}
              >
                <FiExternalLink
                  className={styles.timelineTitleIcon}
                  aria-hidden
                />
              </a>
            ) : null}
            {subtitle ? `, ${subtitle}` : ""}
          </h3>
          {metaSecondary ? (
            <p
              className={`${styles.timelineMetaSecondary} ${
                metaSecondaryItalic ? styles.timelineMetaSecondaryItalic : ""
              }`.trim()}
            >
              {metaSecondary}
            </p>
          ) : null}
        </div>
        {meta || metaSecondary ? (
          <div className={styles.timelineMetaGroup}>
            {meta ? <p className={styles.timelineMeta}>{meta}</p> : null}
            {gpa ? (
              <p
                className={`${styles.timelineMetaSecondary} ${
                  metaSecondaryItalic ? styles.timelineMetaSecondaryItalic : ""
                }`.trim()}
              >
                {gpa}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      {secondaryLine ? (
        <p
          className={`${styles.timelineSecondary} ${
            secondaryLineItalic ? styles.timelineSecondaryItalic : ""
          }`.trim()}
        >
          {secondaryLine}
        </p>
      ) : null}
      {body ? (
        <RichTextBlock text={body} className={styles.timelineBody} />
      ) : null}
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
