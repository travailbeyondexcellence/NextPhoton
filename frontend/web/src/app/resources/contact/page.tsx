"use client";

/**
 * Contact page for NextPhoton
 * Multiple ways to get in touch with support and teams
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Headphones, 
  Users, 
  HelpCircle,
  Send,
  Building,
  Globe,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

// Contact options
const contactOptions = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Get instant help from our support team",
    availability: "Available 24/7",
    action: "Start Chat",
    primary: true
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message",
    availability: "Response within 24 hours",
    action: "Send Email",
    email: "support@nextphoton.com"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Talk to our support team",
    availability: "Mon-Fri, 9AM-6PM EST",
    action: "Call Now",
    phone: "+1 (555) 123-4567"
  },
  {
    icon: Calendar,
    title: "Schedule a Demo",
    description: "See NextPhoton in action",
    availability: "Book a personalized demo",
    action: "Schedule Demo"
  }
];

// Department contacts
const departments = [
  {
    name: "General Support",
    email: "support@nextphoton.com",
    description: "For general inquiries and platform support"
  },
  {
    name: "Educator Support",
    email: "educators@nextphoton.com",
    description: "Support for educator onboarding and issues"
  },
  {
    name: "Parent Support",
    email: "parents@nextphoton.com",
    description: "Assistance for parents and guardians"
  },
  {
    name: "Technical Support",
    email: "tech@nextphoton.com",
    description: "Platform technical issues and bugs"
  },
  {
    name: "Billing Support",
    email: "billing@nextphoton.com",
    description: "Payment and subscription inquiries"
  },
  {
    name: "Partnership Inquiries",
    email: "partners@nextphoton.com",
    description: "Business partnerships and collaborations"
  }
];

// Office locations
const offices = [
  {
    city: "San Francisco",
    type: "Headquarters",
    address: "123 Education Boulevard, Suite 100",
    location: "San Francisco, CA 94105",
    country: "United States"
  },
  {
    city: "New York",
    type: "East Coast Office",
    address: "456 Learning Avenue, Floor 20",
    location: "New York, NY 10001",
    country: "United States"
  },
  {
    city: "London",
    type: "European Office",
    address: "789 Knowledge Street",
    location: "London, UK EC2A 4BX",
    country: "United Kingdom"
  }
];

// FAQ items
const faqs = [
  {
    question: "What are your support hours?",
    answer: "Our live chat is available 24/7. Phone support is available Monday-Friday, 9AM-6PM EST. Email support typically responds within 24 hours."
  },
  {
    question: "How quickly can I expect a response?",
    answer: "Live chat: Immediate. Email: Within 24 hours. Phone: During business hours with minimal wait times."
  },
  {
    question: "Do you offer support in multiple languages?",
    answer: "Yes, we currently offer support in English, Spanish, French, and Mandarin. More languages are being added."
  },
  {
    question: "Is there priority support available?",
    answer: "Yes, premium accounts receive priority support with faster response times and dedicated support representatives."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: 'General Support'
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        department: 'General Support'
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container relative mx-auto px-4">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                How Can We Help You?
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Our support team is here to ensure you have the best experience with NextPhoton
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactOptions.map((option, index) => (
              <ScrollReveal key={option.title} delay={index * 0.1}>
                <div className={`p-6 rounded-lg border ${option.primary ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:shadow-lg transition-shadow'}`}>
                  <option.icon className={`w-8 h-8 mb-4 ${option.primary ? 'text-primary-foreground' : 'text-primary'}`} />
                  <h3 className="font-semibold mb-2">{option.title}</h3>
                  <p className={`text-sm mb-3 ${option.primary ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                    {option.description}
                  </p>
                  <p className={`text-xs mb-4 ${option.primary ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {option.availability}
                  </p>
                  <button className={`text-sm font-medium flex items-center gap-1 ${
                    option.primary 
                      ? 'text-primary-foreground hover:underline' 
                      : 'text-primary hover:underline'
                  }`}>
                    {option.action}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
                <p className="text-lg text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg border">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium mb-2">
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {departments.map((dept) => (
                        <option key={dept.name} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    * Required fields
                  </p>
                  
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {formStatus === 'submitting' ? (
                      <>Sending...</>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {formStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-500">Message sent successfully!</p>
                      <p className="text-sm text-muted-foreground">
                        We'll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {formStatus === 'error' && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-500">Something went wrong</p>
                      <p className="text-sm text-muted-foreground">
                        Please try again or contact us directly at support@nextphoton.com
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Department Contacts</h2>
              <p className="text-lg text-muted-foreground">
                Reach out to specific teams for specialized support
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {departments.map((dept, index) => (
              <ScrollReveal key={dept.name} delay={index * 0.1}>
                <div className="p-6 bg-card rounded-lg border">
                  <Mail className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{dept.description}</p>
                  <a 
                    href={`mailto:${dept.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {dept.email}
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Offices</h2>
              <p className="text-lg text-muted-foreground">
                Visit us at any of our global locations
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {offices.map((office, index) => (
              <ScrollReveal key={office.city} delay={index * 0.1}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Building className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{office.city}</h3>
                  <p className="text-sm text-primary mb-3">{office.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {office.address}<br />
                    {office.location}<br />
                    {office.country}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <ScrollReveal key={faq.question} delay={index * 0.1}>
                <div className="mb-6 p-6 bg-card rounded-lg border">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for?
              </p>
              <button className="text-primary hover:underline font-medium">
                View all FAQs →
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}