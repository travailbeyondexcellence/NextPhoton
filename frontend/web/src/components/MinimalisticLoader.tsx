/**
 * Minimalistic Loader Component
 *
 * A fast, beautiful, and minimalistic loader that appears at the center of the viewport.
 * Designed to replace the default Next.js loader with better UX.
 *
 * Features:
 * - Multiple animation variants (spinner, dots, pulse, bars)
 * - Fast and smooth animations
 * - Theme-aware colors
 * - Minimal and elegant design
 * - Optimized for performance
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface MinimalisticLoaderProps {
  // Loader variant
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'orbit';

  // Size of the loader
  size?: 'sm' | 'md' | 'lg';

  // Custom color (optional)
  color?: string;

  // Show background overlay
  showOverlay?: boolean;

  // Custom message
  message?: string;

  // Animation speed
  speed?: 'slow' | 'normal' | 'fast';
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const speedMap = {
  slow: 2,
  normal: 1.5,
  fast: 1,
};

/**
 * MinimalisticLoader Component
 */
export const MinimalisticLoader: React.FC<MinimalisticLoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  color,
  showOverlay = true,
  message,
  speed = 'fast',
}) => {
  const duration = speedMap[speed];
  const sizeClass = sizeMap[size];

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            className={`${sizeClass} border-2 border-primary/20 border-t-primary rounded-full`}
            animate={{ rotate: 360 }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ borderTopColor: color }}
          />
        );

      case 'dots':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: duration * 0.8,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: 'easeInOut',
                }}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`${sizeClass} bg-primary rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ backgroundColor: color }}
          />
        );

      case 'bars':
        return (
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className="w-1 bg-primary rounded-full"
                animate={{
                  height: ['8px', '20px', '8px'],
                }}
                transition={{
                  duration: duration * 0.8,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: 'easeInOut',
                }}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        );

      case 'orbit':
        return (
          <div className={`relative ${sizeClass}`}>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="absolute w-2 h-2 bg-primary rounded-full"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: duration * (1 + index * 0.3),
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundColor: color,
                  left: '50%',
                  top: '50%',
                  transformOrigin: `${10 + index * 5}px 0`,
                  marginLeft: '-4px',
                  marginTop: '-4px',
                }}
              />
            ))}
            {/* Center dot */}
            <div
              className="absolute w-1 h-1 bg-primary/60 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: color ? `${color}60` : undefined,
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (showOverlay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        {/* Loader */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {renderLoader()}
        </motion.div>

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="mt-4 text-sm text-foreground/70 font-medium max-w-xs text-center"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    );
  }

  // Return just the loader without overlay
  return (
    <div className="flex flex-col items-center">
      {renderLoader()}
      {message && (
        <p className="mt-2 text-sm text-foreground/70 font-medium text-center">
          {message}
        </p>
      )}
    </div>
  );
};

/**
 * Centered Page Loader
 * Use this for full-page loading states
 */
export const CenteredPageLoader: React.FC<{
  variant?: MinimalisticLoaderProps['variant'];
  message?: string;
}> = ({ variant = 'spinner', message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {/* Theme-aware background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background/95 to-background" />

      {/* Loader */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <MinimalisticLoader
          variant={variant}
          size="lg"
          showOverlay={false}
        />

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-foreground/80 font-medium text-center"
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

/**
 * Inline Loader
 * Use this within components for section loading
 */
export const InlineLoader: React.FC<{
  variant?: MinimalisticLoaderProps['variant'];
  size?: MinimalisticLoaderProps['size'];
  message?: string;
}> = ({ variant = 'dots', size = 'sm', message }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <MinimalisticLoader
        variant={variant}
        size={size}
        showOverlay={false}
        message={message}
      />
    </div>
  );
};

/**
 * Button Loader
 * Use this inside buttons during loading states
 */
export const ButtonLoader: React.FC<{
  size?: 'sm' | 'md';
}> = ({ size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <motion.div
      className={`${sizeClass} border border-current border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};