/**
 * Page Template
 *
 * This template wraps all pages and provides consistent loading behavior
 * during page transitions. It replaces the default Next.js loader.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { MinimalisticLoader } from '@/components/MinimalisticLoader';

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle route transitions
  useEffect(() => {
    setIsTransitioning(true);

    // Show loader for a brief moment during route changes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Short duration for fast transitions

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Transition Loader */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MinimalisticLoader
                variant="orbit"
                size="md"
                showOverlay={false}
                speed="fast"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content with Animation */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    </>
  );
}