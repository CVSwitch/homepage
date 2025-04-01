"use client";

import { useState, useRef } from "react";
import {
  DocumentArrowUpIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CoverLetter {
  id: string;
  name: string;
  lastModified: string;
  url?: string;
}

interface CoverLetterAnalysis {
  fileName: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export function CoverLetterSection() {
  const [pastCoverLetters, setPastCoverLetters] = useState<CoverLetter[]>([
    {
      id: "1",
      name: "Software_Engineer_Cover_Letter.pdf",
      lastModified: "2024-03-15",
    },
    { 
      id: "2", 
      name: "Product_Manager_Cover_Letter.pdf", 
      lastModified: "2024-03-10" 
    },
  ]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "strengths" | "weaknesses" | "improvements"
  >("strengths");

  const [currentAnalysis, setCurrentAnalysis] = useState<CoverLetterAnalysis>({
    fileName: "",
    strengths: [],
    weaknesses: [],
    improvements: [],
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const newCoverLetter: CoverLetter = {
        id: Date.now().toString(),
        name: file.name,
        lastModified: new Date().toISOString().split("T")[0],
      };

      setPastCoverLetters([newCoverLetter, ...pastCoverLetters]);
    }
  };

  const handleAnalyze = (coverLetter: CoverLetter) => {
    setCurrentAnalysis({
      fileName: coverLetter.name,
      strengths: [
        "Strong opening paragraph that captures attention",
        "Clear connection between skills and job requirements",
        "Well-structured and professional tone",
      ],
      weaknesses: [
        "Too generic - needs more specific examples",
        "Missing quantifiable achievements",
        "Could better align with company values",
      ],
      improvements: [
        'Add specific accomplishments (e.g., "Increased sales by 30%")',
        "Tailor to the specific company and role",
        "Include a stronger call to action",
      ],
    });
    setShowAnalysisModal(true);
    setActiveTab("strengths");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">
            Cover Letter Optimizer
          </h1>

          {/* Primary Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <DocumentArrowUpIcon className="w-12 h-12 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-lg mb-1 text-slate-800">Upload Cover Letter</h3>
              <p className="text-slate-500 text-center">
                Upload an existing cover letter file
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>

            <Link href="/editor-app/cover-letter-editor">
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer h-full">
                <PencilIcon className="w-12 h-12 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1 text-slate-800">
                  Create from Scratch
                </h3>
                <p className="text-slate-500 text-center">
                  Build a new cover letter with our editor
                </p>
              </div>
            </Link>
          </div>

          {/* Past Cover Letters Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Past Cover Letters</h2>

            {pastCoverLetters.length > 0 ? (
              <div className="space-y-3">
                {pastCoverLetters.map((coverLetter) => (
                  <div
                    key={coverLetter.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
                      <div>
                        <p className="font-medium text-slate-800">{coverLetter.name}</p>
                        <p className="text-sm text-slate-500">
                          Last modified: {coverLetter.lastModified}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAnalyze(coverLetter)}
                        variant="default"
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        Analyze
                      </Button>

                      <Link href={`/cover-letter-optimizer/${coverLetter.id}`}>
                        <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100">
                          <PencilIcon className="w-5 h-5" />
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-600 hover:bg-slate-100"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>
                  No cover letters found. Upload or create a new cover letter to get
                  started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Modal */}
      <Dialog open={showAnalysisModal} onOpenChange={setShowAnalysisModal}>
        <DialogContent className="sm:max-w-4xl p-0 rounded-lg overflow-hidden border-0 shadow-xl">
          <DialogHeader className="border-b border-slate-200 p-4">
            <DialogTitle className="text-slate-800">Cover Letter Analysis</DialogTitle>
          </DialogHeader>

          <div className="flex h-[400px]">
            {/* Sidebar */}
            <div className="w-48 border-r border-slate-200 p-4 bg-slate-50">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab("strengths")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "strengths"
                      ? "bg-indigo-100 text-indigo-700 font-medium border-l-4 border-indigo-500"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  Strengths
                </button>
                <button
                  onClick={() => setActiveTab("weaknesses")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "weaknesses"
                      ? "bg-indigo-100 text-indigo-700 font-medium border-l-4 border-indigo-500"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  Weaknesses
                </button>
                <button
                  onClick={() => setActiveTab("improvements")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "improvements"
                      ? "bg-indigo-100 text-indigo-700 font-medium border-l-4 border-indigo-500"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  Improvements
                </button>
              </div>
            </div>

            {/* Main Content */}
            <ScrollArea className="flex-1 p-6">
              <h3 className="text-lg font-medium mb-4 text-slate-800 capitalize">
                {activeTab}
              </h3>

              <ul className="space-y-4">
                {currentAnalysis[activeTab].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0
                      ${activeTab === "strengths" ? "bg-emerald-500" : ""}
                      ${activeTab === "weaknesses" ? "bg-rose-500" : ""}
                      ${activeTab === "improvements" ? "bg-blue-500" : ""}
                    `}
                    ></span>
                    <p className="text-slate-700">{item}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}