import type { CvDocument } from "@/types/cv";

import { mapCvToPreview, type CvPreviewViewModel } from "@/lib/mappers/cv-to-preview";

import type { CvStore } from "../cv-store";

const createPreviewMemo = () => {
  let lastDocument: CvDocument | null = null;
  let lastResult: CvPreviewViewModel | null = null;

  return (document: CvDocument): CvPreviewViewModel => {
    if (lastDocument === document && lastResult) {
      return lastResult;
    }

    lastDocument = document;
    lastResult = mapCvToPreview(document);
    return lastResult;
  };
};

const previewMemo = createPreviewMemo();

export const selectPreviewViewModel = (state: CvStore): CvPreviewViewModel => {
  return previewMemo(state.document);
};
