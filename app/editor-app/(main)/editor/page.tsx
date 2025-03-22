"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ResumeProvider } from "./forms/ResumeProvider";
import ResumeEditor from "./ResumeEditor";
import { useEffect, useState } from "react";

export default function EditorPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // This ensures hydration issues are avoided
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Return nothing during SSR
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <ResumeProvider>
        <ResumeEditor />
      </ResumeProvider>
    </div>
  );
}
