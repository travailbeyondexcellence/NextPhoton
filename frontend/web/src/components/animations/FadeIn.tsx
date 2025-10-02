"use client";

import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps extends MotionProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

/**
 * FadeIn animation component
 * Animates children with a fade-in effect from a specified direction
 */
export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = "",
  direction = "up",
  ...motionProps
}: FadeInProps) {
  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        ...directionOffset[direction]
      }}
      animate={{ 
        opacity: 1,
        x: 0,
        y: 0
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}