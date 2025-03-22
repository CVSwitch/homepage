"use client";

import { useState, useRef } from 'react';
import { DocumentArrowUpIcon, PencilIcon, ArrowDownTrayIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import { Sidebar } from "@/components/Sidebar";

interface Resume {
  id: string;
  name: string;
  lastModified: string;
  url?: string;
}

interface ResumeAnalysis {
  fileName: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export function ResumeSection() {
  const [pastResumes, setPastResumes] = useState<Resume[]>([
    { id: '1', name: 'Software_Engineer_Resume.pdf', lastModified: '2024-03-15' },
    { id: '2', name: 'Product_Manager_Resume.pdf', lastModified: '2024-03-10' },
  ]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [analysis, setAnalysis] = useState<ResumeAnalysis>({
    fileName: 'Software_Engineer_Resume.pdf',
    strengths: [
      'Strong technical skills section',
      'Clear work experience with quantifiable achievements',
      'Well-organized education section'
    ],
    weaknesses: [
      'Summary statement is too generic',
      'Missing relevant certifications',
      'Project descriptions lack impact metrics'
    ],
    improvements: [
      'Add specific achievements with numbers (e.g., "Increased performance by 40%")',
      'Tailor skills section to match job descriptions',
      'Include relevant certifications or courses'
    ]
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      // In a real app, you would upload the file to your backend here
      // For now, we'll just add it to the pastResumes list
      const newResume: Resume = {
        id: Date.now().toString(),
        name: file.name,
        lastModified: new Date().toISOString().split('T')[0]
      };
      
      setPastResumes([newResume, ...pastResumes]);
      
      // Mock analysis update
      setAnalysis({
        fileName: file.name,
        strengths: [
          'Good formatting and structure',
          'Relevant skills highlighted',
          'Education section is well presented'
        ],
        weaknesses: [
          'Work experience lacks specific achievements',
          'Skills section could be more comprehensive',
          'Missing professional summary'
        ],
        improvements: [
          'Add quantifiable achievements to work experience',
          'Expand skills section with relevant technologies',
          'Add a concise professional summary at the top'
        ]
      });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownload = (resumeId: string) => {
    // In a real app, this would trigger a download of the resume file
    console.log(`Downloading resume with ID: ${resumeId}`);
    alert(`Downloading resume...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Resume Optimizer</h1>
          
          {/* Primary Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div 
              onClick={triggerFileInput}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
            >
              <DocumentArrowUpIcon className="w-12 h-12 text-blue-600 mb-3" />
              <h3 className="font-semibold text-lg mb-1">Upload Resume</h3>
              <p className="text-gray-500 text-center">Upload an existing resume file</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>
            
            <Link href="/editor-app/editor">
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer h-full">
                <PencilIcon className="w-12 h-12 text-blue-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Create from Scratch</h3>
                <p className="text-gray-500 text-center">Build a new resume with our editor</p>
              </div>
            </Link>
          </div>
          
          {/* Past Resumes Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Past Resumes</h2>
            
            {pastResumes.length > 0 ? (
              <div className="space-y-3">
                {pastResumes.map((resume) => (
                  <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-medium">{resume.name}</p>
                        <p className="text-sm text-gray-500">Last modified: {resume.lastModified}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/resume-optimizer/${resume.id}`}>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      </Link>
                      
                      <button 
                        onClick={() => handleDownload(resume.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No resumes found. Upload or create a new resume to get started.</p>
              </div>
            )}
          </div>
          
          {/* Analysis Section */}
          {analysis && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Resume Analysis</h2>
              
              <div className="mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Filename:</span> {analysis.fileName}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-green-600">Strengths</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-red-600">Weaknesses</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-blue-600">Improvements</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 