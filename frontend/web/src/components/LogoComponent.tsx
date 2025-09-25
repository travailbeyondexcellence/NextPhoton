"use client";

import { useState } from "react";

interface LogoComponentProps {
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Logo component with fallback support
 * Attempts to load the NextPhoton logo with proper error handling
 */
export function LogoComponent({ 
  width = 48, 
  height = 48, 
  className = "" 
}: LogoComponentProps) {
  const [useFallback, setUseFallback] = useState(false);

  // If image fails to load, show text fallback
  if (useFallback) {
    return <LogoFallback size={width} />;
  }

  // Use regular img tag for better reliability with local images
  // Next.js Image component sometimes has issues with static assets
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <img
        src="/PhotonLogo/PhotonEarth.png"
        alt="NextPhoton Logo"
        width={width}
        height={height}
        className="object-contain"
        onError={() => {
          console.warn("Logo image not found, using text fallback");
          setUseFallback(true);
        }}
      />
    </div>
  );
}

/**
 * Text-based logo fallback
 * Shows when image cannot be loaded
 */
export function LogoFallback({ 
  size = 48 
}: { 
  size?: number 
}) {
  return (
    <div 
      className="flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-600 text-white font-bold rounded-lg"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      NP
    </div>
  );
}