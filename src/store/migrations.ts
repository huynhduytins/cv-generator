import { createEmptyCvDocument, CV_SCHEMA_VERSION } from "../types/cv";
import type { CvDocument } from "../types/cv";
import type { ISODate, Nullable, Id } from "../types/common";

export interface PersistedCvState {
  document: CvDocument;
  lastSavedAt: Nullable<ISODate>;
  schemaVersion: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasPersistedShape = (value: unknown): value is PersistedCvState =>
  isRecord(value) &&
  "document" in value &&
  "lastSavedAt" in value &&
  "schemaVersion" in value;

const sanitizeSkills = (skills: unknown): CvDocument["skills"] => {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills.flatMap((skill): CvDocument["skills"] => {
    if (!isRecord(skill)) {
      return [];
    }

    const id = typeof skill.id === "string" ? skill.id : "";
    if (!id) {
      return [];
    }

    return [
      {
        id: id as Id,
        name: typeof skill.name === "string" ? skill.name : "",
        category: typeof skill.category === "string" ? skill.category : "",
      },
    ];
  });
};

const getInitialPersistedState = (): PersistedCvState => ({
  document: createEmptyCvDocument(),
  lastSavedAt: null,
  schemaVersion: CV_SCHEMA_VERSION,
});

export const migratePersistedCvState = (
  persistedState: unknown,
  fromVersion: number,
): PersistedCvState => {
  if (!hasPersistedShape(persistedState)) {
    return getInitialPersistedState();
  }

  let nextState: PersistedCvState = persistedState;

  if (fromVersion < 1) {
    nextState = {
      ...nextState,
      schemaVersion: 1,
    };
  }

  if (fromVersion < 2) {
    nextState = {
      ...nextState,
      document: {
        ...nextState.document,
        skills: sanitizeSkills(nextState.document.skills),
      },
      schemaVersion: 2,
    };
  }

  return {
    ...nextState,
    schemaVersion: CV_SCHEMA_VERSION,
  };
};
