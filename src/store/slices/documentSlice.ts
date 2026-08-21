import type { StateCreator } from "zustand";

import { createEmptyCvDocument } from "../../types/cv";
import type {
  CvDocument,
  CvSectionStep,
  Education,
  PersonalInfo,
  Project,
  Skill,
  WorkExperience,
} from "../../types/cv";
import type { DeepPartial, Id, ISODate } from "../../types/common";

import type { CvStore } from "../cv-store";

export type ArraySectionKey = "workExperience" | "education" | "skills" | "projects";

type SectionItemMap = Pick<CvDocument, ArraySectionKey>;
type SectionItem<K extends ArraySectionKey> = SectionItemMap[K][number];

const arraySections: ArraySectionKey[] = ["workExperience", "education", "skills", "projects"];

const updateDocumentTimestamp = (document: CvDocument): CvDocument => ({
  ...document,
  updatedAt: new Date().toISOString() as ISODate,
});

const reorderArraySection = <K extends ArraySectionKey>(
  items: CvDocument[K],
  fromIndex: number,
  toIndex: number,
): CvDocument[K] => {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return items;
  }

  const reordered = [...items] as unknown[];
  const [movedItem] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, movedItem);
  return reordered as CvDocument[K];
};

const replaceArraySection = <K extends ArraySectionKey>(
  document: CvDocument,
  section: K,
  nextItems: CvDocument[K],
): CvDocument => ({
  ...document,
  [section]: nextItems,
});

const isArraySectionKey = (value: CvSectionStep): value is ArraySectionKey =>
  arraySections.includes(value as ArraySectionKey);

export interface DocumentSlice {
  document: CvDocument;
  setPersonalInfo: (personalInfo: DeepPartial<PersonalInfo>) => void;
  resetDocument: () => void;
  addSectionItem: <K extends ArraySectionKey>(section: K, item: SectionItem<K>) => void;
  updateSectionItem: <K extends ArraySectionKey>(
    section: K,
    id: Id,
    changes: DeepPartial<SectionItem<K>>,
  ) => void;
  removeSectionItem: <K extends ArraySectionKey>(section: K, id: Id) => void;
  reorderSectionItems: <K extends ArraySectionKey>(
    section: K,
    fromIndex: number,
    toIndex: number,
  ) => void;
}

export const createDocumentSlice: StateCreator<
  CvStore,
  [["zustand/persist", unknown]],
  [],
  DocumentSlice
> = (set, get) => ({
  document: createEmptyCvDocument(),
  setPersonalInfo: (personalInfo) => {
    set((state) => ({
      document: updateDocumentTimestamp({
        ...state.document,
        personalInfo: {
          ...state.document.personalInfo,
          ...personalInfo,
        },
      }),
    }));
    get().markDirty();
  },
  resetDocument: () => {
    set({ document: createEmptyCvDocument() });
    get().markDirty();
  },
  addSectionItem: (section, item) => {
    set((state) => ({
      document: updateDocumentTimestamp({
        ...replaceArraySection(
          state.document,
          section,
          [...state.document[section], item] as CvDocument[typeof section],
        ),
      }),
    }));
    get().markDirty();
  },
  updateSectionItem: (section, id, changes) => {
    set((state) => ({
      document: updateDocumentTimestamp({
        ...replaceArraySection(
          state.document,
          section,
          state.document[section].map((item) =>
            item.id === id
              ? ({
                  ...item,
                  ...changes,
                } as SectionItem<typeof section>)
              : item,
          ) as CvDocument[typeof section],
        ),
      }),
    }));
    get().markDirty();
  },
  removeSectionItem: (section, id) => {
    set((state) => ({
      document: updateDocumentTimestamp({
        ...replaceArraySection(
          state.document,
          section,
          state.document[section].filter((item) => item.id !== id) as CvDocument[typeof section],
        ),
      }),
    }));
    get().markDirty();
  },
  reorderSectionItems: (section, fromIndex, toIndex) => {
    set((state) => {
      const currentItems = state.document[section];
      const reorderedItems: CvDocument[typeof section] = reorderArraySection(
        currentItems,
        fromIndex,
        toIndex,
      );

      return {
        document: updateDocumentTimestamp({
          ...replaceArraySection(state.document, section, reorderedItems),
        }),
      };
    });
    get().markDirty();
  },
});

export type CvArraySectionItem = WorkExperience | Education | Skill | Project;

export { isArraySectionKey };
