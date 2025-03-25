"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Mail } from "lucide-react";
import ResumeEditor from "./ResumeEditor";
import CoverLetterEditor from "./CoverLetterEditor";
import { useEffect, useState } from "react";

export default function EditorPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "cover-letter" ? "cover-letter" : "resume";
  const [mode, setMode] = useState<"resume" | "cover-letter">(initialMode);

  // This ensures hydration issues are avoided
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Return nothing during SSR
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm">
          <Button
            variant={mode === 'resume' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('resume')}
            className="flex items-center gap-1.5 transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            Resume
          </Button>
          <Button
            variant={mode === 'cover-letter' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('cover-letter')}
            className="flex items-center gap-1.5 transition-all duration-200"
          >
            <Mail className="h-4 w-4" />
            Cover Letter
          </Button>
        </div>
      </div>
      
      {mode === 'resume' ? (
          <ResumeEditor />
      ) : (
        <CoverLetterEditor />
      )}
    </div>
  );
}
