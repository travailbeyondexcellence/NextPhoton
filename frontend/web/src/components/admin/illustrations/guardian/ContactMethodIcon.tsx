/**
 * Contact method SVG icons for guardian cards
 * Visual indicators for preferred contact methods (Phone/Email/WhatsApp)
 */

import React from 'react';

interface ContactMethodIconProps {
  method: 'phone' | 'email' | 'whatsapp' | string;
  size?: number;
  className?: string;
}

export const ContactMethodIcon: React.FC<ContactMethodIconProps> = ({
  method,
  size = 24,
  className = ''
}) => {
  const normalizedMethod = method.toLowerCase();

  // Phone Icon
  if (normalizedMethod === 'phone') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="Phone contact"
        role="img"
      >
        <path
          d="M22 16.92V19.92C22 20.92 21.18 21.78 20.18 21.92C19.96 21.95 19.75 21.96 19.53 21.96C10.39 21.96 3 14.56 3 5.42C3 5.2 3.01 4.99 3.04 4.77C3.18 3.77 4.04 2.95 5.04 2.95H8.04C8.54 2.95 8.98 3.32 9.06 3.82C9.14 4.32 9.39 5.29 9.64 5.89C9.79 6.24 9.72 6.64 9.47 6.89L7.84 8.52C9.15 11.11 11.83 13.79 14.42 15.1L16.05 13.47C16.3 13.22 16.7 13.15 17.05 13.3C17.65 13.55 18.62 13.8 19.12 13.88C19.62 13.96 19.99 14.4 19.99 14.9V16.92H22Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Email Icon
  if (normalizedMethod === 'email') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="Email contact"
        role="img"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M3 7L12 13L21 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // WhatsApp Icon
  if (normalizedMethod === 'whatsapp') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="WhatsApp contact"
        role="img"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 13.82 2.49 15.52 3.35 17L2.1 21.9L7.2 20.67C8.63 21.44 10.26 21.91 12 21.91C17.52 21.91 22 17.43 22 11.91C22 6.39 17.52 2 12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 9.5C8.5 9.5 9 8 9.5 8C10 8 10.5 8.5 10.5 9C10.5 9.5 10 10.5 9.5 11C9 11.5 8 13 8 14C8 15 9 16 10 16C11 16 12 15.5 12.5 15C13 14.5 14 13.5 14.5 13.5C15 13.5 15.5 14 15.5 14.5C15.5 15 15 16 14 16.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Default - Message Square
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label={`${method} contact`}
      role="img"
    >
      <path
        d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
