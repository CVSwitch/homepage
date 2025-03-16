export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Resume Stats */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Resume Analytics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Resume Score</span>
              <span className="font-semibold">85/100</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full w-[85%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Completion</span>
              <span className="font-semibold">90%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-2 bg-green-500 rounded-full w-[90%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-gray-600">Updated Software Engineer Resume</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-gray-600">Completed Interview Practice</span>
          </div>
        </div>
      </div>
    </div>
  );
} 