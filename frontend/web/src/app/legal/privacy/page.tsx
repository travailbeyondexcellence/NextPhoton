/**
 * Privacy Policy page for NextPhoton
 * Data protection and privacy information
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Mail,
  Calendar
} from "lucide-react";

// Privacy sections
const privacySections = [
  {
    id: "collection",
    title: "Information We Collect",
    icon: Database,
    content: [
      {
        subtitle: "Account Information",
        points: [
          "Name, email address, and contact details",
          "Institution name and role",
          "Account preferences and settings",
          "Payment and billing information (encrypted)",
        ],
      },
      {
        subtitle: "Usage Information",
        points: [
          "Platform usage patterns and interactions",
          "Session analytics and performance metrics",
          "Device and browser information",
          "IP address and location data (anonymized)",
        ],
      },
      {
        subtitle: "Educational Data",
        points: [
          "Class schedules and attendance records",
          "Assessment results and progress tracking",
          "Communication logs between users",
          "Content created within the platform",
        ],
      },
    ],
  },
  {
    id: "usage",
    title: "How We Use Your Information",
    icon: Users,
    content: [
      {
        subtitle: "Service Delivery",
        points: [
          "Provide and maintain our educational platform",
          "Process transactions and manage subscriptions",
          "Send service-related communications",
          "Provide customer support and assistance",
        ],
      },
      {
        subtitle: "Platform Improvement",
        points: [
          "Analyze usage patterns to improve features",
          "Develop new tools and functionalities",
          "Ensure platform security and prevent fraud",
          "Conduct research on educational effectiveness",
        ],
      },
    ],
  },
  {
    id: "sharing",
    title: "Information Sharing",
    icon: Globe,
    content: [
      {
        subtitle: "We Do Not Sell Your Data",
        points: [
          "We never sell personal information to third parties",
          "Data is only shared as outlined in this policy",
          "You maintain ownership of your educational content",
          "We respect the privacy of minors with special protections",
        ],
      },
      {
        subtitle: "Limited Sharing Scenarios",
        points: [
          "With your explicit consent",
          "To comply with legal obligations",
          "With service providers under strict agreements",
          "To protect rights, safety, and security",
        ],
      },
    ],
  },
  {
    id: "security",
    title: "Data Security",
    icon: Lock,
    content: [
      {
        subtitle: "Protection Measures",
        points: [
          "256-bit SSL encryption for data in transit",
          "AES-256 encryption for data at rest",
          "Regular security audits and penetration testing",
          "ABAC (Attribute-Based Access Control) system",
        ],
      },
      {
        subtitle: "Compliance Standards",
        points: [
          "GDPR compliant for European users",
          "COPPA compliant for children's privacy",
          "FERPA compliant for educational records",
          "SOC 2 Type II certified infrastructure",
        ],
      },
    ],
  },
  {
    id: "rights",
    title: "Your Rights",
    icon: Shield,
    content: [
      {
        subtitle: "Data Control Rights",
        points: [
          "Access your personal information anytime",
          "Correct inaccurate or incomplete data",
          "Request deletion of your account and data",
          "Export your data in standard formats",
        ],
      },
      {
        subtitle: "Privacy Choices",
        points: [
          "Opt-out of non-essential communications",
          "Control data sharing preferences",
          "Manage cookie and tracking settings",
          "Choose data retention periods",
        ],
      },
    ],
  },
];

// Key privacy features
const privacyFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All sensitive data is encrypted throughout its lifecycle",
  },
  {
    icon: Eye,
    title: "Transparent Practices",
    description: "Clear information about how we handle your data",
  },
  {
    icon: Users,
    title: "User Control",
    description: "You decide how your information is used and shared",
  },
  {
    icon: Shield,
    title: "Child Protection",
    description: "Special safeguards for users under 18 years old",
  },
];

export default function PrivacyPage() {
  return (
    <PageLayout
      title="Privacy Policy"
      subtitle="Your privacy is fundamental to our mission. Learn how we protect and respect your data."
    >
      {/* Last Updated Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Last Updated: January 1, 2025
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <p className="text-lg text-white/80 leading-relaxed">
                  At NextPhoton, we understand that you're entrusting us with sensitive educational 
                  data. This Privacy Policy explains how we collect, use, protect, and share 
                  information when you use our platform. We're committed to transparency and giving 
                  you control over your data.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Privacy Features */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {privacyFeatures.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
                  <feature.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {privacySections.map((section, sectionIndex) => (
              <ScrollReveal key={section.id} delay={sectionIndex * 0.1}>
                <div className="mb-12">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>

                  {/* Section Content */}
                  <div className="space-y-6">
                    {section.content.map((subsection, index) => (
                      <div key={index} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">{subsection.subtitle}</h3>
                        <ul className="space-y-2">
                          {subsection.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-white/80">{point}</span>
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

      {/* Data Retention Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Data Retention</h2>
                </div>
                
                <div className="space-y-4 text-white/80">
                  <p>
                    We retain your information only as long as necessary to provide our services 
                    and fulfill the purposes outlined in this policy.
                  </p>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <span>Active account data: Retained while your account is active</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <span>Deleted account data: Removed within 90 days of deletion request</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <span>Backup data: Purged from backups within 180 days</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <span>Legal obligations: Some data may be retained longer if required by law</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* International Data Transfers */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold text-white">International Data Transfers</h2>
                </div>
                
                <p className="text-white/80 mb-4">
                  As a global platform, we may transfer your information to servers located 
                  outside your country of residence. We ensure all transfers comply with 
                  applicable data protection laws through:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-white/80">Standard contractual clauses approved by regulatory authorities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-white/80">Data processing agreements with all service providers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-white/80">Appropriate technical and organizational measures</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Updates and Contact */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <ScrollReveal>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <AlertCircle className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Policy Updates</h3>
                  <p className="text-white/70 text-sm">
                    We may update this policy periodically. We'll notify you of significant 
                    changes via email or platform notifications.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <Mail className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Privacy Questions?</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Our Data Protection Officer is here to help with any privacy concerns.
                  </p>
                  <a
                    href="mailto:privacy@nextphoton.com"
                    className="text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    privacy@nextphoton.com
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Our Privacy Commitment
              </h2>
              <p className="text-white/80 mb-6">
                We're committed to protecting your privacy and giving you control over your data. 
                If you have any questions or concerns, please don't hesitate to contact us.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/resources/contact"
                  className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="/resources/documentation"
                  className="px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
                >
                  Security Docs
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}