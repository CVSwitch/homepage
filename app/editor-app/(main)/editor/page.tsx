"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Mail } from "lucide-react";
import ResumeEditor, { ResumeEditorRef } from "./ResumeEditor";
import CoverLetterEditor from "./CoverLetterEditor";
import ResumePreviewSection from "./ResumePreviewSection";
import { useEffect, useRef, useState } from "react";
import { API_CONFIG } from "@/config/api";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface ApiResponse {
  data: {
    public_url: string;
    cloud_file_path: string;
    file_name: string;
    template: string;
    user_resume_id: string;
  }
}

interface ResumeDataResponse {
  data: {
    parsed_json: any;
    template: string;
  };
  message: string;
  status: number;
}

export default function EditorPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "cover-letter" ? "cover-letter" : "resume";
  const resumeId = searchParams.get("resume_id");
  const tailoredResumeId = searchParams.get("tailored_resume_id");
  const isTailored = searchParams.get("tailored") === "true";
  const [mode, setMode] = useState<"resume" | "cover-letter">(initialMode);
  const { user } = useAuth();
  const resumeEditorRef = useRef<ResumeEditorRef>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const [userResumeId, setUserResumeId] = useState<string | null>(resumeId);
  const [initialResumeData, setInitialResumeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ensure component is mounted before accessing search params
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsClient(true);
    if (resumeId && user?.uid) {
      setIsLoading(true);
      console.log('🔄 Fetching resume data for:', { resumeId, userId: user.uid });
      
      // Fetch resume data when resumeId is present
      axios.get<ResumeDataResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_RESUME_DATA}?user_id=${user.uid}&resume_id=${resumeId}`
      )
        .then((response) => {
          console.log('✅ API Response:', response.data);
          if (response.data.data) {
            console.log('📊 Parsed JSON data:', response.data.data.parsed_json);
            
            // Transform the data structure from 'basics' to 'personalInfo'
            if (response.data.data.parsed_json && response.data.data.parsed_json.basics) {
              const transformedData = {
                ...response.data.data.parsed_json,
                personalInfo: response.data.data.parsed_json.basics,
                // Remove the old 'basics' key
                basics: undefined
              };
              
              // Clean up the undefined key
              delete transformedData.basics;
              
              console.log('🔄 Transformed data:', transformedData);
              setInitialResumeData(transformedData);
            } else {
              setInitialResumeData(response.data.data.parsed_json);
            }
            
            setUserResumeId(resumeId);
          } else {
            console.log('❌ No data in response');
          }
        })
        .catch((error) => {
          console.error("Error fetching resume data:", error);
          setValidationMessage("Error loading resume data. Please try again.");
          setTimeout(() => setValidationMessage(null), 2000);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [resumeId, user?.uid]);


  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Function to get HTML with styles
  function getHtmlWithStyles(element: HTMLElement): string {
    const clone = element.cloneNode(true) as HTMLElement;
    const styleSheets = Array.from(document.styleSheets);

    styleSheets.forEach((styleSheet) => {
      try {
        const rules = styleSheet.cssRules;
        if (rules) {
          Array.from(rules).forEach((rule) => {
            const cssRule = rule as CSSStyleRule;
            const elements = clone.querySelectorAll(cssRule.selectorText);
            elements.forEach((el) => {
              if (el instanceof HTMLElement) {
                el.style.cssText += cssRule.style.cssText;
              }
            });
          });
        }
      } catch (e) {
        console.error("Error accessing stylesheet rules", e);
      }
    });

    return clone.outerHTML;
  }

  // const downloadPdf = async (url: string) => {
  //   try {
  //     const response = await axios.get(url, {
  //       responseType: 'blob'
  //     });
  //     const blob = new Blob([response.data], { type: 'application/pdf' });
  //     const downloadUrl = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = downloadUrl;
  //     link.download = "resume.pdf";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(downloadUrl);
  //   } catch (error) {
  //     console.error("Error downloading PDF:", error);
  //     setValidationMessage("Error downloading the PDF. Please try again.");
  //     setTimeout(() => setValidationMessage(null), 2000);
  //   }
  // };




  const handleSave = async (resumeData: any, template: string) => {
    // Validation logic
    if (!resumeData) {
      setValidationMessage("Resume data is required.");
      setTimeout(() => setValidationMessage(null), 2000);
      return;
    }

    if (!resumeData.personalInfo?.firstname || !resumeData.personalInfo?.lastname) {
      setValidationMessage("First name and last name are required.");
      setTimeout(() => setValidationMessage(null), 2000);
      return;
    }

    if (!resumeData.workExperiences || resumeData.workExperiences.length === 0) {
      setValidationMessage("At least one work experience is required.");
      setTimeout(() => setValidationMessage(null), 2000);
      return;
    }

    setValidationMessage(null);

    let pdfFile: File | null = null;

    // Generate PDF from HTML
    if (resumePreviewRef.current) {
      const renderedHtmlWithStyles = getHtmlWithStyles(resumePreviewRef.current);

      const options = {
        margin: 1,
        filename: "resume.pdf",
        html2canvas: { scale: 1 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      try {
        // Dynamic import of html2pdf
        const html2pdf = (await import("html2pdf.js")).default;
        
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = renderedHtmlWithStyles;
        document.body.appendChild(tempContainer);

        // Generate PDF blob
        const pdfBlob = await html2pdf().set(options).from(tempContainer).outputPdf("blob");

        // Create file for upload
        pdfFile = new File([pdfBlob], "resume.pdf", { type: "application/pdf" });

        // Trigger download
        const downloadUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        document.body.removeChild(tempContainer);
      } catch (error) {
        console.error("Error generating PDF:", error);
        setValidationMessage("Error generating the PDF. Please try again.");
        setTimeout(() => setValidationMessage(null), 2000);
        return;
      }
    }

    if (!pdfFile) {
      setValidationMessage("Could not generate PDF. Please try again.");
      setTimeout(() => setValidationMessage(null), 2000);
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('resumeData', JSON.stringify(resumeData));
      formData.append('template', template);

      if (userResumeId) {
        formData.append('user_resume_id', userResumeId);
      }

      const response = await axios.post<ApiResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HANDLE_EDITED_RESULT}?user_id=${user?.uid}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Store the user_resume_id for future updates
      if (response.data.data) {
        if (response.data.data.user_resume_id) {
          setUserResumeId(response.data.data.user_resume_id);
        }
      }
    } catch (error) {
      console.error("Error saving resume data:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios Error Response:", error.response?.data);
        setValidationMessage("Error saving the resume. Please try again.");
        setTimeout(() => setValidationMessage(null), 2000);
      }
    }
  };

  const handleDownloadClick = async () => {
    if (resumeEditorRef.current) {
      await resumeEditorRef.current.save();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation and actions */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button, Resume/Cover Letter toggle, and Download button */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={mode === "resume" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode("resume")}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Resume
              </Button>
              <Button
                variant={mode === "cover-letter" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode("cover-letter")}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Cover Letter
              </Button>
            </div>
          </div>


        </div>
      </div>

      {/* Main content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Editor Section */}
        <div className="flex-1 p-6">
          {mode === "resume" ? (
            <ResumeEditor
              ref={resumeEditorRef}
              resumeId={resumeId}
              tailoredResumeId={tailoredResumeId}
              isTailored={isTailored}
              initialData={initialResumeData}
            />
          ) : (
            <CoverLetterEditor />
          )}
        </div>

        {/* Preview Section - Make it wider to fill the space */}
        <div 
          ref={resumePreviewRef}
          className="w-[500px] border-l border-gray-50 bg-white" // Increased from w-96 to w-[500px]
          style={{
            background: 'white',
            height: '100vh',
            overflow: 'auto'
          }}
        >
          <div 
            className="pdf-preview"
            style={{
              background: 'white',
              minHeight: '100%',
              height: '100%',
              width: '100%',
              padding: '20px',
              boxSizing: 'border-box'
            }}
          >
            <ResumePreviewSection
              ref={resumePreviewRef}
              resumeData={initialResumeData}
              template="modern"
            />
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {validationMessage && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {validationMessage}
        </div>
      )}
    </div>
  );
}
