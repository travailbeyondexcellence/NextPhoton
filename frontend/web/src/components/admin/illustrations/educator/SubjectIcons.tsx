/**
 * Subject-specific SVG icons for educator cards
 * Used to visually represent different subjects taught
 */

import React from 'react';

interface SubjectIconProps {
  subject: string;
  size?: number;
  className?: string;
}

export const SubjectIcon: React.FC<SubjectIconProps> = ({
  subject,
  size = 24,
  className = ''
}) => {
  const normalizedSubject = subject.toLowerCase();

  // Math Icon
  if (normalizedSubject.includes('math') || normalizedSubject.includes('algebra') || normalizedSubject.includes('calculus')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label={`${subject} icon`}
        role="img"
      >
        <path
          d="M7 2L3 6L7 10M17 2L21 6L17 10M13 2L11 10M3 14L7 18M7 14L3 18M13 16H21M13 20H21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Science/Chemistry Icon
  if (normalizedSubject.includes('science') || normalizedSubject.includes('chemistry') || normalizedSubject.includes('physics')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label={`${subject} icon`}
        role="img"
      >
        <path
          d="M9 3V9M15 3V9M9 9L5 19C4.5 20 5 21 6 21H18C19 21 19.5 20 19 19L15 9M9 9H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="16" r="2" fill="currentColor" opacity="0.3" />
      </svg>
    );
  }

  // English/Literature Icon
  if (normalizedSubject.includes('english') || normalizedSubject.includes('literature')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label={`${subject} icon`}
        role="img"
      >
        <path
          d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5V19.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Default/Generic Icon
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label={`${subject} icon`}
      role="img"
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
