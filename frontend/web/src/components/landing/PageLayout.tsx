"use client";

import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FadeIn } from "../animations/FadeIn";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showGradient?: boolean;
}

/**
 * Reusable layout component for landing pages
 * Includes navbar, footer, and glassmorphic styling
 */
export function PageLayout({ 
  children, 
  title, 
  subtitle,
  showGradient = true 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      {showGradient && (
        <motion.div 
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgb(var(--gradient-from) / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgb(var(--gradient-via) / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgb(var(--gradient-to) / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgb(var(--gradient-from) / 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="relative z-10 pt-20">
        {/* Page header */}
        {(title || subtitle) && (
          <FadeIn className="py-12 md:py-20">
            <div className="container mx-auto px-6 text-center">
              {title && (
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          </FadeIn>
        )}

        {/* Page content */}
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}