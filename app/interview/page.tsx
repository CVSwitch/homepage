"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { InterviewTypeSelector } from "@/components/interview/InterviewTypeSelector";
import { JobDescriptionButton } from "@/components/interview/JobDescriptionButton";
import { InterviewChat } from "@/components/interview/InterviewChat";
import { PracticeMode } from "@/components/interview/PracticeMode";
import { Timer } from "@/components/interview/Timer";
import { FeedbackSummary } from "@/components/interview/FeedbackSummary";

export type InterviewType = "behavioral" | "technical" | "case-study" | "hr" | "resume-based";

export default function InterviewPrep() {
  const [selectedType, setSelectedType] = useState<InterviewType>("behavioral");
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [jobDescription, setJobDescription] = useState<string | null>(null);

  const handleJobDescriptionSubmit = (description: string) => {
    console.log("Job description submitted:", description);
    setJobDescription(description);
    setSelectedType('resume-based');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col">
            <div className="border-b border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <InterviewTypeSelector
                    selected={selectedType}
                    onSelect={setSelectedType}
                  />
                  <JobDescriptionButton
                    onJobDescriptionSubmit={handleJobDescriptionSubmit}
                    hasJobDescription={!!jobDescription}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Timer isActive={isPracticeMode} />
                  <PracticeMode
                    isActive={isPracticeMode}
                    onToggle={() => setIsPracticeMode(!isPracticeMode)}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              {showFeedback ? (
                <FeedbackSummary
                  onClose={() => setShowFeedback(false)}
                />
              ) : (
                <InterviewChat
                  interviewType={selectedType}
                  isPracticeMode={isPracticeMode}
                  onComplete={() => setShowFeedback(true)}
                  jobDescription={jobDescription}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 