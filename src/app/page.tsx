"use client";

import AccordionNavigator from "@/components/form/AccordionNavigator";
import StepNavigator from "@/components/form/StepNavigator";
import type { SectionNavigationItem } from "@/components/form/navigation.types";
import EducationSection from "@/components/form/sections/EducationSection";
import PersonalInfoSection from "@/components/form/sections/PersonalInfoSection";
import ProjectsSection from "@/components/form/sections/ProjectsSection";
import SkillsSection from "@/components/form/sections/SkillsSection";
import WorkExperienceSection from "@/components/form/sections/WorkExperienceSection";
import CvBuilderShell from "@/components/layout/CvBuilderShell";
import LivePreview from "@/components/preview/LivePreview";
import { useClientReady } from "@/hooks/useClientReady";
import { useCvFormController } from "@/hooks/useCvFormController";
import { validateCvDocument } from "@/lib/validation/cv-validation";
import type { CvSectionStep } from "@/types/cv";

const CvBuilderClient = () => {
  const controller = useCvFormController();
  const validation = validateCvDocument(controller.document);

  const navigationItems: SectionNavigationItem[] = controller.sectionItems.map((item) => ({
    ...item,
    validationState: validation.sectionStates[item.key],
  }));

  const renderSectionContent = (section: CvSectionStep) => {
    switch (section) {
      case "personalInfo":
        return (
          <PersonalInfoSection
            value={controller.personalInfo}
            onUpdate={controller.updatePersonalInfo}
            errors={validation.personalInfoErrors}
          />
        );
      case "workExperience":
        return (
          <WorkExperienceSection
            items={controller.workExperience}
            onAdd={controller.addWorkExperience}
            onUpdate={controller.updateWorkExperience}
            onRemove={controller.removeWorkExperience}
            onReorder={controller.reorderWorkExperience}
          />
        );
      case "education":
        return (
          <EducationSection
            items={controller.education}
            onAdd={controller.addEducation}
            onUpdate={controller.updateEducation}
            onRemove={controller.removeEducation}
            onReorder={controller.reorderEducation}
          />
        );
      case "skills":
        return (
          <SkillsSection
            items={controller.skills}
            onAdd={controller.addSkill}
            onUpdate={controller.updateSkill}
            onRemove={controller.removeSkill}
            onReorder={controller.reorderSkill}
          />
        );
      case "projects":
        return (
          <ProjectsSection
            items={controller.projects}
            onAdd={controller.addProject}
            onUpdate={controller.updateProject}
            onRemove={controller.removeProject}
            onReorder={controller.reorderProject}
          />
        );
      default:
        return null;
    }
  };

  return (
    <CvBuilderShell
      navigation={
        <StepNavigator
          items={navigationItems}
          activeStep={controller.activeStep}
          onChangeStep={controller.setActiveStep}
        />
      }
      editor={
        <AccordionNavigator
          items={navigationItems}
          activeStep={controller.activeStep}
          onToggleSection={controller.toggleSectionExpanded}
          onJumpToSection={(section) => {
            controller.setActiveStep(section);
            controller.setSectionExpanded(section, true);
          }}
          renderSectionContent={renderSectionContent}
        />
      }
      preview={
        <LivePreview />
      }
    />
  );
};

const HomePage = () => {
  const clientReady = useClientReady();

  if (!clientReady) {
    return (
      <CvBuilderShell
        navigation={<p style={{ margin: 0 }}>Loading navigation...</p>}
        editor={<p style={{ margin: 0 }}>Loading editor...</p>}
        preview={<p style={{ margin: 0 }}>Loading preview...</p>}
      />
    );
  }

  return <CvBuilderClient />;
};

export default HomePage;
