'use client';

import React from 'react';
import { LSTChartData } from '../types/lst.types';

interface LSTMiniDonutChartProps {
  data: LSTChartData[];
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const LSTMiniDonutChart: React.FC<LSTMiniDonutChartProps> = ({
  data,
  size = 120,
  strokeWidth = 12,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate cumulative percentages for segments
  let cumulativePercentage = 0;
  const segments = data.map((item) => {
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + item.percentage) / 100) * 360;
    cumulativePercentage += item.percentage;
    
    return {
      ...item,
      startAngle,
      endAngle,
      strokeDasharray: `${(item.percentage / 100) * circumference} ${circumference}`
    };
  });

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          
          {/* Data segments */}
          {segments.map((segment, index) => (
            <circle
              key={`${segment.name}-${index}`}
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="transparent"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={
                -((segments.slice(0, index).reduce((sum, s) => sum + s.percentage, 0)) / 100) * circumference
              }
              strokeLinecap="round"
              className="transition-all duration-300"
              style={{
                filter: segment.isOther ? 'opacity(0.7)' : 'none'
              }}
            />
          ))}
        </svg>
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs font-medium text-gray-700">LST</div>
            <div className="text-xs text-gray-500">ETH</div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="ml-4 space-y-1">
        {data.slice(0, 4).map((item, index) => (
          <div key={`legend-${index}`} className="flex items-center text-xs">
            <div
              className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-700 truncate max-w-[80px]">
              {item.name}
            </span>
            <span className="text-gray-500 ml-1 flex-shrink-0">
              {item.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LSTMiniDonutChart;