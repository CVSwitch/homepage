"use client";

import { useState, useRef, useEffect } from "react";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import { Loader2 } from "lucide-react";
import { resumeService } from "@/services/resumeService";

interface Resume {
  id: string;
  name: string;
  lastModified: string;
  url?: string;
  cloudPath?: string;
  jsonUrl?: string | null;
  parsingStatus?: "parsing" | "completed" | "failed" | undefined;
}

interface ResumeAnalysis {
  Areas_of_Improvment: string[];
  strengths: string[];
}

export function ResumeSection() {
  const { user } = useAuth();
  const { 
    resumes, 
    isLoading, 
    uploadResume, 
    uploadLoading 
  } = useResumes(user?.uid);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "strengths" | "weaknesses" | "improvements"
  >("strengths");
  const [parsingStatus, setParsingStatus] = useState<"idle" | "parsing" | "completed">("idle");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && user) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setParsingStatus("parsing");
      
      try {
        // Upload and initiate parsing
        const uploadedResume = await uploadResume(file);
        console.log('Resume uploaded and parsing initiated:', uploadedResume);
        
        // Check parsing status periodically
        const checkParsingStatus = setInterval(async () => {
          const updatedResumes = await resumeService.getUserResumes(user.uid);
          const uploadedResumeStatus = updatedResumes.find(r => r.id === uploadedResume.id);
          
          if (uploadedResumeStatus?.parsingStatus === "completed") {
            setParsingStatus("completed");
            clearInterval(checkParsingStatus);
          }
        }, 5000); // Check every 5 seconds
        
        // Clear interval after 2 minutes to prevent infinite checking
        setTimeout(() => clearInterval(checkParsingStatus), 120000);
        
      } catch (error) {
        console.error('Error uploading resume:', error);
        setParsingStatus("idle");
      }
    }
  };

  const handleAnalyze = async (resume: Resume) => {
    if (!user?.uid) {
      setError('Please sign in to analyze resumes');
      return;
    }

    if (!resume.jsonUrl) {
      setError('Resume is still being parsed. Please wait a moment and try again.');
      return;
    }

    if (resume.parsingStatus !== "completed") {
      setError('Please wait for the resume to be parsed before analyzing');
      return;
    }

    setAnalysisLoading(true);
    setShowAnalysisModal(true);
    setError(null);
    
    try {
      console.log('Analyzing resume:', resume);
      const analysis = await resumeService.analyzeResume(user.uid, resume.jsonUrl);
      setCurrentAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while analyzing the resume');
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">
            Resume Optimizer
          </h1>

          {/* Primary Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer"
            >
              {uploadLoading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              ) : (
                <DocumentArrowUpIcon className="w-12 h-12 text-indigo-600 mb-3" />
              )}
              <h3 className="font-semibold text-lg mb-1 text-slate-800">Upload Resume</h3>
              <p className="text-slate-500 text-center">
                Upload an existing resume file
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>

            <Link href="/editor-app/editor">
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer h-full">
                <PencilIcon className="w-12 h-12 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1 text-slate-800">
                  Create from Scratch
                </h3>
                <p className="text-slate-500 text-center">
                  Build a new resume with our editor
                </p>
              </div>
            </Link>
          </div>
          
          {/* Parsing Status Message */}
          {parsingStatus !== "idle" && (
            <div className={`text-center p-2 mb-6 rounded-lg ${
              parsingStatus === "parsing" 
                ? "bg-amber-50 text-amber-700" 
                : "bg-green-50 text-green-700"
            }`}>
              {parsingStatus === "parsing" 
                ? "Your resume is being parsed. This may take a few moments..." 
                : "Resume successfully parsed! You can now analyze it."}
            </div>
          )}

          {/* Past Resumes Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Past Resumes</h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-500">Loading your resumes...</p>
              </div>
            ) : resumes.length > 0 ? (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
                      <div>
                        <p className="font-medium text-slate-800">{resume.name}</p>
                        <p className="text-sm text-slate-500">
                          Last modified: {resume.lastModified}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAnalyze(resume)}
                        variant="default"
                        size="sm"
                        className={`
                          relative overflow-hidden transition-all duration-300
                          ${!resume.jsonUrl || resume.parsingStatus !== "completed"
                            ? "bg-slate-300 cursor-not-allowed opacity-50"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          }
                        `}
                        disabled={!resume.jsonUrl || resume.parsingStatus !== "completed"}
                      >
                        <div className="flex items-center gap-2">
                          {resume.parsingStatus === "parsing" ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Parsing...</span>
                            </>
                          ) : !resume.jsonUrl ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <svg 
                                className="w-4 h-4 animate-pulse" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.96-.464-2.58-1.191l-.547-.547z" 
                                />
                              </svg>
                              <span>Analyze</span>
                            </>
                          )}
                        </div>
                        {resume.jsonUrl && resume.parsingStatus === "completed" && (
                          <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-300" />
                        )}
                      </Button>

                      <Link href={`/resume-optimizer/${resume.id}`}>
                        <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100">
                          <PencilIcon className="w-5 h-5" />
                        </Button>
                      </Link>

                      {resume.url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-600 hover:bg-slate-100"
                          onClick={() => window.open(resume.url, '_blank')}
                        >
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>
                  {user ? "No resumes found. Upload or create a new resume to get started." : 
                   "Please sign in to view your resumes."}
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
            <DialogTitle className="text-slate-800">Resume Analysis</DialogTitle>
          </DialogHeader>

          {error ? (
            <div className="flex items-center justify-center p-12 text-red-600">
              <p>{error}</p>
            </div>
          ) : analysisLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-3 text-slate-600">Analyzing your resume...</span>
            </div>
          ) : currentAnalysis ? (
            <div className="flex h-[500px]">
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
                  {activeTab === "improvements" ? "Areas of Improvement" : activeTab}
                </h3>

                <ul className="space-y-4">
                  {activeTab === "strengths" && currentAnalysis.strengths && 
                    currentAnalysis.strengths.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-emerald-500"></span>
                        <p className="text-slate-700">{item}</p>
                      </li>
                    ))
                  }
                  {activeTab === "improvements" && currentAnalysis.Areas_of_Improvment && 
                    currentAnalysis.Areas_of_Improvment.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-amber-500"></span>
                        <p className="text-slate-700">{item}</p>
                      </li>
                    ))
                  }
                </ul>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12">
              <p className="text-slate-600">No analysis data available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}