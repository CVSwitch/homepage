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
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import html2pdf from "html2pdf.js";

interface ResumeEditorProps {
  initialData?: ResumeValues;
  onSave: (resumeData: ResumeValues, template: string, pdfFile: File) => void;
  contentRef: React.RefObject<HTMLDivElement>;
}

export interface ResumeEditorRef {
  save: () => Promise<void>;
  getResumeData: () => ResumeValues | undefined;
  applyTailoringChanges: (changes: ResumeChanges[]) => void;
}

interface ResumeChanges {
  section: string;
  originalText: string;
  suggestedText: string;
  status: 'pending' | 'accepted' | 'rejected';
}

type TemplateType = "single" | "double" | "colored" | "singleColored";

// Internal component that has access to ResumeProvider context
function ResumeEditorInternal({
  onSave,
  contentRef,
  template,
  setTemplate,
  saveRef
}: {
  onSave: (resumeData: ResumeValues, template: string, pdfFile: File) => void;
  contentRef: React.RefObject<HTMLDivElement>;
  template: TemplateType;
  setTemplate: (template: TemplateType) => void;
  saveRef: React.RefObject<ResumeEditorRef>;
}) {
  const { resumeData, setResumeData } = useResume();

  const handleSave = async () => {
    if (contentRef.current) {
      const options = {
        margin: 1,
        filename: "resume.pdf",
        html2canvas: { scale: 1 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      try {
        const pdfBlob = await html2pdf().set(options).from(contentRef.current).outputPdf("blob");
        const pdfFile = new File([pdfBlob], "resume.pdf", { type: "application/pdf" });
        onSave(resumeData, template, pdfFile);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  const getResumeData = () => {
    return resumeData;
  };

  const applyTailoringChanges = (changes: ResumeChanges[]) => {
    const newResumeData = { ...resumeData };

    changes.forEach(change => {
      if (change.status === 'accepted') {
        // Update the specific section with the suggested text
        switch (change.section) {
          case 'workExperience':
            newResumeData.workExperiences = newResumeData.workExperiences?.map(exp => {
              if (exp.description === change.originalText) {
                return { ...exp, description: change.suggestedText };
              }
              return exp;
            });
            break;
          case 'education':
            newResumeData.education = newResumeData.education?.map(edu => {
              if (edu.courses === change.originalText) {
                return { ...edu, courses: change.suggestedText };
              }
              return edu;
            });
            break;
          case 'projects':
            newResumeData.projects = newResumeData.projects?.map(project => {
              if (project.description === change.originalText) {
                return { ...project, description: change.suggestedText };
              }
              return project;
            });
            break;
          // Add more cases for other sections as needed
        }
      }
    });

    setResumeData(newResumeData);
  };

  // Expose methods through ref
  useEffect(() => {
    if (saveRef.current) {
      saveRef.current.save = handleSave;
      saveRef.current.getResumeData = getResumeData;
      saveRef.current.applyTailoringChanges = applyTailoringChanges;
    }
  }, [resumeData, template]);

  return (
    <div className="flex h-screen">
      <main className="flex grow">
        <div className="w-1/2 px-4 overflow-y-auto mt-16 pb-10 hidden-scrollbar">
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
        <ResumePreviewSection
          template={template}
          setTemplate={setTemplate}
          contentRef={contentRef as React.RefObject<HTMLDivElement>}
        />
      </main>
    </div>
  );
}

const ResumeEditor = forwardRef<ResumeEditorRef, ResumeEditorProps>(
  ({ initialData, onSave, contentRef }, ref) => {
    const [template, setTemplate] = useState<TemplateType>("single");
    const internalSaveRef = useRef<ResumeEditorRef>({ save: async () => { }, getResumeData: () => undefined, applyTailoringChanges: () => { } });

    // Forward the internal save method through the ref
    useImperativeHandle(ref, () => ({
      save: async () => {
        if (internalSaveRef.current) {
          await internalSaveRef.current.save();
        }
      },
      getResumeData: () => {
        if (internalSaveRef.current) {
          return internalSaveRef.current.getResumeData();
        }
        return undefined;
      },
      applyTailoringChanges: (changes: ResumeChanges[]) => {
        if (internalSaveRef.current) {
          internalSaveRef.current.applyTailoringChanges(changes);
        }
      }
    }));

    return (
      <ResumeProvider initialData={initialData}>
        <ResumeEditorInternal
          onSave={onSave}
          contentRef={contentRef}
          template={template}
          setTemplate={setTemplate}
          saveRef={internalSaveRef}
        />
      </ResumeProvider>
    );
  }
);

ResumeEditor.displayName = "ResumeEditor";

export default ResumeEditor;

