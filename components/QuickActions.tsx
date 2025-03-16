import { DocumentIcon, PencilIcon } from "@heroicons/react/24/outline";

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
        <DocumentIcon className="h-5 w-5 text-blue-600" />
        <span>Build New Resume</span>
      </button>
      <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
        <PencilIcon className="h-5 w-5 text-blue-600" />
        <span>View Past Resumes</span>
      </button>
    </div>
  );
} 