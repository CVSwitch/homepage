"use client";

import CoverLetterSection from "./CoverLetterSection";
import CoverLetterForm from "./forms/CoverLetterForm";
import { CoverLetterProvider, CoverLetterValues } from "./forms/CoverLetterProvider";

interface CoverLetterEditorProps {
  initialData?: CoverLetterValues;
}

export default function CoverLetterEditor({ initialData }: CoverLetterEditorProps) {
  return (
    <CoverLetterProvider initialData={initialData}>
      <div className="flex h-screen">
        <main className="flex grow">
          <div className="w-1/2 px-4 overflow-y-auto mt-16 pb-10 hidden-scrollbar">
            <CoverLetterForm />
          </div>
          <div className="grow border-r h-full" />
          <CoverLetterSection />
        </main>
      </div>
    </CoverLetterProvider>
  );
}

