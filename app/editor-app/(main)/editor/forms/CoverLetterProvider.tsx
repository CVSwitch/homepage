"use client";

import { createContext, useContext, useState } from "react";

export interface CoverLetterValues {
  description: string;
  description_text: string;
}

interface CoverLetterContextType {
  coverLetterData: CoverLetterValues;
  setCoverLetterData: (
    data: CoverLetterValues | ((prev: CoverLetterValues) => CoverLetterValues)
  ) => void;
}

const CoverLetterContext = createContext<CoverLetterContextType | undefined>(undefined);

interface CoverLetterProviderProps {
  children: React.ReactNode;
  initialData?: CoverLetterValues;
}

export function CoverLetterProvider({ children, initialData }: CoverLetterProviderProps) {
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterValues>(
    initialData || {
      description: "",
      description_text: "",
    }
  );

  return (
    <CoverLetterContext.Provider value={{ coverLetterData, setCoverLetterData }}>
      {children}
    </CoverLetterContext.Provider>
  );
}

export function useCoverLetter() {
  const context = useContext(CoverLetterContext);
  if (!context) {
    throw new Error("useCoverLetter must be used within a CoverLetterProvider");
  }
  return context;
}
