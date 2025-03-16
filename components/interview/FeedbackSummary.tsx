interface Props {
  onClose: () => void;
}

export function FeedbackSummary({ onClose }: Props) {
  return (
    <div className="h-full p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Interview Feedback</h2>
        
        <div className="space-y-6">
          {/* Overall Score */}
          <div>
            <h3 className="font-medium mb-2">Overall Performance</h3>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full w-[85%]" />
            </div>
            <div className="flex justify-between mt-1 text-sm text-gray-600">
              <span>85/100</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Strengths</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Clear and structured responses</li>
                <li>Good use of STAR method</li>
                <li>Relevant examples provided</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Areas for Improvement</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Be more concise in responses</li>
                <li>Include more quantifiable results</li>
                <li>Practice time management</li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Start New Practice Session
          </button>
        </div>
      </div>
    </div>
  );
} 