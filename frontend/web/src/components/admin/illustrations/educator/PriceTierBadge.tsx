/**
 * Price tier badge illustration for educator cards
 * Visual representation of pricing levels (Beginner/Intermediate/Premium)
 */

import React from 'react';

interface PriceTierBadgeProps {
  tier: string;
  size?: number;
  className?: string;
}

export const PriceTierBadge: React.FC<PriceTierBadgeProps> = ({
  tier,
  size = 32,
  className = ''
}) => {
  const getTierLevel = () => {
    if (tier.toLowerCase().includes('beginner')) return 1;
    if (tier.toLowerCase().includes('intermediate')) return 2;
    if (tier.toLowerCase().includes('premium')) return 3;
    return 1;
  };

  const level = getTierLevel();
  const stars = Array.from({ length: level }, (_, i) => i);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-label={`Price tier: ${tier}`}
      role="img"
    >
      {/* Badge Circle Background */}
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="currentColor"
        opacity="0.1"
      />
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />

      {/* Stars based on tier level */}
      {stars.map((index) => {
        const baseX = 16 - (level - 1) * 4;
        const x = baseX + index * 8;
        return (
          <path
            key={index}
            d={`M${x},12 L${x + 1.5},16 L${x + 5},16 L${x + 2},18.5 L${x + 3},22 L${x},19.5 L${x - 3},22 L${x - 2},18.5 L${x - 5},16 L${x - 1.5},16 Z`}
            fill="currentColor"
            opacity="0.9"
          />
        );
      })}

      {/* Dollar sign indicator */}
      <text
        x="16"
        y="26"
        fontSize="8"
        fontWeight="bold"
        textAnchor="middle"
        fill="currentColor"
        opacity="0.7"
      >
        {Array(level).fill('$').join('')}
      </text>
    </svg>
  );
};
