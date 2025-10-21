/**
 * Global Loader Component
 *
 * Displays a modern, animated loading overlay when any async operation is in progress.
 * Features multiple loader styles and smooth transitions.
 *
 * Features:
 * - Full-screen overlay with backdrop blur
 * - Modern animated spinner
 * - Loading message display
 * - Smooth fade in/out transitions
 * - Progress bar for extended operations
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MinimalisticLoader } from '@/components/MinimalisticLoader';

interface GlobalLoaderProps {
  // Optional: Override default loader style
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'orbit' | 'shimmer';

  // Optional: Show progress bar for extended operations
  showProgress?: boolean;

  // Optional: Minimum display duration (prevents flashing for quick operations)
  minDisplayDuration?: number;
}

/**
 * GlobalLoader Component
 *
 * Automatically displays when any loading operation is active.
 * Uses framer-motion for smooth animations and transitions.
 */
export const GlobalLoader: React.FC<GlobalLoaderProps> = ({
  variant = 'shimmer',
  showProgress = false,
  minDisplayDuration = 150,
}) => {
  const { isLoading, loadingMessage } = useLoading();
  const [shouldShow, setShouldShow] = useState(false);
  const [progress, setProgress] = useState(0);

  // Debug logging
  console.log('[GlobalLoader] isLoading:', isLoading, 'shouldShow:', shouldShow, 'message:', loadingMessage);

  // Handle minimum display duration to prevent flashing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      setShouldShow(true);
    } else if (shouldShow) {
      // Keep showing for minimum duration
      timeoutId = setTimeout(() => {
        setShouldShow(false);
      }, minDisplayDuration);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, shouldShow, minDisplayDuration]);

  // Simulate progress for extended operations
  useEffect(() => {
    if (shouldShow && showProgress) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev; // Cap at 90% until complete
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [shouldShow, showProgress]);

  // Use our new minimalistic loader
  const renderLoader = () => {
    return (
      <MinimalisticLoader
        variant={variant}
        size="lg"
        showOverlay={false}
        speed="fast"
      />
    );
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          {/* Loader Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex flex-col items-center gap-4 p-8"
          >
            {/* Loader */}
            {renderLoader()}

            {/* Loading Message */}
            {loadingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-foreground/80 text-sm font-medium max-w-xs text-center"
              >
                {loadingMessage}
              </motion.div>
            )}

            {/* Progress Bar */}
            {showProgress && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '200px' }}
                transition={{ delay: 0.2 }}
                className="h-1 bg-muted rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Spinner Loader Component
 * Classic rotating spinner with modern styling
 */
const SpinnerLoader: React.FC = () => {
  return (
    <div className="relative w-12 h-12">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-muted" />

      {/* Spinning ring */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />

      {/* Inner glow effect */}
      <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse" />
    </div>
  );
};

/**
 * Dots Loader Component
 * Three animated dots with wave effect
 */
const DotsLoader: React.FC = () => {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-primary rounded-full"
          animate={{
            y: [0, -12, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Pulse Loader Component
 * Expanding rings with fade effect
 */
const PulseLoader: React.FC = () => {
  return (
    <div className="relative w-12 h-12">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0 rounded-full border-2 border-primary"
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.6, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.4,
            ease: 'easeOut',
          }}
        />
      ))}
      <div className="absolute inset-3 bg-primary rounded-full animate-pulse" />
    </div>
  );
};

/**
 * Bars Loader Component
 * Animated bars with staggered height animation
 */
const BarsLoader: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="w-1 bg-primary rounded-full"
          animate={{
            height: ['12px', '28px', '12px'],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Page transition loader for Next.js route changes
 * Shows a slim progress bar at the top of the page
 */
export const PageTransitionLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for route change events
    const handleStart = () => {
      setIsVisible(true);
      setProgress(30);
    };

    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 200);
    };

    // For Next.js 13+ with app router, we'll use a different approach
    // This is a placeholder that can be enhanced with actual route change detection
    return () => {
      // Cleanup
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[10000] h-0.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="h-full bg-primary"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

/**
 * Skeleton loader for content placeholders
 * Use this for loading states within components
 */
export const SkeletonLoader: React.FC<{
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = 20,
}) => {
  const baseClasses = 'animate-pulse bg-muted';

  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};