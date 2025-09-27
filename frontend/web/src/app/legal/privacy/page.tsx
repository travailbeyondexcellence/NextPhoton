/**
 * Privacy Policy page for NextPhoton
 * Comprehensive privacy policy covering data collection, usage, and user rights
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck, 
  Database, 
  Globe, 
  Mail, 
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Settings,
  Download,
  Trash2,
  RefreshCw,
  ExternalLink
} from "lucide-react";

// Privacy sections data
const privacySections = [
  {
    title: "Information We Collect",
    icon: Database,
    content: [
      {
        subtitle: "Personal Information",
        items: [
          "Name and contact details (email, phone number)",
          "Account credentials and authentication data",
          "Role-specific information (student grade, educator qualifications)",
          "Profile information and preferences",
          "Guardian-learner relationships"
        ]
      },
      {
        subtitle: "Usage Information",
        items: [
          "Session logs and activity data",
          "Learning progress and performance metrics",
          "Device and browser information",
          "IP addresses and location data",
          "Communication records within the platform"
        ]
      },
      {
        subtitle: "Educational Data",
        items: [
          "Academic records and transcripts",
          "Assessment results and feedback",
          "Learning goals and progress tracking",
          "Session recordings (with consent)",
          "Assignment submissions and projects"
        ]
      }
    ]
  },
  {
    title: "How We Use Your Information",
    icon: Settings,
    content: [
      {
        subtitle: "Platform Operations",
        items: [
          "Providing personalized learning experiences",
          "Matching learners with appropriate educators",
          "Managing sessions and scheduling",
          "Processing payments and transactions",
          "Maintaining platform security and integrity"
        ]
      },
      {
        subtitle: "Communication",
        items: [
          "Sending important platform updates",
          "Notification of session changes",
          "Educational progress reports",
          "Customer support communications",
          "Marketing (with opt-in consent)"
        ]
      },
      {
        subtitle: "Analytics & Improvements",
        items: [
          "Analyzing learning patterns and outcomes",
          "Improving our matching algorithms",
          "Enhancing platform features",
          "Conducting educational research",
          "Preventing fraud and abuse"
        ]
      }
    ]
  },
  {
    title: "Data Sharing & Disclosure",
    icon: Users,
    content: [
      {
        subtitle: "Within the Platform",
        items: [
          "Educators can view learner profiles and progress",
          "Guardians have full access to their ward's data",
          "EduCare Managers can monitor assigned sessions",
          "Admins have oversight for quality assurance",
          "Anonymous data may be used for analytics"
        ]
      },
      {
        subtitle: "Third-Party Services",
        items: [
          "Payment processors for transactions",
          "Cloud storage providers (encrypted)",
          "Analytics services (anonymized data)",
          "Communication tools (video conferencing)",
          "Legal compliance when required by law"
        ]
      },
      {
        subtitle: "Never Sold",
        items: [
          "We never sell personal information",
          "No unauthorized marketing sharing",
          "Educational data remains confidential",
          "Strict vendor agreements in place",
          "Regular third-party audits conducted"
        ]
      }
    ]
  },
  {
    title: "Your Rights & Choices",
    icon: UserCheck,
    content: [
      {
        subtitle: "Access & Control",
        items: [
          "View all data we have about you",
          "Download your data in portable formats",
          "Update or correct your information",
          "Delete your account and data",
          "Manage communication preferences"
        ]
      },
      {
        subtitle: "Privacy Controls",
        items: [
          "Control profile visibility settings",
          "Manage session recording consent",
          "Choose data sharing preferences",
          "Opt-out of marketing communications",
          "Request data processing restrictions"
        ]
      },
      {
        subtitle: "Guardian Rights",
        items: [
          "Full access to minor's educational data",
          "Control minor's privacy settings",
          "Approve educator assignments",
          "Monitor all platform activities",
          "Request data deletion on behalf of minor"
        ]
      }
    ]
  }
];

// Data protection measures
const protectionMeasures = [
  {
    icon: Lock,
    title: "Encryption",
    description: "End-to-end encryption for all sensitive data"
  },
  {
    icon: Shield,
    title: "Security Audits",
    description: "Regular third-party security assessments"
  },
  {
    icon: RefreshCw,
    title: "Data Minimization",
    description: "We only collect what's necessary"
  },
  {
    icon: Clock,
    title: "Retention Policies",
    description: "Clear data retention and deletion schedules"
  }
];

// Contact information
const privacyContacts = [
  {
    title: "Data Protection Officer",
    email: "dpo@nextphoton.com",
    description: "For privacy-related inquiries and requests"
  },
  {
    title: "Legal Department",
    email: "legal@nextphoton.com",
    description: "For legal and compliance matters"
  }
];

export default function PrivacyPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container relative mx-auto px-4">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your privacy is fundamental to our mission. Learn how we protect and manage your data.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Last updated: January 27, 2025</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  At NextPhoton, we understand that you're entrusting us with sensitive educational 
                  data and personal information. This Privacy Policy explains how we collect, use, 
                  share, and protect your information across our platform. We're committed to 
                  transparency and giving you control over your data.
                </p>
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary mb-1">Special Protection for Minors</p>
                      <p className="text-sm text-muted-foreground">
                        We take extra precautions with data from users under 18. Guardian consent 
                        and oversight are required for all minor accounts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Main Privacy Sections */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {privacySections.map((section, index) => (
              <ScrollReveal key={section.title} delay={index * 0.1}>
                <div className="mb-16 last:mb-0">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">{section.title}</h2>
                  </div>
                  
                  <div className="grid gap-8 ml-16">
                    {section.content.map((subsection) => (
                      <div key={subsection.subtitle} className="space-y-4">
                        <h3 className="text-xl font-semibold text-primary">
                          {subsection.subtitle}
                        </h3>
                        <ul className="space-y-2">
                          {subsection.items.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection Measures */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How We Protect Your Data</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We implement industry-leading security measures to protect your information
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {protectionMeasures.map((measure, index) => (
              <ScrollReveal key={measure.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <measure.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{measure.title}</h3>
                  <p className="text-sm text-muted-foreground">{measure.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cookie Policy */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Cookie Policy</h2>
              </div>
              
              <div className="ml-16 space-y-6">
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to enhance your experience on our platform.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Essential Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Required for platform functionality, authentication, and security. Cannot be disabled.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Help us understand usage patterns and improve the platform. Can be disabled in settings.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Preference Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Remember your settings and preferences for a personalized experience.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
              <p className="text-lg text-muted-foreground">
                Our team is here to help with any privacy concerns
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {privacyContacts.map((contact, index) => (
              <ScrollReveal key={contact.title} delay={index * 0.1}>
                <div className="bg-card p-6 rounded-lg border">
                  <Mail className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{contact.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{contact.description}</p>
                  <a 
                    href={`mailto:${contact.email}`}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    {contact.email}
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-12 p-6 bg-muted/50 rounded-lg max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">Download Your Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You can request a complete copy of your personal data at any time through your 
                    account settings or by contacting our Data Protection Officer.
                  </p>
                  <button className="text-sm text-primary hover:underline font-medium">
                    Learn more about data portability →
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}