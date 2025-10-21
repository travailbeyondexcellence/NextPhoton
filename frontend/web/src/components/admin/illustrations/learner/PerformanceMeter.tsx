/**
 * Performance meter SVG for learner cards
 * Visual gauge showing performance percentage with trend indicators
 */

import React from 'react';

interface PerformanceMeterProps {
  score: number; // 0-100
  trend?: 'improving' | 'declining' | 'stable';
  size?: number;
  className?: string;
}

export const PerformanceMeter: React.FC<PerformanceMeterProps> = ({
  score,
  trend = 'stable',
  size = 80,
  className = ''
}) => {
  // Calculate arc parameters
  const radius = 30;
  const strokeWidth = 6;
  const circumference = Math.PI * radius;
  const scorePercentage = Math.max(0, Math.min(100, score));
  const offset = circumference - (scorePercentage / 100) * circumference;

  // Color based on score
  const getColor = () => {
    if (scorePercentage >= 80) return '#10b981'; // green
    if (scorePercentage >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const color = getColor();

  // Trend arrow path
  const getTrendArrow = () => {
    if (trend === 'improving') {
      return 'M40 65 L43 62 L46 65 M43 62 L43 70';
    }
    if (trend === 'declining') {
      return 'M40 70 L43 73 L46 70 M43 73 L43 65';
    }
    return 'M38 67.5 L48 67.5';
  };

  const getTrendColor = () => {
    if (trend === 'improving') return '#10b981';
    if (trend === 'declining') return '#ef4444';
    return '#6b7280';
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      aria-label={`Performance: ${score}% (${trend})`}
      role="img"
    >
      {/* Background arc */}
      <path
        d="M 10 40 A 30 30 0 0 1 70 40"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />

      {/* Progress arc */}
      <path
        d="M 10 40 A 30 30 0 0 1 70 40"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: 'stroke-dashoffset 0.5s ease',
          transform: 'rotate(180deg)',
          transformOrigin: '40px 40px'
        }}
      />

      {/* Score text */}
      <text
        x="40"
        y="42"
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        fill={color}
      >
        {Math.round(scorePercentage)}%
      </text>

      {/* Trend indicator */}
      <path
        d={getTrendArrow()}
        stroke={getTrendColor()}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
