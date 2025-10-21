/**
 * Payment status SVG icons for guardian cards
 * Visual indicators for payment state (Paid/Pending/Overdue)
 */

import React from 'react';

interface PaymentStatusIconProps {
  status: 'paid' | 'pending' | 'overdue' | string;
  size?: number;
  className?: string;
}

export const PaymentStatusIcon: React.FC<PaymentStatusIconProps> = ({
  status,
  size = 24,
  className = ''
}) => {
  const normalizedStatus = status.toLowerCase();

  // Paid Status - Checkmark in Circle
  if (normalizedStatus === 'paid') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="Payment paid"
        role="img"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="#10b981"
          opacity="0.2"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#10b981"
          strokeWidth="2"
        />
        <path
          d="M8 12L11 15L16 9"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Pending Status - Clock
  if (normalizedStatus === 'pending') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="Payment pending"
        role="img"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="#f59e0b"
          opacity="0.2"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        <path
          d="M12 6V12L16 14"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Overdue Status - Alert/Exclamation
  if (normalizedStatus === 'overdue') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="Payment overdue"
        role="img"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="#ef4444"
          opacity="0.2"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#ef4444"
          strokeWidth="2"
        />
        <path
          d="M12 8V12"
          stroke="#ef4444"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="12"
          cy="16"
          r="1"
          fill="#ef4444"
        />
      </svg>
    );
  }

  // Default - Question Mark
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label={`Payment status: ${status}`}
      role="img"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M12 16V16.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 12C12 10 14 10 14 8C14 7 13 6 12 6C11 6 10 7 10 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
