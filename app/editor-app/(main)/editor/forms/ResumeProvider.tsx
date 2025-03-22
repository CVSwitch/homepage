"use client";

import { createContext, useContext, useState } from "react";
import { ResumeValues } from "@/lib/validation";

interface ResumeContextType {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues | ((prev: ResumeValues) => ResumeValues)) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

interface ResumeProviderProps {
  children: React.ReactNode;
  initialData?: ResumeValues;
}

export function ResumeProvider({ children, initialData }: ResumeProviderProps) {
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
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
