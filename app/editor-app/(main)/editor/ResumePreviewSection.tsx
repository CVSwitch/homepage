import { useRef, useState } from "react";
import ResumePreview from "./ResumePreview";
import TwoColumnResumePreview from "./TwoColumnResumePreview";
import TwoColumnColoredResumePreview from "./TwoColumnColoredResumePreview";
import TemplateDrawer from "./TemplateDrawer";
import SingleColumnColored from "./SingleColumnColored";

type TemplateType = "single" | "double" | "colored" | "singleColored";

export default function ResumePreviewSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<TemplateType>("single");

  return (
    <div className="w-1/2">

      <div className="flex w-full justify-center bg-secondary overflow-y-auto h-[100vh] p-3 relative">
        <TemplateDrawer currentTemplate={template} onTemplateChange={setTemplate} />
        
        {
          (() => {
            switch (template) {
              case "single":
                return <ResumePreview contentRef={contentRef} className="max-w-2xl shadow-md" />;
              case "double":
                return <TwoColumnResumePreview contentRef={contentRef} className="max-w-2xl shadow-md" />;
              case "colored":
                return <TwoColumnColoredResumePreview contentRef={contentRef} className="max-w-2xl shadow-md" />;
              case "singleColored":
                return <SingleColumnColored contentRef={contentRef} className="max-w-2xl shadow-md" />;
              default:
                return null;
            }
          })()
        }
      </div>
    </div>
  );
}
