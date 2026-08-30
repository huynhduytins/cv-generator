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
  extraContent?: ReactNode;
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
  extraContent,
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
              className={`${styles.timelineMetaSecondary} ${metaSecondaryItalic ? styles.timelineMetaSecondaryItalic : ""
                }`.trim()}
            >
              {metaSecondary}
            </p>
          ) : null}
          {secondaryLine ? (
            <p
              className={`${styles.timelineSecondary} ${secondaryLineItalic ? styles.timelineSecondaryItalic : ""
                }`.trim()}
            >
              {secondaryLine}
            </p>
          ) : null}
        </div>
        {meta || metaSecondary ? (
          <div className={styles.timelineMetaGroup}>
            {meta ? <p className={styles.timelineMeta}>{meta}</p> : null}
            {gpa ? (
              <p
                className={`${styles.timelineMetaSecondary} ${metaSecondaryItalic ? styles.timelineMetaSecondaryItalic : ""
                  }`.trim()}
              >
                {gpa}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      {body ? (
        <>
          <RichTextBlock text={body} className={styles.timelineBody} extraContent={extraContent} />
        </>
      ) : null}
    </article>
  );
};

export default TimelineEntry;
