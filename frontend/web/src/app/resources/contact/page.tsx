/**
 * Contact page for NextPhoton
 * Contact forms, office locations, and support options
 */

"use client";

import { useState } from "react";
import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  Building2,
  Globe,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
  FileText,
  ArrowRight
} from "lucide-react";

// Contact form types
const contactTypes = [
  { value: "sales", label: "Sales Inquiry", icon: Briefcase },
  { value: "support", label: "Technical Support", icon: Headphones },
  { value: "partnership", label: "Partnership", icon: Building2 },
  { value: "media", label: "Media Inquiry", icon: MessageSquare },
  { value: "other", label: "Other", icon: FileText },
];

// Office locations
const offices = [
  {
    city: "San Francisco",
    type: "Headquarters",
    address: "123 Innovation Drive, Suite 500",
    location: "San Francisco, CA 94107",
    phone: "+1 (415) 555-0123",
    email: "sf@nextphoton.com",
    timezone: "PST (UTC-8)",
  },
  {
    city: "New York",
    type: "East Coast Office",
    address: "456 Education Plaza, Floor 12",
    location: "New York, NY 10013",
    phone: "+1 (212) 555-0456",
    email: "ny@nextphoton.com",
    timezone: "EST (UTC-5)",
  },
  {
    city: "London",
    type: "European Office",
    address: "789 Tech Quarter, Level 8",
    location: "London, UK EC2A 4BX",
    phone: "+44 20 5555 0789",
    email: "london@nextphoton.com",
    timezone: "GMT (UTC+0)",
  },
  {
    city: "Singapore",
    type: "Asia Pacific Office",
    address: "321 Innovation Hub, Tower B",
    location: "Singapore 048623",
    phone: "+65 6555 0321",
    email: "singapore@nextphoton.com",
    timezone: "SGT (UTC+8)",
  },
];

// Support channels
const supportChannels = [
  {
    title: "Sales Team",
    description: "Get pricing and plan information",
    availability: "Mon-Fri, 9AM-6PM PST",
    contact: "sales@nextphoton.com",
    responseTime: "Within 24 hours",
    icon: Briefcase,
  },
  {
    title: "Technical Support",
    description: "Help with platform issues",
    availability: "24/7 for Premium users",
    contact: "support@nextphoton.com",
    responseTime: "Within 2 hours",
    icon: Headphones,
  },
  {
    title: "General Inquiries",
    description: "All other questions",
    availability: "Mon-Fri, 9AM-5PM PST",
    contact: "hello@nextphoton.com",
    responseTime: "Within 48 hours",
    icon: Mail,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    type: "sales",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => {
        setFormStatus("idle");
        setFormData({
          name: "",
          email: "",
          company: "",
          type: "sales",
          message: "",
        });
      }, 3000);
    }, 1500);
  };

  return (
    <PageLayout
      title="Get in Touch"
      subtitle="We're here to help. Contact us for sales, support, partnerships, or general inquiries"
    >
      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Company/Institution
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                      placeholder="ABC Academy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-primary focus:outline-none"
                    >
                      {contactTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === "sending"}
                    className="w-full py-3 px-6 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {formStatus === "idle" && (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                    {formStatus === "sending" && "Sending..."}
                    {formStatus === "success" && (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Message Sent!
                      </>
                    )}
                    {formStatus === "error" && (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        Error - Try Again
                      </>
                    )}
                  </button>
                </form>

                {formStatus === "success" && (
                  <p className="mt-4 text-green-500 text-sm text-center">
                    Thank you! We'll get back to you within 24 hours.
                  </p>
                )}
              </div>
            </ScrollReveal>

            {/* Contact Information */}
            <div className="space-y-8">
              <ScrollReveal delay={0.1}>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Get Quick Help</h3>
                  
                  {supportChannels.map((channel, index) => (
                    <div key={index} className="mb-6 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <channel.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-1">{channel.title}</h4>
                          <p className="text-white/70 text-sm mb-2">{channel.description}</p>
                          <div className="space-y-1 text-sm">
                            <p className="text-white/60">
                              <span className="text-white/40">Email:</span> {channel.contact}
                            </p>
                            <p className="text-white/60">
                              <span className="text-white/40">Hours:</span> {channel.availability}
                            </p>
                            <p className="text-white/60">
                              <span className="text-white/40">Response:</span> {channel.responseTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
                  <Phone className="w-10 h-10 text-primary mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Prefer to Talk?
                  </h4>
                  <p className="text-white/70 mb-4">
                    Our sales team is available for a quick call
                  </p>
                  <a
                    href="tel:+18001234567"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                  >
                    +1 (800) 123-4567
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Global Presence</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Our Offices Worldwide
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Visit us at any of our global locations
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {offices.map((office, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{office.city}</h3>
                      <p className="text-sm text-primary">{office.type}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-white/40 mb-1">Address</p>
                      <p className="text-white/70">{office.address}</p>
                      <p className="text-white/70">{office.location}</p>
                    </div>
                    
                    <div>
                      <p className="text-white/40 mb-1">Contact</p>
                      <p className="text-white/70">{office.phone}</p>
                      <p className="text-white/70">{office.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-white/40 mb-1">Timezone</p>
                      <p className="text-white/70">{office.timezone}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Other Ways to Reach Us
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Chat with our team during business hours
                  </p>
                  <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                    Start Chat →
                  </button>
                </div>

                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <User className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Schedule a Demo</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Book a personalized platform walkthrough
                  </p>
                  <a
                    href="/product/demo"
                    className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    Book Demo →
                  </a>
                </div>

                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Help Center</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Find answers in our comprehensive docs
                  </p>
                  <a
                    href="/resources/help-center"
                    className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    Browse Help →
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}