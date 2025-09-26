/**
 * Features page for NextPhoton
 * Comprehensive showcase of all platform features organized by user roles
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Users, 
  GraduationCap, 
  Shield, 
  BarChart3, 
  Calendar,
  MessageSquare,
  BookOpen,
  Clock,
  Target,
  Zap,
  Globe,
  Award,
  Brain,
  Layers,
  Settings
} from "lucide-react";

// Feature categories organized by user roles
const featureCategories = [
  {
    title: "For Learners",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-500",
    features: [
      {
        title: "Personalized Learning Paths",
        description: "AI-powered curriculum tailored to individual learning styles and pace",
        icon: Brain,
      },
      {
        title: "Progress Tracking",
        description: "Real-time monitoring of academic performance and achievement milestones",
        icon: Target,
      },
      {
        title: "Interactive Study Plans",
        description: "Daily, weekly, and monthly study schedules with smart reminders",
        icon: Calendar,
      },
      {
        title: "Resource Library",
        description: "Access to curated educational materials, videos, and practice tests",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "For Educators",
    icon: Users,
    color: "from-teal-500 to-cyan-500",
    features: [
      {
        title: "Class Management",
        description: "Effortlessly organize sessions, assignments, and student groups",
        icon: Layers,
      },
      {
        title: "Performance Analytics",
        description: "Detailed insights into student progress and engagement metrics",
        icon: BarChart3,
      },
      {
        title: "Automated Scheduling",
        description: "Smart calendar system for booking sessions and managing availability",
        icon: Clock,
      },
      {
        title: "Content Creation Tools",
        description: "Built-in tools for creating lessons, assessments, and study materials",
        icon: Settings,
      },
    ],
  },
  {
    title: "For Guardians",
    icon: Shield,
    color: "from-purple-500 to-pink-500",
    features: [
      {
        title: "Real-time Monitoring",
        description: "Track your child's attendance, performance, and engagement",
        icon: BarChart3,
      },
      {
        title: "Direct Communication",
        description: "Seamless messaging with educators and educational care managers",
        icon: MessageSquare,
      },
      {
        title: "Fee Management",
        description: "Transparent billing, payment tracking, and financial reports",
        icon: Award,
      },
      {
        title: "Progress Reports",
        description: "Regular updates on academic achievements and areas for improvement",
        icon: Target,
      },
    ],
  },
];

// Additional platform-wide features
const platformFeatures = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and ABAC security model to protect sensitive data",
  },
  {
    icon: Globe,
    title: "Cloud-Based Platform",
    description: "Access from anywhere, anytime with automatic backups and updates",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with Next.js 15 and modern infrastructure",
  },
  {
    icon: Users,
    title: "Multi-Tenant Support",
    description: "Scalable architecture supporting multiple institutions seamlessly",
  },
];

export default function FeaturesPage() {
  return (
    <PageLayout
      title="Powerful Features"
      subtitle="Discover how NextPhoton transforms education management with cutting-edge technology and user-centric design"
    >
      {/* Feature Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {featureCategories.map((category, categoryIndex) => (
            <ScrollReveal key={categoryIndex} delay={categoryIndex * 0.2}>
              <div className="mb-20">
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} bg-opacity-10`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">{category.title}</h2>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {category.features.map((feature, index) => (
                    <FadeIn key={index} delay={index * 0.1}>
                      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-white/10">
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-white/70">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Built for Scale & Security
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Enterprise-grade features that ensure your educational institution runs smoothly
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/70">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Experience These Features?
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Join thousands of educators and learners who are already transforming education with NextPhoton
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/sign-in"
                  className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  Get Started Free
                </a>
                <a
                  href="/product/demo"
                  className="px-8 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
                >
                  Request Demo
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}