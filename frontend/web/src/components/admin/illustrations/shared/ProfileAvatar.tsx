/**
 * Generic profile avatar SVG placeholder
 * Used across all admin cards when no profile image is available
 */

import React from 'react';

interface ProfileAvatarProps {
  initials: string;
  variant?: 'educator' | 'guardian' | 'learner';
  size?: number;
  className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  initials,
  variant = 'educator',
  size = 80,
  className = ''
}) => {
  // Color schemes based on role
  const getColorScheme = () => {
    switch (variant) {
      case 'educator':
        return {
          bg: '#0477FA',
          border: '#024EA6',
          text: '#FFFFFF'
        };
      case 'guardian':
        return {
          bg: '#F9618C',
          border: '#BA0419',
          text: '#FFFFFF'
        };
      case 'learner':
        return {
          bg: '#51D9EB',
          border: '#0477FA',
          text: '#FFFFFF'
        };
      default:
        return {
          bg: '#6366f1',
          border: '#4f46e5',
          text: '#FFFFFF'
        };
    }
  };

  const colors = getColorScheme();
  const fontSize = size * 0.4;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      aria-label={`Avatar for ${initials}`}
      role="img"
    >
      {/* Background circle */}
      <circle
        cx="40"
        cy="40"
        r="38"
        fill={colors.bg}
        opacity="0.1"
      />

      {/* Border circle */}
      <circle
        cx="40"
        cy="40"
        r="38"
        stroke={colors.border}
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />

      {/* Inner circle */}
      <circle
        cx="40"
        cy="40"
        r="30"
        fill={colors.bg}
        opacity="0.2"
      />

      {/* Decorative pattern - optional dots */}
      <circle cx="20" cy="20" r="2" fill={colors.border} opacity="0.1" />
      <circle cx="60" cy="20" r="2" fill={colors.border} opacity="0.1" />
      <circle cx="20" cy="60" r="2" fill={colors.border} opacity="0.1" />
      <circle cx="60" cy="60" r="2" fill={colors.border} opacity="0.1" />

      {/* Initials text */}
      <text
        x="40"
        y="40"
        fontSize={fontSize}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
        fill={colors.bg}
      >
        {initials.toUpperCase().slice(0, 2)}
      </text>
    </svg>
  );
};
