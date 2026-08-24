import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  createDocumentSlice,
  type DocumentSlice,
} from "./slices/documentSlice";
import { createMetaSlice, type MetaSlice } from "./slices/metaSlice";
import { createUiSlice, type UiSlice } from "./slices/uiSlice";
import { migratePersistedCvState } from "./migrations";
import {
  CV_STORAGE_KEY,
  cvPersistStorage,
  partializeCvStore,
  persistVersion,
} from "./persistence";

export type CvStore = DocumentSlice & UiSlice & MetaSlice;

export const useCvStore = create<CvStore>()(
  persist(
    (...args) => ({
      ...createDocumentSlice(...args),
      ...createUiSlice(...args),
      ...createMetaSlice(...args),
    }),
    {
      name: CV_STORAGE_KEY,
      version: persistVersion,
      storage: cvPersistStorage,
      partialize: partializeCvStore,
      migrate: migratePersistedCvState,
    },
  ),
);
