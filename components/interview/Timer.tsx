import { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface Props {
  isActive: boolean;
}

export function Timer({ isActive }: Props) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
      <ClockIcon className="w-4 h-4 text-gray-600" />
      <span className="font-medium">{formatTime(time)}</span>
    </div>
  );
} 