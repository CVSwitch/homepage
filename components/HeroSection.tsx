import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { completeOnboarding } from '@/lib/firebase';

const offerings = [
  { id: 'resume', label: 'I need a better resume', route: '/resume-optimizer' },
  { id: 'linkedin', label: 'I want a stronger LinkedIn profile', route: '/linkedin-optimizer' },
  { id: 'cover-letter', label: 'I need a cover letter', route: '/cover-letter' },
  { id: 'interview', label: 'I want to prepare for an interview', route: '/interview-prep' },
];

interface HeroSectionProps {
  user: any;
  hasUploadedResume: boolean;
  onUploadResume: (file: File) => void;
  pastResumes: string[];
  hasCompletedOnboarding: boolean;
  onOnboardingComplete: (selectedOption: string) => Promise<void>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  user, 
  hasUploadedResume, 
  onUploadResume, 
  pastResumes,
  hasCompletedOnboarding,
  onOnboardingComplete
}) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOfferings, setShowOfferings] = useState(!hasCompletedOnboarding);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUploadResume(selectedFile);
      setSelectedFile(null);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCardClick = async (optionId: string) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        if (!hasCompletedOnboarding && onOnboardingComplete) {
          await onOnboardingComplete(optionId);
        }
        
        const selectedOption = offerings.find(option => option.id === optionId);
        if (selectedOption) {
          router.push(selectedOption.route);
        }
      } catch (error) {
        console.error('Error processing selection:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleOfferings = () => {
    setShowOfferings(!showOfferings);
  };

  if (showOfferings) {
    return (
      <div className="bg-white rounded-xl p-8 mb-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What would you start with?</h2>
        <p className="text-gray-500 mb-8">Select an option to begin optimizing your career assets</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offerings.map((option) => (
            <div
              key={option.id}
              onClick={() => handleCardClick(option.id)}
              onMouseEnter={() => setHoveredCard(option.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative p-6 rounded-xl border border-gray-200 transition-all cursor-pointer overflow-hidden
                ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}
                ${hoveredCard === option.id ? 'shadow-lg border-transparent' : 'hover:shadow-md'}
              `}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300
                ${option.id === 'resume' ? 'from-blue-50 to-purple-50' : ''}
                ${option.id === 'linkedin' ? 'from-sky-50 to-blue-50' : ''}
                ${option.id === 'cover-letter' ? 'from-emerald-50 to-teal-50' : ''}
                ${option.id === 'interview' ? 'from-amber-50 to-orange-50' : ''}
                ${hoveredCard === option.id ? 'opacity-100' : 'opacity-0'}
              `}></div>
              
              {/* Animated border effect */}
              <div className={`absolute inset-0 rounded-xl border-2 pointer-events-none transition-all duration-300
                ${option.id === 'resume' ? 'border-blue-200' : ''}
                ${option.id === 'linkedin' ? 'border-sky-200' : ''}
                ${option.id === 'cover-letter' ? 'border-emerald-200' : ''}
                ${option.id === 'interview' ? 'border-amber-200' : ''}
                ${hoveredCard === option.id ? 'opacity-100' : 'opacity-0'}
              `}></div>
              
              <div className="relative flex items-center z-10">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors
                  ${option.id === 'resume' ? 'bg-blue-100 text-blue-600' : ''}
                  ${option.id === 'linkedin' ? 'bg-sky-100 text-sky-600' : ''}
                  ${option.id === 'cover-letter' ? 'bg-emerald-100 text-emerald-600' : ''}
                  ${option.id === 'interview' ? 'bg-amber-100 text-amber-600' : ''}
                `}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    {option.id === 'resume' && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    )}
                    {option.id === 'linkedin' && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    )}
                    {option.id === 'cover-letter' && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    )}
                    {option.id === 'interview' && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    )}
                  </svg>
                </div>
                <div>
                  <h3 className={`font-semibold text-lg transition-colors 
                    ${option.id === 'resume' ? 'text-blue-800' : ''}
                    ${option.id === 'linkedin' ? 'text-sky-800' : ''}
                    ${option.id === 'cover-letter' ? 'text-emerald-800' : ''}
                    ${option.id === 'interview' ? 'text-amber-800' : ''}
                  `}>
                    {option.label}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {option.id === 'resume' && 'Optimize your resume with AI'}
                    {option.id === 'linkedin' && 'Enhance your LinkedIn profile'}
                    {option.id === 'cover-letter' && 'Create a tailored cover letter'}
                    {option.id === 'interview' && 'Prepare for your next interview'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Welcome back, {user?.displayName || 'User'}!</h2>
            <button 
              onClick={toggleOfferings}
              className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
            >
              Change your focus
            </button>
          </div>
          
          <div className="text-gray-600 mb-6">
            {hasUploadedResume ? (
              <p className="mb-4 text-gray-700">
                Let our AI-powered assistant help you create a standout resume! You can also upload additional resumes below.
              </p>
            ) : (
              <p className="mb-4 text-gray-700">
                Start by uploading your resume to unlock analysis, editing, and interview prep tools.
              </p>
            )}
            
            <div className="mt-6 flex flex-col sm:flex-row items-start gap-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                onClick={triggerFileInput}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                {hasUploadedResume ? 'Upload Another Resume' : 'Upload Resume'}
              </button>
              
              {selectedFile && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span className="text-gray-600 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={handleUpload}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    Confirm Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {pastResumes.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-3 text-gray-800">Your Resume History</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {pastResumes.map((resume, index) => (
              <div 
                key={index} 
                className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-700">{resume}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};