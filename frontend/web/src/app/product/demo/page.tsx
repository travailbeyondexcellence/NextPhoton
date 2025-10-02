/**
 * Demo page for NextPhoton
 * Allows users to request a personalized demo of the platform
 */

"use client";

import { useState } from "react";
import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Calendar,
  Clock,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Monitor,
  MessageSquare,
  Shield,
  BarChart3,
  BookOpen,
  Award,
  Phone,
  Mail,
  Building2
} from "lucide-react";

// Demo features that will be covered
const demoFeatures = [
  {
    icon: Users,
    title: "Multi-Role Management",
    description: "See how different user roles interact within the platform",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Explore real-time insights and performance metrics",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Experience automated booking and calendar management",
  },
  {
    icon: Shield,
    title: "Security Features",
    description: "Learn about our ABAC security model and data protection",
  },
  {
    icon: BookOpen,
    title: "Content Management",
    description: "Discover our content creation and distribution tools",
  },
  {
    icon: MessageSquare,
    title: "Communication Tools",
    description: "See how stakeholders stay connected and informed",
  },
];

// Demo process steps
const demoProcess = [
  {
    step: "1",
    title: "Book Your Demo",
    description: "Fill out the form and choose a convenient time slot",
  },
  {
    step: "2",
    title: "Personalized Walkthrough",
    description: "Our expert will guide you through features relevant to your needs",
  },
  {
    step: "3",
    title: "Q&A Session",
    description: "Get all your questions answered by our product specialists",
  },
  {
    step: "4",
    title: "Custom Setup Plan",
    description: "Receive a tailored implementation roadmap for your institution",
  },
];

// Benefits of demo
const demoBenefits = [
  "See the platform in action with real use cases",
  "Get personalized recommendations for your institution",
  "Learn best practices from education technology experts",
  "Receive pricing tailored to your specific needs",
  "No commitment required - explore at your own pace",
];

export default function DemoPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institution: "",
    role: "",
    size: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Demo request submitted:", formData);
  };

  return (
    <PageLayout
      title="See NextPhoton in Action"
      subtitle="Book a personalized demo and discover how our platform can transform your educational institution"
    >
      {/* Demo Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Form */}
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Request Your Demo</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                      placeholder="john.doe@school.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Institution Name *
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                      placeholder="ABC Academy"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Your Role *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-primary focus:outline-none"
                      >
                        <option value="">Select Role</option>
                        <option value="educator">Educator</option>
                        <option value="admin">Administrator</option>
                        <option value="director">Director/Principal</option>
                        <option value="it">IT Manager</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Institution Size *
                      </label>
                      <select
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-primary focus:outline-none"
                      >
                        <option value="">Select Size</option>
                        <option value="small">1-50 learners</option>
                        <option value="medium">51-200 learners</option>
                        <option value="large">201-500 learners</option>
                        <option value="enterprise">500+ learners</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      What are you looking to solve? (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none resize-none"
                      placeholder="Tell us about your current challenges..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Schedule Demo
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </ScrollReveal>

            {/* Right side - Benefits */}
            <div className="space-y-8">
              <ScrollReveal delay={0.1}>
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-primary">30-Minute Demo</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    What You'll Experience
                  </h3>
                  
                  <ul className="space-y-3">
                    {demoBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
                  <Monitor className="w-10 h-10 text-primary mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Live Platform Walkthrough
                  </h4>
                  <p className="text-white/70">
                    Our product expert will guide you through a live demonstration tailored to your specific needs and use cases.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Join 500+ institutions</p>
                    <p className="text-sm font-medium text-white">who have transformed with NextPhoton</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Process Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How the Demo Works
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                A simple, personalized process designed to help you make an informed decision
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-6">
            {demoProcess.map((step, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="relative">
                  {/* Connection line */}
                  {index < demoProcess.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-6" />
                  )}
                  
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-white/70">{step.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What We'll Show You
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Get a comprehensive overview of NextPhoton's capabilities
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {demoFeatures.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
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

      {/* Contact Alternative Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Prefer to Talk Now?
              </h3>
              <p className="text-white/70 mb-6">
                Our sales team is available to answer your questions immediately
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+1234567890"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
                >
                  <Phone className="w-5 h-5" />
                  +1 (234) 567-890
                </a>
                <a
                  href="mailto:sales@nextphoton.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
                >
                  <Mail className="w-5 h-5" />
                  sales@nextphoton.com
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}