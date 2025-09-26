"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  offset?: [string, string];
}

/**
 * Parallax animation component
 * Creates parallax scrolling effect for children
 */
export function Parallax({ 
  children, 
  className = "",
  speed = 0.5,
  offset = ["start end", "end start"]
}: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-100 * speed}px`, `${100 * speed}px`]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * ParallaxText - Animated text that moves on scroll
 */
export function ParallaxText({ 
  text, 
  className = "",
  baseVelocity = 5
}: { 
  text: string; 
  className?: string;
  baseVelocity?: number;
}) {
  const { scrollY } = useScroll();
  const scrollVelocity = useTransform(scrollY, [0, 1000], [0, baseVelocity]);
  const x = useTransform(scrollVelocity, (v) => `${v}%`);

  return (
    <motion.div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        style={{ x }}
        className="inline-block"
      >
        <span className="mr-10">{text}</span>
        <span className="mr-10">{text}</span>
        <span className="mr-10">{text}</span>
        <span className="mr-10">{text}</span>
      </motion.div>
    </motion.div>
  );
}