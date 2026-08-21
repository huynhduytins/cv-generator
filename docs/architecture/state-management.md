# State Management Architecture (Phase 1)

## Goals
- Keep CV content in a single source of truth (Zustand store).
- Preserve strict typing across state, actions, persistence, and migrations.
- Isolate UI presentation from state mutation logic.

## Slice Boundaries
- `documentSlice`
  - Owns `document` (`CvDocument`) and all content mutation actions.
  - Exposes generic CRUD + reorder actions for array sections:
    - `addSectionItem`
    - `updateSectionItem`
    - `removeSectionItem`
    - `reorderSectionItems`
  - Exposes `setPersonalInfo` and `resetDocument`.
- `uiSlice`
  - Owns interaction state only: `activeStep` and `expandedSections`.
  - Keeps navigation state decoupled from persisted document content.
- `metaSlice`
  - Owns save and schema metadata: `lastSavedAt`, `isDirty`, `schemaVersion`.
  - Tracks dirty/saved lifecycle through `markDirty` and `markSaved`.

## Persistence Strategy
- Persist middleware is configured in `cv-store` with:
  - storage key: `cv-generator-store`
  - schema version: `1`
  - migration entrypoint: `migratePersistedCvState`
- `partialize` persists only:
  - `document`
  - `lastSavedAt`
  - `schemaVersion`
- Local storage writes are debounced in `persistence.ts` to reduce write pressure during rapid edits.

## Selector Usage Pattern
- Prefer narrow selectors in hooks/components:
  - Good: `useCvStore((state) => state.document.personalInfo.fullName)`
  - Avoid: selecting entire `document` when only one field is needed.
- Keep derived view models in dedicated selectors/functions (next phases) to avoid excessive rerenders.

## Autosave Pattern
- `useAutoSave` watches `isDirty` + `lastSavedAt` and exposes a small status API:
  - `idle`
  - `pending`
  - `saved`
- `useDebouncedStoreAction` provides buffered action dispatch for text-heavy inputs, reducing high-frequency global updates while preserving store consistency.
