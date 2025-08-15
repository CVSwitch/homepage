"use client";

import { useState, useRef } from "react";
import {
  DocumentArrowUpIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TrashIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import { Loader2 } from "lucide-react";
import { resumeService } from "@/services/resumeService";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Resume {
  id: string;
  name: string;
  lastModified: string;
  url?: string;
  cloudPath?: string;
  jsonUrl?: string | null;
  parsingStatus?: "parsing" | "completed" | "failed" | undefined;
  isTailored?: boolean;
  originalResumeId?: string;
}

interface ResumeAnalysis {
  Areas_of_Improvment: string[];
  strengths: string[];
}

interface TailorModalProps {
  resumes: Resume[];
  onTailor: (jobDescription: string, resumeId: string) => void;
}

export function ResumeSection() {
  const { user } = useAuth();
  const {
    resumes,
    isLoading,
    uploadResume,
    uploadLoading
  } = useResumes(user?.uid);

  // console.log(resumes, 'resumes')

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "strengths" | "weaknesses" | "improvements"
  >("strengths");
  const [parsingStatus, setParsingStatus] = useState<"idle" | "parsing" | "completed" | "failed">("idle");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [currentlyParsingResumeId, setCurrentlyParsingResumeId] = useState<string | null>(null);
  const [showTailorSuccessModal, setShowTailorSuccessModal] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && user) {
      const file = event.target.files[0];
      setParsingStatus("idle");

      try {
        // Upload the resume
        const uploadedResume = await uploadResume(file);

        // Show parsing status
        setParsingStatus("parsing");

        // Check if response has expected structure with resume_id
        if (uploadedResume && typeof uploadedResume === 'object' && 'data' in uploadedResume) {
          const data = uploadedResume.data as unknown;
          if (data && typeof data === 'object' && data !== null && 'resume_id' in data) {
            const resumeId = (data as { resume_id: string }).resume_id;
            setCurrentlyParsingResumeId(resumeId);

            // Call parse_uploaded_resume endpoint
            const parseResponse = await axios.get(
              `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PARSE_UPLOADED_RESUME}?resume_id=${resumeId}&user_id=${user.uid}`
            );
            if (parseResponse.status === 200) {
              setParsingStatus("completed");
              setCurrentlyParsingResumeId(null);

              // console.log("Resume parsing completed successfully:", {
              //   resumeId: resumeId,
              //   parseResponse: parseResponse.data,
              //   uploadedResume: uploadedResume
              // });
            } else {
              setParsingStatus("failed");
              setCurrentlyParsingResumeId(null);
              setError("Failed to parse resume. Please try again.");
            }
          } else {
            setParsingStatus("failed");
            setCurrentlyParsingResumeId(null);
            setError("Failed to get resume ID. Please try again.");
          }
        } else {
          setParsingStatus("failed");
          setCurrentlyParsingResumeId(null);
          setError("Failed to get resume ID. Please try again.");
        }
      } catch (error) {
        console.error("Error in resume upload/parsing:", error);
        setParsingStatus("failed");
        setCurrentlyParsingResumeId(null);
        setError("An error occurred while processing your resume. Please try again.");
      }
    }
  };

  const handleAnalyze = async (resume: Resume) => {
    if (!user?.uid || !resume.jsonUrl) {
      setError('Missing required data for analysis');
      return;
    }

    setAnalysisLoading(true);
    setShowAnalysisModal(true);
    setError(null);

    try {
      const analysis = await resumeService.analyzeResume(user.uid, resume.jsonUrl);
      // console.log('Analysis response:', analysis); // Debug log
      setCurrentAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while analyzing the resume');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!user?.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELETE_RESUME}`,
        {
          user_id: user.uid,
          resume_id: resumeId
        }
      );

      if (response.status === 200) {
        // Refresh the resumes list
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      setError('Failed to delete resume. Please try again.');
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleDeleteClick = (resumeId: string) => {
    setResumeToDelete(resumeId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (resumeToDelete) {
      await handleDelete(resumeToDelete);
      setShowDeleteModal(false);
      setResumeToDelete(null);
    }
  };


  const handleTailorResume = async (jobDescription: string, resumeId: string) => {
    // console.log('handleTailorResume called with:', { jobDescription, resumeId });

    if (!user?.uid) {
      setError('Please sign in to tailor your resume');
      return;
    }

    setError(null);

    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TAILOR_RESUME}`;
      // console.log('Making request to:', url);

      const requestData = {
        user_id: user.uid,
        resume_id: resumeId,
        job_description: jobDescription
      };

      // console.log('Request payload:', requestData);

      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // console.log('Tailor resume response:', response.data);

      // Check if we have a successful response with tailored_resume_id
      if (response.data?.data?.data?.tailored_resume_id) {
        const tailoredResumeId = response.data.data.data.tailored_resume_id;
        const tailoredData = response.data.data.data.parsed_json;

        // console.log('Redirecting to editor with original resume ID and tailored resume ID:', {
        //   originalResumeId: resumeId,
        //   tailoredResumeId: tailoredResumeId,
        //   tailoredData: tailoredData
        // });

        // Store tailored data in session storage for forms to access
        if (tailoredData) {
          sessionStorage.setItem('tailoredResumeData', JSON.stringify(tailoredData));
        }

        // Show success modal briefly then redirect
        setShowTailorSuccessModal(true);

        // Redirect to editor with the ORIGINAL resume ID for loading form data
        // and the tailored resume ID for fetching suggestions
        setTimeout(() => {
          window.location.href = `/editor-app/editor?resume_id=${resumeId}&tailored_resume_id=${tailoredResumeId}&tailored=true`;
        }, 2000);
      } else {
        throw new Error('Invalid response format: missing tailored_resume_id');
      }
    } catch (error) {
      console.error('Error tailoring resume:', error);
      if (axios.isAxiosError(error)) {
        // console.log('Response data:', error.response?.data);
        // console.log('Response status:', error.response?.status);
      }
      setError(error instanceof Error ? error.message : 'An error occurred while tailoring the resume');
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
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

            <TailorModal
              resumes={resumes}
              onTailor={handleTailorResume}
            />
          </div>

          {/* Parsing Status Message */}
          {parsingStatus !== "idle" && (
            <div className={`text-center p-2 mb-6 rounded-lg ${parsingStatus === "parsing"
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
                    className={`flex items-center justify-between p-3 bg-slate-50 rounded-lg ${currentlyParsingResumeId === resume.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-800">{resume.name}</p>
                        </div>
                        <p className="text-sm text-slate-500">
                          Last modified: {resume.lastModified}
                        </p>
                        {currentlyParsingResumeId === resume.id && (
                          <p className="text-sm text-amber-600">Parsing in progress...</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAnalyze(resume)}
                        variant="default"
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        disabled={currentlyParsingResumeId === resume.id}
                      >
                        Analyze
                      </Button>

                      <Link href={`/editor-app/editor?resume_id=${resume.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-600 hover:bg-slate-100"
                          disabled={currentlyParsingResumeId === resume.id}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Button>

                      </Link>

                      {resume.url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-600 hover:bg-slate-100"
                          onClick={() => window.open(resume.url, '_blank')}
                          disabled={currentlyParsingResumeId === resume.id}
                        >
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(resume.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        disabled={currentlyParsingResumeId === resume.id}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </Button>
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

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === "strengths"
                      ? "bg-indigo-100 text-indigo-700 font-medium border-l-4 border-indigo-500"
                      : "hover:bg-slate-100 text-slate-700"
                      }`}
                  >
                    Strengths
                  </button>
                  <button
                    onClick={() => setActiveTab("improvements")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === "improvements"
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

      {/* Tailor Success Modal */}
      <Dialog open={showTailorSuccessModal} onOpenChange={setShowTailorSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">
              Resume Tailored Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600">
              Your resume has been tailored for the job description. You will be redirected to the editor to review the tailored suggestions for skills and work experience sections.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              You can accept or reject individual suggestions in the editor.
            </p>
          </div>
          <DialogFooter>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-2"></div>
              <span className="text-slate-600">Redirecting to editor...</span>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TailorModal({ resumes, onTailor }: TailorModalProps) {
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);

  const handleTailor = async () => {
    if (!jobDescription.trim() || !selectedResumeId) {
      return;
    }
    setIsTailoring(true);
    try {
      await onTailor(jobDescription, selectedResumeId);
      // Clear the form after successful tailoring
      setJobDescription("");
      setSelectedResumeId("");
      setShowTailorModal(false);
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowTailorModal(true)}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer"
      >
        <SparklesIcon className="w-12 h-12 text-indigo-600 mb-3" />
        <h3 className="font-semibold text-lg mb-1 text-slate-800">
          Tailor Resume
        </h3>
        <p className="text-slate-500 text-center">
          Customize your resume for specific job descriptions
        </p>
      </div>

      <Dialog open={showTailorModal} onOpenChange={setShowTailorModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">
              Tailor Your Resume
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Paste Job Description
              </label>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                className="min-h-[150px] resize-none border-slate-200 focus:border-indigo-300 focus:ring-indigo-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Select Resume
              </label>
              <Select
                value={selectedResumeId}
                onValueChange={setSelectedResumeId}
              >
                <SelectTrigger className="w-full border-slate-200 focus:border-indigo-300 focus:ring-indigo-300">
                  <SelectValue placeholder="Choose a resume">
                    {selectedResumeId && (
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4 text-slate-500" />
                        <span>{resumes.find(r => r.id === selectedResumeId)?.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-lg">
                  {resumes.map((resume) => (
                    <SelectItem
                      key={resume.id}
                      value={resume.id}
                      className="relative flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-slate-50 focus:bg-slate-50 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <DocumentTextIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium">{resume.name}</span>
                          <span className="text-xs text-slate-500">
                            Last modified: {resume.lastModified}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleTailor}
              disabled={!jobDescription.trim() || !selectedResumeId || isTailoring}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {isTailoring ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Tailoring Resume...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Tailor Resume
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}