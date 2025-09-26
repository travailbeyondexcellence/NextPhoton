/**
 * Terms of Service page for NextPhoton
 * Legal terms and conditions for platform usage
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  FileText,
  Scale,
  Users,
  Shield,
  AlertCircle,
  CheckCircle,
  Ban,
  CreditCard,
  Globe,
  Calendar,
  Mail,
  Gavel
} from "lucide-react";

// Terms sections
const termsSections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: FileText,
    content: [
      "By accessing or using NextPhoton, you agree to be bound by these Terms of Service.",
      "If you disagree with any part of these terms, you may not access our service.",
      "We may update these terms at any time, and continued use constitutes acceptance.",
      "You must be at least 13 years old to use our service, or have parental consent.",
    ],
  },
  {
    id: "account",
    title: "Account Terms",
    icon: Users,
    content: [
      "You are responsible for maintaining the security of your account and password.",
      "You must provide accurate, complete, and current information during registration.",
      "You are responsible for all activities that occur under your account.",
      "You must notify us immediately of any unauthorized use of your account.",
      "One person or legal entity may not maintain more than one free account.",
    ],
  },
  {
    id: "usage",
    title: "Acceptable Use",
    icon: CheckCircle,
    content: [
      "Use the service in compliance with all applicable laws and regulations.",
      "Respect the privacy and rights of other users.",
      "Use the platform solely for educational and learning purposes.",
      "Maintain appropriate conduct in all interactions with other users.",
      "Report any violations or inappropriate content to our support team.",
    ],
  },
  {
    id: "prohibited",
    title: "Prohibited Uses",
    icon: Ban,
    content: [
      "Violate any laws, regulations, or third-party rights.",
      "Share content that is harmful, offensive, or inappropriate for educational settings.",
      "Attempt to gain unauthorized access to any part of the service.",
      "Use automated systems or software to extract data from the service.",
      "Interfere with or disrupt the service or servers.",
      "Impersonate another person or misrepresent your affiliation.",
    ],
  },
  {
    id: "content",
    title: "User Content",
    icon: Globe,
    content: [
      "You retain ownership of content you create and upload to NextPhoton.",
      "You grant us a license to use, display, and distribute your content within the service.",
      "You are responsible for ensuring you have rights to share any content you upload.",
      "We may remove content that violates these terms or is reported as inappropriate.",
      "Educational content shared on the platform should be accurate and appropriate.",
    ],
  },
  {
    id: "payment",
    title: "Payment Terms",
    icon: CreditCard,
    content: [
      "Paid subscriptions are billed in advance on a monthly or annual basis.",
      "All fees are exclusive of taxes unless otherwise stated.",
      "Subscription fees are non-refundable except as required by law.",
      "We reserve the right to change pricing with 30 days notice.",
      "Failure to pay may result in termination of your access to paid features.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy and Data Protection",
    icon: Shield,
    content: [
      "Your use of NextPhoton is also governed by our Privacy Policy.",
      "We are committed to protecting the privacy of students and educators.",
      "We comply with applicable data protection laws including GDPR and COPPA.",
      "Educational records are handled in accordance with FERPA requirements.",
      "You consent to our data practices as outlined in our Privacy Policy.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    icon: AlertCircle,
    content: [
      "We may terminate or suspend your account for violations of these terms.",
      "You may cancel your account at any time through your account settings.",
      "Upon termination, your right to use the service will immediately cease.",
      "We may retain certain information as required by law or legitimate business purposes.",
      "Termination does not relieve you of payment obligations for services rendered.",
    ],
  },
];

// Key highlights
const keyHighlights = [
  {
    icon: Scale,
    title: "Fair & Transparent",
    description: "Clear terms designed to protect both users and the platform",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Strong commitment to protecting educational data and privacy",
  },
  {
    icon: Users,
    title: "Community Standards",
    description: "Guidelines to maintain a safe, respectful learning environment",
  },
  {
    icon: Gavel,
    title: "Legal Compliance",
    description: "Full compliance with educational and data protection laws",
  },
];

export default function TermsPage() {
  return (
    <PageLayout
      title="Terms of Service"
      subtitle="Please read these terms carefully before using NextPhoton"
    >
      {/* Last Updated Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Effective Date: January 1, 2025
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
                <p className="text-lg text-white/80 leading-relaxed mb-4">
                  Welcome to NextPhoton ("we," "our," or "us"). These Terms of Service ("Terms") 
                  govern your use of our education management platform and related services 
                  (collectively, the "Service"). By using NextPhoton, you agree to these Terms.
                </p>
                <p className="text-white/70">
                  These Terms apply to all users of the Service, including learners, educators, 
                  guardians, educational institutions, and administrators.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {keyHighlights.map((highlight, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
                  <highlight.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{highlight.title}</h3>
                  <p className="text-sm text-white/70">{highlight.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {termsSections.map((section, sectionIndex) => (
              <ScrollReveal key={section.id} delay={sectionIndex * 0.05}>
                <div className="mb-12">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>

                  {/* Section Content */}
                  <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <ul className="space-y-3">
                      {section.content.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-white/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Terms */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Intellectual Property</h2>
                <p className="text-white/80 mb-4">
                  The Service and its original content, features, and functionality are owned by 
                  NextPhoton and are protected by international copyright, trademark, patent, 
                  trade secret, and other intellectual property laws.
                </p>
                <p className="text-white/80">
                  Our trademarks and trade dress may not be used in connection with any product 
                  or service without our prior written consent.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Limitation of Liability</h2>
                <p className="text-white/80 mb-4">
                  To the maximum extent permitted by law, NextPhoton shall not be liable for any 
                  indirect, incidental, special, consequential, or punitive damages resulting from 
                  your use of or inability to use the Service.
                </p>
                <p className="text-white/80">
                  Our total liability shall not exceed the amount paid by you, if any, for accessing 
                  the Service during the six months prior to the claim.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Governing Law</h2>
                <p className="text-white/80">
                  These Terms shall be governed by and construed in accordance with the laws of 
                  the State of California, United States, without regard to its conflict of law 
                  provisions. You agree to submit to the personal jurisdiction of the courts 
                  located in San Francisco, California.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Educational Institution Terms */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold text-white">For Educational Institutions</h2>
                </div>
                
                <p className="text-white/80 mb-6">
                  If you are entering into these Terms on behalf of an educational institution:
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <span className="text-white/80">
                      You represent that you have the authority to bind the institution to these Terms
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <span className="text-white/80">
                      You are responsible for ensuring all users comply with these Terms
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <span className="text-white/80">
                      Enterprise agreements may modify these standard Terms
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <span className="text-white/80">
                      Special pricing and terms available for qualified institutions
                    </span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Questions About Our Terms?
              </h2>
              <p className="text-white/80 mb-6">
                If you have any questions about these Terms of Service, please contact our legal team.
              </p>
              <a
                href="mailto:legal@nextphoton.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                legal@nextphoton.com
              </a>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm text-white/60">
                  By using NextPhoton, you acknowledge that you have read, understood, and agree 
                  to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}