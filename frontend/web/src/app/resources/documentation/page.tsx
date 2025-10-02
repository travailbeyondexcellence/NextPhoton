/**
 * Documentation page for NextPhoton
 * Comprehensive guides, API docs, and tutorials
 */

"use client";

import { useState } from "react";
import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  BookOpen,
  Code,
  Zap,
  Users,
  Settings,
  Shield,
  Search,
  ChevronRight,
  FileText,
  Video,
  Download,
  ExternalLink,
  Terminal,
  Layers,
  Database,
  Cloud,
  Lock,
  Smartphone
} from "lucide-react";

// Documentation categories
const docCategories = [
  {
    title: "Getting Started",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    articles: [
      { title: "Quick Start Guide", readTime: "5 min", type: "guide" },
      { title: "Platform Overview", readTime: "10 min", type: "guide" },
      { title: "First Steps for Educators", readTime: "8 min", type: "guide" },
      { title: "Setting Up Your Institution", readTime: "15 min", type: "guide" },
    ],
  },
  {
    title: "User Guides",
    icon: Users,
    color: "from-blue-500 to-indigo-500",
    articles: [
      { title: "Educator Dashboard Guide", readTime: "20 min", type: "guide" },
      { title: "Learner Portal Tutorial", readTime: "15 min", type: "guide" },
      { title: "Guardian Access Management", readTime: "12 min", type: "guide" },
      { title: "Admin Control Panel", readTime: "25 min", type: "guide" },
    ],
  },
  {
    title: "Features & Tools",
    icon: Settings,
    color: "from-purple-500 to-pink-500",
    articles: [
      { title: "Analytics Dashboard", readTime: "18 min", type: "feature" },
      { title: "Communication Tools", readTime: "10 min", type: "feature" },
      { title: "Scheduling System", readTime: "15 min", type: "feature" },
      { title: "Assessment Management", readTime: "20 min", type: "feature" },
    ],
  },
  {
    title: "API Documentation",
    icon: Code,
    color: "from-orange-500 to-red-500",
    articles: [
      { title: "API Overview", readTime: "8 min", type: "api" },
      { title: "Authentication", readTime: "10 min", type: "api" },
      { title: "REST API Reference", readTime: "30 min", type: "api" },
      { title: "GraphQL Schema", readTime: "25 min", type: "api" },
    ],
  },
  {
    title: "Security & Compliance",
    icon: Shield,
    color: "from-teal-500 to-cyan-500",
    articles: [
      { title: "Security Best Practices", readTime: "15 min", type: "security" },
      { title: "GDPR Compliance", readTime: "20 min", type: "security" },
      { title: "Data Protection", readTime: "12 min", type: "security" },
      { title: "Access Control (ABAC)", readTime: "18 min", type: "security" },
    ],
  },
  {
    title: "Integrations",
    icon: Layers,
    color: "from-indigo-500 to-purple-500",
    articles: [
      { title: "Google Workspace Integration", readTime: "10 min", type: "integration" },
      { title: "Microsoft Teams Setup", readTime: "12 min", type: "integration" },
      { title: "Zoom Integration Guide", readTime: "8 min", type: "integration" },
      { title: "Payment Gateway Setup", readTime: "15 min", type: "integration" },
    ],
  },
];

// Popular articles
const popularArticles = [
  { title: "How to Set Up Your First Classroom", icon: BookOpen, category: "Getting Started" },
  { title: "Understanding Analytics Dashboard", icon: Database, category: "Features" },
  { title: "Mobile App Installation Guide", icon: Smartphone, category: "Mobile" },
  { title: "Troubleshooting Common Issues", icon: Settings, category: "Support" },
  { title: "API Authentication Guide", icon: Lock, category: "API" },
];

// Video tutorials
const videoTutorials = [
  { title: "Platform Overview", duration: "12:45", thumbnail: Video },
  { title: "Creating Your First Class", duration: "8:30", thumbnail: Video },
  { title: "Analytics Deep Dive", duration: "15:20", thumbnail: Video },
  { title: "Mobile App Tutorial", duration: "10:15", thumbnail: Video },
];

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <PageLayout
      title="Documentation"
      subtitle="Everything you need to know to get the most out of NextPhoton"
    >
      {/* Search Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                />
              </div>
            </ScrollReveal>

            {/* Quick Links */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                <button className="px-4 py-2 rounded-full bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 text-sm transition-colors">
                  Quick Start
                </button>
                <button className="px-4 py-2 rounded-full bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 text-sm transition-colors">
                  API Reference
                </button>
                <button className="px-4 py-2 rounded-full bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 text-sm transition-colors">
                  Video Tutorials
                </button>
                <button className="px-4 py-2 rounded-full bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 text-sm transition-colors">
                  FAQs
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {docCategories.map((category, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} bg-opacity-10`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {category.title}
                      </h3>
                      <p className="text-sm text-white/50">
                        {category.articles.length} articles
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {category.articles.slice(0, 3).map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <a
                          href="#"
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-white/70 group-hover:text-white text-sm">
                            {article.title}
                          </span>
                          <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
                        </a>
                      </li>
                    ))}
                  </ul>

                  <button className="mt-4 text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                    View all →
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Popular & Video Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Popular Articles */}
            <div>
              <ScrollReveal>
                <h2 className="text-2xl font-bold text-white mb-6">Popular Articles</h2>
              </ScrollReveal>
              
              <div className="space-y-3">
                {popularArticles.map((article, index) => (
                  <ScrollReveal key={index} delay={index * 0.05}>
                    <a
                      href="#"
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <article.icon className="w-8 h-8 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-medium text-white group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-sm text-white/50">{article.category}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors" />
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Video Tutorials */}
            <div>
              <ScrollReveal delay={0.1}>
                <h2 className="text-2xl font-bold text-white mb-6">Video Tutorials</h2>
              </ScrollReveal>
              
              <div className="grid grid-cols-2 gap-4">
                {videoTutorials.map((video, index) => (
                  <ScrollReveal key={index} delay={index * 0.05}>
                    <div className="cursor-pointer group">
                      <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[10px] border-y-transparent ml-1" />
                        </div>
                      </div>
                      <h4 className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-white/50">{video.duration}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={0.2}>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary/80 transition-colors"
                >
                  View All Videos
                  <ExternalLink className="w-4 h-4" />
                </a>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Resources */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Terminal className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Developer Resources</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Build with NextPhoton
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Integrate NextPhoton into your applications with our comprehensive APIs
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <ScrollReveal delay={0.1}>
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                <Code className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
                <p className="text-white/70 text-sm mb-4">
                  Complete REST and GraphQL API documentation
                </p>
                <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm">
                  Explore APIs →
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                <Download className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">SDKs & Libraries</h3>
                <p className="text-white/70 text-sm mb-4">
                  Official SDKs for popular programming languages
                </p>
                <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm">
                  Download SDKs →
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                <Cloud className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Webhooks</h3>
                <p className="text-white/70 text-sm mb-4">
                  Real-time event notifications for your applications
                </p>
                <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm">
                  Setup Webhooks →
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Offline Documentation
              </h2>
              <p className="text-lg text-white/70 mb-8">
                Download the complete documentation for offline access
              </p>
              <div className="flex gap-4 justify-center">
                <button className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors">
                  Download PDF
                </button>
                <button className="px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20">
                  Download ePub
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}