import { createJSONStorage, type StateStorage } from "zustand/middleware";

import { CV_SCHEMA_VERSION } from "../types/cv";

import type { CvStore } from "./cv-store";
import type { PersistedCvState } from "./migrations";

export const CV_STORAGE_KEY = "cv-generator-store";
const WRITE_DEBOUNCE_MS = 300;

const createNoopStorage = (): StateStorage => ({
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
});

const createDebouncedLocalStorage = (): StateStorage => {
  if (typeof window === "undefined") {
    return createNoopStorage();
  }

  const timers = new Map<string, number>();

  return {
    getItem: (name) => window.localStorage.getItem(name),
    setItem: (name, value) => {
      const existingTimer = timers.get(name);
      if (existingTimer !== undefined) {
        window.clearTimeout(existingTimer);
      }

      const timerId = window.setTimeout(() => {
        window.localStorage.setItem(name, value);
        timers.delete(name);
      }, WRITE_DEBOUNCE_MS);

      timers.set(name, timerId);
    },
    removeItem: (name) => {
      const existingTimer = timers.get(name);
      if (existingTimer !== undefined) {
        window.clearTimeout(existingTimer);
        timers.delete(name);
      }
      window.localStorage.removeItem(name);
    },
  };
};

export const cvPersistStorage = createJSONStorage<PersistedCvState>(createDebouncedLocalStorage);

export const partializeCvStore = (state: CvStore): PersistedCvState => ({
  document: state.document,
  lastSavedAt: state.lastSavedAt,
  schemaVersion: state.schemaVersion,
});

export const persistVersion = CV_SCHEMA_VERSION;
