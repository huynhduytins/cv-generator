import { createEmptyCvDocument, CV_SCHEMA_VERSION } from "../types/cv";
import type { CvDocument } from "../types/cv";
import type { ISODate, Nullable } from "../types/common";

export interface PersistedMetaState {
  lastSavedAt: Nullable<ISODate>;
  schemaVersion: number;
}

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

export const getInitialPersistedState = (): PersistedCvState => ({
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

  if (fromVersion < 1) {
    return {
      ...persistedState,
      schemaVersion: 1,
    };
  }

  return {
    ...persistedState,
    schemaVersion: CV_SCHEMA_VERSION,
  };
};
