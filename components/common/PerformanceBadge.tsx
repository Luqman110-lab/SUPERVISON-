
import React from 'react';
import { PerformanceLevel } from '../../types';
import { getPerformanceColor } from '../../constants';

interface PerformanceBadgeProps {
  level: PerformanceLevel;
  score?: number;
  className?: string;
}

const PerformanceBadge: React.FC<PerformanceBadgeProps> = ({ level, score, className = '' }) => {
  const colorClasses = getPerformanceColor(level);

  return (
    <div className={`px-3 py-1 text-sm font-semibold rounded-full inline-flex items-center ${colorClasses} ${className}`}>
      {level}
      {score !== undefined && <span className="ml-1.5 font-normal opacity-90">({score.toFixed(2)})</span>}
    </div>
  );
};

export default PerformanceBadge;
