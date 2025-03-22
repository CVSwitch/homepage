"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ImportPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchResumeData() {
      try {
        // Use the correct API path with /api prefix
        const response = await fetch("/api/mockResume");
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Resume data fetched successfully:", data);
        
        // Store the data in localStorage or state management
        localStorage.setItem("resumeData", JSON.stringify(data));
        
        // Redirect to editor
        router.push("/editor-app/editor");
      } catch (err) {
        console.error("Error fetching resume data:", err);
        setError("Failed to import resume. Please try again.");
        setLoading(false);
      }
    }

    fetchResumeData();
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="absolute top-4 left-4">
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
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-lg">Importing resume data...</p>
      </div>
    </div>
  );
} 