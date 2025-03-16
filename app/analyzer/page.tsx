"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ResumePanel } from "@/components/analyzer/ResumePanel";
import { AnalyzerChat } from "@/components/analyzer/AnalyzerChat";
import { ScoreCard } from "@/components/analyzer/ScoreCard";
import { FeedbackSection } from "@/components/analyzer/FeedbackSection";

export default function ResumeAnalyzer() {
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="flex h-screen">
          {/* Left Panel - Resume List */}
          <div className="w-72 border-r border-gray-200 bg-white p-4">
            <ResumePanel 
              onResumeSelect={(resume) => {
                setSelectedResume(resume);
                setShowAnalysis(true);
              }}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Analysis Results */}
            {showAnalysis ? (
              <div className="h-[40%] border-b border-gray-200 overflow-y-auto">
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Resume Analysis Results
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <ScoreCard />
                    <FeedbackSection />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[40%] flex items-center justify-center border-b border-gray-200">
                <p className="text-gray-500">
                  Select or upload a resume to begin analysis
                </p>
              </div>
            )}

            {/* Chat Interface */}
            <div className="flex-1">
              <AnalyzerChat 
                isActive={showAnalysis}
                resumeName={selectedResume}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 