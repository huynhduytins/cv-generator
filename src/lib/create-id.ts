import type { Id } from "@/types/common";

const fallbackId = () =>
  `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const createId = (): Id => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID() as Id;
  }

  return fallbackId() as Id;
};
