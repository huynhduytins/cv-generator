import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AccordionNavigator from "../AccordionNavigator";
import StepNavigator from "../StepNavigator";
import type { SectionNavigationItem } from "../navigation.types";

const sectionItems: SectionNavigationItem[] = [
  {
    key: "personalInfo",
    label: "Personal Info",
    expanded: true,
    validationState: "valid",
  },
  {
    key: "workExperience",
    label: "Work Experience",
    expanded: false,
    validationState: "idle",
  },
];

describe("form navigation", () => {
  it("calls onChangeStep for step buttons", async () => {
    const user = userEvent.setup();
    const onChangeStep = vi.fn();

    render(
      <StepNavigator
        items={sectionItems}
        activeStep="personalInfo"
        onChangeStep={onChangeStep}
      />,
    );

    await user.click(screen.getByRole("button", { name: /work experience/i }));

    expect(onChangeStep).toHaveBeenCalledWith("workExperience");
  });

  it("calls accordion toggle callback for section headers", async () => {
    const user = userEvent.setup();
    const onToggleSection = vi.fn();

    render(
      <AccordionNavigator
        items={sectionItems}
        onToggleSection={onToggleSection}
        renderSectionContent={(section) => <div>{section}</div>}
      />,
    );

    await user.click(
      screen.getAllByRole("button", { name: /personal info/i })[0],
    );
    await user.click(
      screen.getAllByRole("button", { name: /work experience/i })[0],
    );

    expect(onToggleSection).toHaveBeenCalledWith("personalInfo");
    expect(onToggleSection).toHaveBeenCalledWith("workExperience");
  });
});
