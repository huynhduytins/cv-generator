import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import WorkExperienceSection from "../sections/WorkExperienceSection";
import type { WorkExperience } from "@/types/cv";
import type { Id, ISODate } from "@/types/common";

const makeWorkExperience = (id: string): WorkExperience => ({
  id: id as Id,
  company: "Acme",
  role: "Engineer",
  location: "Remote",
  dateRange: {
    startDate: "2024-01-01" as ISODate,
    endDate: null,
    isPresent: true,
  },
  summary: "Built product features",
  technologies: "React, TypeScript",
  highlights: [],
});

describe("work experience section crud", () => {
  it("triggers add action from header button", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(
      <WorkExperienceSection
        items={[makeWorkExperience("1")]}
        onAdd={onAdd}
        onUpdate={vi.fn()}
        onRemove={vi.fn()}
        onReorder={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add experience/i }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("triggers reorder and remove callbacks", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    const onRemove = vi.fn();
    const items = [makeWorkExperience("1"), makeWorkExperience("2")];

    render(
      <WorkExperienceSection
        items={items}
        onAdd={vi.fn()}
        onUpdate={vi.fn()}
        onRemove={onRemove}
        onReorder={onReorder}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: /move down/i })[0]);
    await user.click(screen.getAllByRole("button", { name: /remove/i })[0]);

    expect(onReorder).toHaveBeenCalledWith(0, 1);
    expect(onRemove).toHaveBeenCalledWith(items[0].id);
  });
});
