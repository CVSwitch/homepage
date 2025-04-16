export function ProgressTracker({ progress }: { progress: number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-card">
      <h3 className="font-display font-bold text-lg mb-2">Resume Strength</h3>
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-cvs-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 text-sm text-cvs-neutral">
        {progress < 30 && "Just getting started!"}
        {progress >= 30 && progress < 70 && "Making good progress!"}
        {progress >= 70 && "Resume looking strong!"}
      </div>
    </div>
  );
} 