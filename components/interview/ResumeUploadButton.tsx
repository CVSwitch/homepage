import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";

interface Props {
  onResumeUpload: (file: File) => void;
  resumeFile: File | null;
}

export function ResumeUploadButton({ onResumeUpload, resumeFile }: Props) {
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onResumeUpload(file);
    }
  };

  return (
    <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer">
      <DocumentArrowUpIcon className="w-5 h-5 text-blue-600" />
      <span>{resumeFile ? resumeFile.name : "Upload Resume"}</span>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleResumeUpload}
      />
    </label>
  );
} 