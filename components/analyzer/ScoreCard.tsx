import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export function ScoreCard() {
  const score = 85;
  const metrics = [
    { name: "ATS Compatibility", score: 90 },
    { name: "Content Quality", score: 85 },
    { name: "Format & Structure", score: 80 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Resume Score</h3>
      
      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className="w-24 h-24">
          <CircularProgressbar
            value={score}
            text={`${score}%`}
            styles={buildStyles({
              textSize: '24px',
              pathColor: '#2563eb',
              textColor: '#1f2937',
              trailColor: '#e5e7eb',
            })}
          />
        </div>

        {/* Metrics */}
        <div className="flex-1 space-y-3">
          {metrics.map((metric) => (
            <div key={metric.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{metric.name}</span>
                <span className="font-medium">{metric.score}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div 
                  className="h-2 bg-blue-600 rounded-full transition-all"
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 