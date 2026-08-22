import { mapCvToPreview } from "@/lib/mappers/cv-to-preview";
import { createEmptyCvDocument, createEmptyProject, createEmptyWorkExperience } from "@/types/cv";
import type { Id, ISODate } from "@/types/common";

describe("mapCvToPreview", () => {
  it("provides fallback name and empty sections for blank document", () => {
    const document = createEmptyCvDocument();

    const result = mapCvToPreview(document);

    expect(result.identity.fullName).toBe("Your Name");
    expect(result.workExperience).toHaveLength(0);
    expect(result.projects).toHaveLength(0);
  });

  it("maps period labels and filters blank highlights/technologies", () => {
    const document = createEmptyCvDocument();
    document.personalInfo.fullName = "Tin Huynh";

    const work = createEmptyWorkExperience("work-1" as Id);
    work.role = "Frontend Engineer";
    work.company = "Enouvo";
    work.dateRange.startDate = "2023-01-01" as ISODate;
    work.dateRange.endDate = "2024-12-01" as ISODate;
    work.highlights = ["Built CV app", "  "];

    const project = createEmptyProject("project-1" as Id);
    project.name = "Web CV Generator";
    project.description = "A CV building app.";
    project.technologies = ["React", "", "TypeScript"];

    document.workExperience = [work];
    document.projects = [project];

    const result = mapCvToPreview(document);

    expect(result.workExperience[0]?.periodLabel).toContain("2023");
    expect(result.workExperience[0]?.highlights).toEqual(["Built CV app"]);
    expect(result.projects[0]?.technologies).toEqual(["React", "TypeScript"]);
    expect(result.visibleSections).toContain("workExperience");
    expect(result.visibleSections).toContain("projects");
  });
});
