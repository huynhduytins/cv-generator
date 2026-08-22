import { act, render, screen } from "@testing-library/react";

import LivePreview from "@/components/preview/LivePreview";
import { useCvStore } from "@/store/cv-store";
import { createEmptyCvDocument } from "@/types/cv";

describe("LivePreview", () => {
  beforeEach(() => {
    useCvStore.setState((state) => ({
      ...state,
      document: createEmptyCvDocument(),
      lastSavedAt: null,
      isDirty: false,
    }));
  });

  it("renders fallback identity for empty document", () => {
    render(<LivePreview />);

    expect(screen.getByText("Your Name")).toBeInTheDocument();
    expect(screen.getByText("Live Preview (Minimalist)")).toBeInTheDocument();
  });

  it("updates preview after store action", () => {
    render(<LivePreview />);

    act(() => {
      useCvStore.getState().setPersonalInfo({
        fullName: "Tin Huynh",
        headline: "Frontend Engineer",
      });
    });

    expect(screen.getByText("Tin Huynh")).toBeInTheDocument();
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
  });
});
