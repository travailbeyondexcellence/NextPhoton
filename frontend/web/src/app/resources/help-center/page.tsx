/**
 * Help Center page for NextPhoton
 * Support articles, FAQs, and troubleshooting guides
 */

"use client";

import { useState } from "react";
import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  HelpCircle,
  Search,
  MessageSquare,
  FileText,
  Settings,
  Shield,
  Users,
  CreditCard,
  Smartphone,
  Globe,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  Zap
} from "lucide-react";

// Help categories
const helpCategories = [
  {
    title: "Account & Billing",
    icon: CreditCard,
    color: "from-green-500 to-emerald-500",
    articles: 12,
    topics: [
      "How to update payment information",
      "Understanding your invoice",
      "Changing subscription plans",
      "Cancellation and refund policy",
    ],
  },
  {
    title: "Getting Started",
    icon: Zap,
    color: "from-blue-500 to-indigo-500",
    articles: 15,
    topics: [
      "Creating your first classroom",
      "Inviting students and educators",
      "Basic platform navigation",
      "Initial setup checklist",
    ],
  },
  {
    title: "Technical Support",
    icon: Settings,
    color: "from-purple-500 to-pink-500",
    articles: 20,
    topics: [
      "System requirements",
      "Troubleshooting login issues",
      "Browser compatibility",
      "Mobile app installation",
    ],
  },
  {
    title: "Features & Tools",
    icon: Globe,
    color: "from-orange-500 to-red-500",
    articles: 25,
    topics: [
      "Using the analytics dashboard",
      "Scheduling and calendar management",
      "Communication tools guide",
      "Assessment creation",
    ],
  },
  {
    title: "Security & Privacy",
    icon: Shield,
    color: "from-teal-500 to-cyan-500",
    articles: 10,
    topics: [
      "Two-factor authentication setup",
      "Data privacy settings",
      "User permissions management",
      "Security best practices",
    ],
  },
  {
    title: "Mobile App",
    icon: Smartphone,
    color: "from-indigo-500 to-purple-500",
    articles: 8,
    topics: [
      "Downloading the mobile app",
      "Mobile app features",
      "Offline functionality",
      "Push notifications setup",
    ],
  },
];

// Common FAQs
const faqs = [
  {
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the login page. Enter your email address and follow the instructions sent to your inbox to create a new password.",
  },
  {
    question: "Can I use NextPhoton on multiple devices?",
    answer: "Yes! NextPhoton works seamlessly across all your devices. Simply log in with your credentials on any device to access your account.",
  },
  {
    question: "How do I add new students to my class?",
    answer: "Navigate to your class dashboard, click 'Add Students', and either enter their email addresses or share the class invite code for them to join.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit cards, debit cards, and bank transfers for institutional accounts. Payment methods vary by region.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level encryption and follow industry best practices to ensure your data is always protected. Learn more in our Security section.",
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team via email at support@nextphoton.com or through the in-app chat. Premium users have access to priority phone support.",
  },
];

// Troubleshooting guides
const troubleshootingGuides = [
  {
    title: "Connection Issues",
    icon: AlertCircle,
    steps: ["Check internet connection", "Clear browser cache", "Try incognito mode", "Contact support"],
  },
  {
    title: "Login Problems",
    icon: XCircle,
    steps: ["Verify email address", "Reset password", "Check account status", "Enable cookies"],
  },
  {
    title: "Performance Issues",
    icon: Clock,
    steps: ["Update browser", "Check system requirements", "Disable extensions", "Clear cache"],
  },
];

// Support channels
const supportChannels = [
  {
    title: "Email Support",
    icon: Mail,
    availability: "24/7 Response",
    description: "Get help via email with detailed responses",
    action: "support@nextphoton.com",
  },
  {
    title: "Live Chat",
    icon: MessageSquare,
    availability: "Business Hours",
    description: "Chat with our support team in real-time",
    action: "Start Chat",
  },
  {
    title: "Phone Support",
    icon: Phone,
    availability: "Premium Only",
    description: "Direct phone support for urgent issues",
    action: "+1 (800) 123-4567",
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <PageLayout
      title="Help Center"
      subtitle="Find answers, get support, and learn how to make the most of NextPhoton"
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
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                />
              </div>
            </ScrollReveal>

            {/* Popular searches */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <span className="text-sm text-white/50">Popular:</span>
                {["password reset", "add students", "billing", "mobile app"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 rounded-full bg-white/5 text-white/70 hover:bg-white/10 text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Help Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {helpCategories.map((category, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCategory(category.title)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} bg-opacity-10`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                      <p className="text-sm text-white/50">{category.articles} articles</p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {category.topics.slice(0, 3).map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-white/30" />
                        <span className="text-sm text-white/70 line-clamp-1">{topic}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="mt-4 text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                    View all articles →
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <HelpCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">FAQs</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-white/70">
                Quick answers to common questions
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <div className="mb-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white pr-4">{faq.question}</h3>
                      <ChevronDown
                        className={`w-5 h-5 text-white/50 transition-transform ${
                          expandedFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="mt-2 p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-white/70">{faq.answer}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Quick Troubleshooting
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {troubleshootingGuides.map((guide, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <guide.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-4">{guide.title}</h3>
                  
                  <ol className="space-y-2">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-2">
                        <span className="text-primary font-medium">{stepIndex + 1}.</span>
                        <span className="text-white/70 text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Still Need Help?
              </h2>
              <p className="text-lg text-white/70">
                Our support team is here to assist you
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {supportChannels.map((channel, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                  <channel.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-1">{channel.title}</h3>
                  <p className="text-sm text-primary mb-2">{channel.availability}</p>
                  <p className="text-white/70 text-sm mb-4">{channel.description}</p>
                  
                  {channel.title === "Live Chat" ? (
                    <button className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                      {channel.action}
                    </button>
                  ) : (
                    <a
                      href={channel.title === "Email Support" ? `mailto:${channel.action}` : `tel:${channel.action}`}
                      className="text-primary hover:text-primary/80 font-medium text-sm"
                    >
                      {channel.action}
                    </a>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Additional Resources */}
          <ScrollReveal>
            <div className="max-w-3xl mx-auto mt-12 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
              <BookOpen className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Looking for more detailed guides?
              </h3>
              <p className="text-white/70 mb-4">
                Check out our comprehensive documentation for in-depth tutorials and API references
              </p>
              <a
                href="/resources/documentation"
                className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                View Documentation
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* System Status */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white/70">All Systems Operational</span>
              </div>
              <span className="text-white/30">•</span>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                View Status Page →
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}