/**
 * Generic status badge SVG
 * Visual indicator for status states (active/inactive/on-break/etc.)
 */

import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'on-break' | 'pending' | string;
  size?: number;
  className?: string;
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 16,
  className = '',
  showPulse = false
}) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#10b981'; // green
      case 'inactive':
        return '#ef4444'; // red
      case 'on-break':
      case 'pending':
        return '#f59e0b'; // yellow
      default:
        return '#6b7280'; // gray
    }
  };

  const color = getStatusColor();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      aria-label={`Status: ${status}`}
      role="img"
    >
      {/* Pulse animation ring (only for active status) */}
      {showPulse && status.toLowerCase() === 'active' && (
        <circle
          cx="8"
          cy="8"
          r="6"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.4"
        >
          <animate
            attributeName="r"
            from="4"
            to="7"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.6"
            to="0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Outer circle */}
      <circle
        cx="8"
        cy="8"
        r="7"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />

      {/* Inner filled circle */}
      <circle
        cx="8"
        cy="8"
        r="4"
        fill={color}
      />

      {/* Status-specific icon overlay */}
      {status.toLowerCase() === 'on-break' && (
        <g>
          <rect x="6" y="4" width="1.5" height="8" fill="white" />
          <rect x="8.5" y="4" width="1.5" height="8" fill="white" />
        </g>
      )}

      {status.toLowerCase() === 'inactive' && (
        <g>
          <rect
            x="4"
            y="7.25"
            width="8"
            height="1.5"
            fill="white"
          />
        </g>
      )}

      {status.toLowerCase() === 'pending' && (
        <g>
          <circle cx="8" cy="8" r="1" fill="white" />
          <circle cx="8" cy="5" r="0.8" fill="white" opacity="0.6" />
          <circle cx="8" cy="11" r="0.8" fill="white" opacity="0.6" />
        </g>
      )}
    </svg>
  );
};
