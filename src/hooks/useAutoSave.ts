import { useCallback, useEffect, useRef } from "react";

import { useCvStore } from "../store/cv-store";
import type { ISODate, Nullable } from "../types/common";

export type AutoSaveStatus = "idle" | "pending" | "saved";

export interface UseAutoSaveOptions {
  debounceMs?: number;
}

export interface UseAutoSaveResult {
  status: AutoSaveStatus;
  lastSavedAt: Nullable<ISODate>;
}

const DEFAULT_AUTOSAVE_DEBOUNCE_MS = 600;

/**
 * Tracks debounced autosave lifecycle based on dirty-state updates in the store.
 */
export const useAutoSave = (options: UseAutoSaveOptions = {}): UseAutoSaveResult => {
  const { debounceMs = DEFAULT_AUTOSAVE_DEBOUNCE_MS } = options;
  const isDirty = useCvStore((state) => state.isDirty);
  const lastSavedAt = useCvStore((state) => state.lastSavedAt);
  const markSaved = useCvStore((state) => state.markSaved);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      markSaved();
      timerRef.current = null;
    }, debounceMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [debounceMs, isDirty, markSaved]);

  const status: AutoSaveStatus = isDirty ? "pending" : lastSavedAt ? "saved" : "idle";

  return {
    status,
    lastSavedAt,
  };
};

/**
 * Wraps a store action with debounce, intended for buffered text input workflows.
 */
export const useDebouncedStoreAction = <TPayload>(
  action: (payload: TPayload) => void,
  debounceMs = 120,
): ((payload: TPayload) => void) => {
  const timerRef = useRef<number | null>(null);
  const latestPayloadRef = useRef<TPayload | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return useCallback(
    (payload: TPayload) => {
      latestPayloadRef.current = payload;

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        const queuedPayload = latestPayloadRef.current;
        if (queuedPayload !== null) {
          action(queuedPayload);
        }
      }, debounceMs);
    },
    [action, debounceMs],
  );
};
