"use client";

import { useState, useRef } from 'react';
import { DocumentArrowUpIcon, PencilIcon, ArrowDownTrayIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import { Sidebar } from "@/components/Sidebar";

interface CoverLetter {
  id: string;
  name: string;
  lastModified: string;
  company?: string;
  position?: string;
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
    { id: '1', name: 'Software_Engineer_Google.pdf', company: 'Google', position: 'Software Engineer', lastModified: '2024-03-15' },
    { id: '2', name: 'Product_Manager_Amazon.pdf', company: 'Amazon', position: 'Product Manager', lastModified: '2024-03-10' },
  ]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [analysis, setAnalysis] = useState<CoverLetterAnalysis>({
    fileName: 'Software_Engineer_Google.pdf',
    strengths: [
      'Strong opening that captures attention',
      'Clear connection between your skills and job requirements',
      'Professional closing with call to action'
    ],
    weaknesses: [
      'Too lengthy - exceeds one page',
      'Some generic statements that could apply to any job',
      'Missing specific achievements that demonstrate skills'
    ],
    improvements: [
      'Trim content to fit on one page (300-400 words)',
      'Add specific examples of past work that relates to the position',
      'Customize the opening to mention the company by name'
    ]
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      // In a real app, you would upload the file to your backend here
      // For now, we'll just add it to the pastCoverLetters list
      const newCoverLetter: CoverLetter = {
        id: Date.now().toString(),
        name: file.name,
        lastModified: new Date().toISOString().split('T')[0]
      };
      
      setPastCoverLetters([newCoverLetter, ...pastCoverLetters]);
      
      // Mock analysis update
      setAnalysis({
        fileName: file.name,
        strengths: [
          'Good formatting and structure',
          'Professional tone throughout',
          'Addresses key requirements from job posting'
        ],
        weaknesses: [
          'Introduction could be more compelling',
          'Some paragraphs are too long',
          'Missing personalization for the company'
        ],
        improvements: [
          'Start with a stronger hook that shows enthusiasm',
          'Break longer paragraphs into shorter ones for readability',
          'Research the company and mention specific aspects that appeal to you'
        ]
      });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownload = (coverLetterId: string) => {
    // In a real app, this would trigger a download of the cover letter file
    console.log(`Downloading cover letter with ID: ${coverLetterId}`);
    alert(`Downloading cover letter...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Cover Letter Creator</h1>
          
          {/* Primary Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div 
              onClick={triggerFileInput}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
            >
              <DocumentArrowUpIcon className="w-12 h-12 text-blue-600 mb-3" />
              <h3 className="font-semibold text-lg mb-1">Upload Cover Letter</h3>
              <p className="text-gray-500 text-center">Upload an existing cover letter file</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>
            
            <Link href="/cover-letter/new">
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer h-full">
                <PencilIcon className="w-12 h-12 text-blue-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Create from Scratch</h3>
                <p className="text-gray-500 text-center">Build a new cover letter with our editor</p>
              </div>
            </Link>
          </div>
          
          {/* Past Cover Letters Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Past Cover Letters</h2>
            
            {pastCoverLetters.length > 0 ? (
              <div className="space-y-3">
                {pastCoverLetters.map((coverLetter) => (
                  <div key={coverLetter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-medium">{coverLetter.name}</p>
                        {coverLetter.company && coverLetter.position && (
                          <p className="text-sm text-gray-600">
                            {coverLetter.position} at {coverLetter.company}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">Last modified: {coverLetter.lastModified}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/cover-letter/${coverLetter.id}`}>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      </Link>
                      
                      <button 
                        onClick={() => handleDownload(coverLetter.id)}
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
                <p>No cover letters found. Upload or create a new cover letter to get started.</p>
              </div>
            )}
          </div>
          
          {/* Analysis Section */}
          {analysis && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Cover Letter Analysis</h2>
              
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