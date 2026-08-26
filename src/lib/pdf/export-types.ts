import type { CvPreviewViewModel } from "@/lib/mappers/cv-to-preview";

export interface ExportPdfRequestPayload {
  viewModel: CvPreviewViewModel;
  snapshotHtml: string;
  // stylesHtml: string;
  // containerWidthPx: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

const isPreviewViewModel = (value: unknown): value is CvPreviewViewModel => {
  if (!isRecord(value)) {
    return false;
  }

  const identity = value.identity;
  if (!isRecord(identity)) {
    return false;
  }

  return (
    isString(identity.fullName) &&
    isString(identity.headline) &&
    isString(identity.summary) &&
    Array.isArray(identity.contacts) &&
    Array.isArray(value.workExperience) &&
    Array.isArray(value.education) &&
    Array.isArray(value.skills) &&
    Array.isArray(value.projects) &&
    Array.isArray(value.visibleSections) &&
    value.visibleSections.every(isString) &&
    isString(value.updatedAt)
  );
};

export const parseExportPdfRequestPayload = (
  value: unknown,
): ExportPdfRequestPayload => {
  if (!isRecord(value)) {
    throw new Error("Invalid payload: expected object.");
  }

  if (!isPreviewViewModel(value.viewModel)) {
    throw new Error("Invalid payload: preview model shape mismatch.");
  }

  if (!isString(value.snapshotHtml) || value.snapshotHtml.trim().length === 0) {
    throw new Error("Invalid payload: missing preview snapshot HTML.");
  }

  // if (!isString(value.stylesHtml)) {
  //   throw new Error("Invalid payload: missing style snapshot HTML.");
  // }

  if (value.snapshotHtml.length > 4_000_000) {
    throw new Error("Invalid payload: preview snapshot is too large.");
  }

  // if (value.stylesHtml.length > 2_000_000) {
  //   throw new Error("Invalid payload: style snapshot is too large.");
  // }

  // if (
  //   typeof value.containerWidthPx !== "number" ||
  //   Number.isNaN(value.containerWidthPx)
  // ) {
  //   throw new Error("Invalid payload: container width is missing.");
  // }

  // if (value.containerWidthPx < 100 || value.containerWidthPx > 2500) {
  //   throw new Error("Invalid payload: container width is out of range.");
  // }

  return {
    viewModel: value.viewModel,
    snapshotHtml: value.snapshotHtml,
    // stylesHtml: value.stylesHtml,
    // containerWidthPx: value.containerWidthPx,
  };
};
