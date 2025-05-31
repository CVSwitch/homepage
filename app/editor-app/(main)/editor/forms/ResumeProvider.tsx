"use client";

import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from "react";
import { ResumeValues } from "@/lib/validation";

interface ResumeContextType {
  resumeData: ResumeValues;
  setResumeData: Dispatch<SetStateAction<ResumeValues>>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: ResumeValues;
}) {
  const [resumeData, setResumeData] = useState<ResumeValues>(
    initialData || {
      personalInfo: {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        summary: "",
        city: "",
        country: "",
        socials: { linkedin: "", github: "" },
      },
      workExperiences: [],
      education: [],
      projects: [],
      skills: {},
      languages: {},
      volunteer: {},
      interests: {},
      awards: {},
      references: {},
    }
  );

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
