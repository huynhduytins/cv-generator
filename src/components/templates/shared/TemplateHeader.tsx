import type { PreviewContactItem } from "@/lib/mappers/cv-to-preview";
import type { ContactDisplayMode } from "@/store/slices/uiSlice";
import type { IconType } from "react-icons";
import { FiAtSign, FiGithub, FiGlobe, FiLinkedin, FiMapPin, FiPhone } from "react-icons/fi";

import styles from "./TemplatePrimitives.module.css";

interface TemplateHeaderProps {
  fullName: string;
  headline: string;
  contacts: PreviewContactItem[];
  contactDisplayMode: ContactDisplayMode;
}

const CONTACT_ICONS: Record<PreviewContactItem["key"], IconType> = {
  email: FiAtSign,
  phone: FiPhone,
  location: FiMapPin,
  website: FiGlobe,
  linkedin: FiLinkedin,
  github: FiGithub,
};

const TemplateHeader = ({
  fullName,
  headline,
  contacts,
  contactDisplayMode,
}: TemplateHeaderProps) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.name}>{fullName}</h1>
      {headline ? <p className={styles.headline}>{headline}</p> : null}
      {contacts.length > 0 ? (
        <div
          className={
            contactDisplayMode === "icon"
              ? `${styles.contacts} ${styles.contactsIconMode}`
              : styles.contacts
          }
        >
          {contacts.map((contact) => {
            const ContactIcon = CONTACT_ICONS[contact.key];
            const chipClassName =
              contactDisplayMode === "icon"
                ? `${styles.contactChip} ${styles.contactPlain}`
                : styles.contactChip;
            const body = (
              <>
                {contactDisplayMode === "icon" ? (
                  <span className={styles.contactIcon} aria-hidden="true">
                    <ContactIcon size={13} />
                  </span>
                ) : (
                  <span className={styles.contactLabel}>{contact.label}:</span>
                )}
                <span className={`${contact.href && styles.href}`}>{contact.value}</span>
              </>
            );

            if (contact.href) {
              return (
                <a key={contact.key} className={chipClassName} href={contact.href} target="_blank" rel="noreferrer">
                  {body}
                </a>
              );
            }

            return (
              <span key={contact.key} className={chipClassName}>
                {body}
              </span>
            );
          })}
        </div>
      ) : null}
    </header>
  );
};

export default TemplateHeader;
