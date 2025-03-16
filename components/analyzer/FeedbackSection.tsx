import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface FeedbackItem {
  title: string;
  items: string[];
}

export function FeedbackSection() {
  const [activeSection, setActiveSection] = useState<string | null>("strengths");
  
  const feedback: Record<string, FeedbackItem> = {
    strengths: {
      title: "Strengths",
      items: [
        "Strong technical skills section",
        "Clear work experience progression",
        "Quantifiable achievements",
      ],
    },
    weaknesses: {
      title: "Areas for Improvement",
      items: [
        "Professional summary needs more impact",
        "Some bullet points are too verbose",
        "Skills could be more industry-specific",
      ],
    },
    suggestions: {
      title: "Suggestions",
      items: [
        "Add more quantifiable metrics to achievements",
        "Incorporate relevant keywords for ATS optimization",
        "Streamline bullet points for better readability",
      ],
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Detailed Feedback</h3>
      
      <div className="space-y-3">
        {Object.entries(feedback).map(([key, section]) => (
          <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveSection(activeSection === key ? null : key)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">{section.title}</span>
              <ChevronDownIcon 
                className={`w-5 h-5 transition-transform ${
                  activeSection === key ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {activeSection === key && (
              <div className="p-3 space-y-2">
                {section.items.map((item, index) => (
                  <p key={index} className="text-sm text-gray-600">• {item}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 