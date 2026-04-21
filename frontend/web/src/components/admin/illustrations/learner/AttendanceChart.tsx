/**
 * Attendance chart SVG for learner cards
 * Circular progress indicator showing attendance percentage
 */

import React from 'react';

interface AttendanceChartProps {
  percentage: number; // 0-100
  size?: number;
  className?: string;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({
  percentage,
  size = 64,
  className = ''
}) => {
  const radius = 28;
  const strokeWidth = 5;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (clampedPercentage / 100) * circumference;

  // Color based on attendance percentage
  const getColor = () => {
    if (clampedPercentage >= 90) return '#10b981'; // green - excellent
    if (clampedPercentage >= 75) return '#f59e0b'; // yellow - good
    return '#ef4444'; // red - needs improvement
  };

  const color = getColor();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-label={`Attendance: ${percentage}%`}
      role="img"
    >
      {/* Background circle */}
      <circle
        cx="32"
        cy="32"
        r={normalizedRadius}
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Progress circle */}
      <circle
        cx="32"
        cy="32"
        r={normalizedRadius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 0.5s ease',
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%'
        }}
      />

      {/* Percentage text */}
      <text
        x="32"
        y="32"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
      >
        {Math.round(clampedPercentage)}%
      </text>

      {/* Small checkmark or cross icon */}
      {clampedPercentage >= 75 ? (
        <path
          d="M 20 52 L 24 56 L 32 48"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ) : (
        <g>
          <path d="M 22 50 L 26 54" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M 26 50 L 22 54" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
