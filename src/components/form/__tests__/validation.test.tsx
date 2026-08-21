import { validateCvDocument } from "@/lib/validation/cv-validation";
import { createEmptyCvDocument } from "@/types/cv";

describe("cv validation", () => {
  it("does not mark personal info as invalid when fields are empty", () => {
    const document = createEmptyCvDocument();

    const result = validateCvDocument(document);

    expect(result.sectionStates.personalInfo).toBe("idle");
    expect(result.personalInfoErrors.fullName).toBeUndefined();
    expect(result.personalInfoErrors.email).toBeUndefined();
  });

  it("keeps personal info in idle state when values are provided", () => {
    const document = createEmptyCvDocument();
    document.personalInfo.fullName = "Jane Doe";
    document.personalInfo.email = "jane@example.com";

    const result = validateCvDocument(document);

    expect(result.sectionStates.personalInfo).toBe("idle");
  });
});
