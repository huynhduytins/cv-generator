import type { StateCreator } from "zustand";

import { CV_SCHEMA_VERSION } from "../../types/cv";
import type { ISODate, Nullable } from "../../types/common";

import type { CvStore } from "../cv-store";

export interface MetaSlice {
  lastSavedAt: Nullable<ISODate>;
  isDirty: boolean;
  schemaVersion: number;
  markDirty: () => void;
  markSaved: (savedAt?: ISODate) => void;
  setSchemaVersion: (version: number) => void;
}

export const createMetaSlice: StateCreator<
  CvStore,
  [["zustand/persist", unknown]],
  [],
  MetaSlice
> = (set) => ({
  lastSavedAt: null,
  isDirty: false,
  schemaVersion: CV_SCHEMA_VERSION,
  markDirty: () => {
    set({ isDirty: true });
  },
  markSaved: (savedAt) => {
    set({
      isDirty: false,
      lastSavedAt: savedAt ?? (new Date().toISOString() as ISODate),
    });
  },
  setSchemaVersion: (version) => {
    set({ schemaVersion: version });
  },
});
