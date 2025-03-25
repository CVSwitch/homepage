import { useRef } from "react";
import CoverLetterPreview from "./CoverLetterPreview";

export default function ResumePreviewSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-1/2">

      <div className="flex w-full justify-center bg-secondary overflow-y-auto h-[100vh] p-3 relative">
      <CoverLetterPreview contentRef={contentRef} className="max-w-2xl shadow-md" />
      </div>
    </div>
  );
}
