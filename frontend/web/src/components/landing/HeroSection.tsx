"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FadeIn } from "../animations/FadeIn";
import { StaggerChildren, StaggerItem } from "../animations/StaggerChildren";
import { ArrowRight, Play, Star, Users, BookOpen, TrendingUp } from "lucide-react";
import { LogoComponent } from "../LogoComponent";

/**
 * Hero section for the landing page
 * Features animated content with glassmorphism design
 */
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 -z-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <StaggerChildren className="max-w-5xl mx-auto text-center">
          {/* Logo and badge */}
          <StaggerItem className="flex justify-center mb-6">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-white">Revolutionizing Education Management</span>
            </motion.div>
          </StaggerItem>

          {/* Main heading */}
          <StaggerItem>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              NextPhoton
            </h1>
          </StaggerItem>

          {/* Subheading */}
          <StaggerItem>
            <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-white/90">
              The Uber for Educators
            </h2>
          </StaggerItem>

          {/* Description */}
          <StaggerItem>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Transform education with our comprehensive management platform. 
              Focus on what matters - <span className="font-semibold text-white">micromanagement and outside-classroom monitoring</span> - 
              while we handle the rest.
            </p>
          </StaggerItem>

          {/* Stats */}
          <StaggerItem className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-10">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-teal-500">10K+</div>
              <div className="text-sm text-white/60">Active Learners</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-blue-500">500+</div>
              <div className="text-sm text-white/60">Expert Educators</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-purple-500">95%</div>
              <div className="text-sm text-white/60">Success Rate</div>
            </motion.div>
          </StaggerItem>

          {/* CTA Buttons */}
          <StaggerItem className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-shadow"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 font-semibold text-lg text-white hover:bg-white/20 transition-colors">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>
          </StaggerItem>

          {/* Trust badges */}
          <StaggerItem className="flex items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              <span className="text-sm">Trusted by Parents</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">Expert Curriculum</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Proven Results</span>
            </div>
          </StaggerItem>
        </StaggerChildren>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}