"use client";

import AwardsForm from "./forms/AwardsForm";
import EducationForm from "./forms/EducationForm";
import InterestForm from "./forms/InterestForm";
import LanguagesForm from "./forms/LanguagesForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ReferenceForm from "./forms/ReferenceForm";
import { ResumeProvider, useResume } from "./forms/ResumeProvider";
import SkillsForm from "./forms/SkillsForm";
import VolunteerForm from "./forms/VolunteerForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import ProjectsForm from "./forms/ProjectsForm";
import ResumePreviewSection from "./ResumePreviewSection";
import { ResumeValues } from "@/lib/validation";

interface ResumeEditorProps {
  initialData?: ResumeValues;
}

export default function ResumeEditor({ initialData }: ResumeEditorProps) {
  return (
    <ResumeProvider initialData={initialData}>
      <div className="flex h-screen">
        <main className="flex grow">
          <div className="w-1/2 px-4 overflow-y-auto pb-10 hidden-scrollbar">
            <PersonalInfoForm />
            <WorkExperienceForm />
            <EducationForm />
            <ProjectsForm />
            <SkillsForm />
            <LanguagesForm />
            <VolunteerForm />
            <InterestForm />
            <ReferenceForm />
            <AwardsForm />
          </div>
          <div className="grow border-r h-full" />
          <ResumePreviewSection />
        </main>
      </div>
    </ResumeProvider>
  );
}

