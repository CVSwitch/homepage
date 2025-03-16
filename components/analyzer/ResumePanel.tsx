"use client";

import { useState } from "react";
import { DocumentIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

interface ResumePanelProps {
  onResumeSelect: (resumeName: string) => void;
}

export function ResumePanel({ onResumeSelect }: ResumePanelProps) {
  const [resumes] = useState([
    { id: 1, name: "Software_Engineer_Resume.pdf", date: "2024-03-15" },
    { id: 2, name: "Product_Manager_Resume.pdf", date: "2024-03-10" },
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">My Resumes</h2>
      
      {/* Upload Button */}
      <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
        <ArrowUpTrayIcon className="w-5 h-5" />
        Upload Resume
      </button>

      {/* Resume List */}
      <div className="space-y-2">
        {resumes.map((resume) => (
          <button
            key={resume.id}
            onClick={() => onResumeSelect(resume.name)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <DocumentIcon className="w-5 h-5 text-blue-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {resume.name}
              </p>
              <p className="text-xs text-gray-500">{resume.date}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 