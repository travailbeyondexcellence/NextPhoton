"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "../animations/ScrollReveal";
import { 
  Users, 
  BarChart3, 
  Calendar, 
  Shield, 
  Zap, 
  Globe,
  BookCheck,
  MessageSquare,
  Award,
  Clock,
  Target,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Multi-Role Platform",
    description: "Seamlessly manage learners, educators, guardians, and administrators in one unified system.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track progress, performance, and engagement with powerful analytics and insights.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automated session booking and calendar management for educators and learners.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "ABAC Security",
    description: "Advanced attribute-based access control ensures data privacy and security.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: MessageSquare,
    title: "Instant Communication",
    description: "Built-in messaging and notification system for seamless collaboration.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Award,
    title: "Performance Tracking",
    description: "Comprehensive assessment tools and progress monitoring for continuous improvement.",
    color: "from-indigo-500 to-purple-500",
  },
];

/**
 * Features section showcasing platform capabilities
 */
export function FeaturesSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powerful Features</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent"> Transform Education</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools necessary for effective education management, 
              from classroom monitoring to performance analytics.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Icon with gradient background */}
                <div className="mb-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} bg-opacity-10`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>

                {/* Hover effect decoration */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity -z-10"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${feature.color})`,
                  }}
                />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Additional feature highlight */}
        <ScrollReveal delay={0.3}>
          <motion.div
            className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-white/10"
            whileHover={{ scale: 1.01 }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-4">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Advanced Technology</span>
                </div>
                
                <h3 className="text-3xl font-bold mb-4">
                  Powered by Modern Tech Stack
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  Built with Next.js 15, NestJS, and PostgreSQL for maximum performance and reliability. 
                  Our platform scales with your needs, from small tutoring centers to large educational institutions.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-500" />
                    <span className="text-sm">Real-time Updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">Goal Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <span className="text-sm">Cloud-Based</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookCheck className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Smart Curriculum</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <motion.div
                  className="relative z-10"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-600/20 backdrop-blur-sm border border-white/20 p-8">
                    <div className="h-full rounded-xl bg-white/5 flex items-center justify-center">
                      <div className="text-6xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                        NP
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}