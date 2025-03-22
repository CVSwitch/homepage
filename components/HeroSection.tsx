import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { completeOnboarding } from '@/lib/firebase';

// Define the offerings for the user with their corresponding routes
const offerings = [
  { id: 'resume', label: 'I need a better resume', route: '/resume-optimizer' },
  { id: 'linkedin', label: 'I want a stronger LinkedIn profile', route: '/linkedin-optimizer' },
  { id: 'cover-letter', label: 'I need a cover letter', route: '/cover-letter' },
  { id: 'interview', label: 'I want to prepare for an interview', route: '/interview-prep' },
];

interface HeroSectionProps {
  user: any; // Adjust the type based on your user object
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
  const [selectedOfferingOption, setSelectedOfferingOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOfferings, setShowOfferings] = useState(!hasCompletedOnboarding);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      console.log('File selected:', event.target.files[0].name);
    }
  };

  const handleUpload = () => {
    console.log('Upload button clicked');
    if (selectedFile) {
      console.log('Selected file:', selectedFile.name);
      onUploadResume(selectedFile);
      setSelectedFile(null);
    } else {
      console.log('No file selected');
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleOfferingSelect = (optionId: string) => {
    setSelectedOfferingOption(optionId);
  };

  const handleOfferingContinue = async () => {
    if (selectedOfferingOption && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // If user hasn't completed onboarding, mark it as complete
        if (!hasCompletedOnboarding && onOnboardingComplete) {
          await onOnboardingComplete(selectedOfferingOption);
        }
        
        // Find the selected option to get its route
        const selectedOption = offerings.find(option => option.id === selectedOfferingOption);
        
        if (selectedOption) {
          // Navigate to the corresponding route
          router.push(selectedOption.route);
        } else {
          // If no matching option is found, just hide the offerings
          setShowOfferings(false);
        }
      } catch (error) {
        console.error('Error processing selection:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Toggle between offerings and regular view
  const toggleOfferings = () => {
    setShowOfferings(!showOfferings);
  };

  // If showing offerings (either for new users or by choice)
  if (showOfferings) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-6 mb-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">What brings you here?</h2>
            {hasCompletedOnboarding && (
              <button 
                onClick={toggleOfferings}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Skip to dashboard
              </button>
            )}
          </div>
          
          <div className="space-y-4 mb-8">
            {offerings.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOfferingSelect(option.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedOfferingOption === option.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleOfferingContinue}
            disabled={!selectedOfferingOption || isSubmitting}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              !selectedOfferingOption || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </div>
    );
  }

  // Regular HeroSection view
  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-8">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-blue-600 font-semibold text-xl">Ready to optimize your career?</h2>
            <button 
              onClick={toggleOfferings}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Change your focus
            </button>
          </div>
          
          <div className="text-gray-600 mb-4">
            <h3 className="font-semibold">Welcome, {user?.displayName || 'User'}!</h3>
            
            {hasUploadedResume ? (
              <p className="mb-3">
                Let our AI-powered assistant help you create a standout resume! You can also upload additional resumes below.
              </p>
            ) : (
              <p className="mb-3">
                Start by uploading your resume to unlock analysis, editing, and interview prep tools.
              </p>
            )}
            
            <div className="mt-4 flex items-center flex-wrap gap-2">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                onClick={triggerFileInput}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {hasUploadedResume ? 'Upload Another Resume' : 'Upload Resume'}
              </button>
              
              {selectedFile && (
                <>
                  <span className="text-gray-500 mx-2">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={handleUpload}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Confirm Upload
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="relative w-48 h-48">
          <div className="absolute bottom-0 right-0 h-full w-full bg-blue-200 rounded-full opacity-20" />
        </div>
      </div>

      {/* View Past Resumes Section */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2 text-xl text-blue-600">View Past Resumes</h3>
        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
          {pastResumes.length > 0 ? (
            pastResumes.map((resume, index) => (
              <div key={index} className="p-2 border-b last:border-b-0">
                {resume}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No past resumes uploaded.</p>
          )}
        </div>
      </div>
    </div>
  );
}; 