export function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-8">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Ready to optimize your career?</h2>
          <p className="text-gray-600 mb-4">
            Let our AI-powered assistant help you create a standout resume!
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            Get Started
          </button>
        </div>
        <div className="relative w-48 h-48">
          <div className="absolute bottom-0 right-0 h-full w-full bg-blue-200 rounded-full opacity-20" />
        </div>
      </div>
    </div>
  );
} 