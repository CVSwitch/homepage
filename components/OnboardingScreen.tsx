import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the options for the onboarding screen
const options = [
  { id: 'resume', label: 'I need a better resume' },
  { id: 'linkedin', label: 'I want a stronger LinkedIn profile' },
  { id: 'cover-letter', label: 'I need a cover letter' },
  { id: 'interview', label: 'I want to prepare for an interview' },
  { id: 'job-search', label: 'I need AI-powered job search help' },
];

interface OnboardingScreenProps {
  onComplete: (selectedOption: string) => Promise<void>;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleContinue = async () => {
    if (selectedOption) {
      setIsSubmitting(true);
      try {
        await onComplete(selectedOption);
        router.push('/home');
      } catch (error) {
        console.error('Error completing onboarding:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">What brings you here?</h1>
        
        <div className="space-y-4 mb-8">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                selectedOption === option.id
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        <button
          onClick={handleContinue}
          disabled={!selectedOption || isSubmitting}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            !selectedOption || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}; 