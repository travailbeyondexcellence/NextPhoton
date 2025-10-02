/**
 * Terms of Service page for NextPhoton
 * Legal terms and conditions for platform usage
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Scale, 
  FileText, 
  Shield, 
  UserCheck, 
  AlertCircle, 
  CheckCircle, 
  Ban, 
  Clock,
  DollarSign,
  Users,
  BookOpen,
  Gavel,
  Globe,
  Mail,
  XCircle,
  Info
} from "lucide-react";

// Terms sections
const termsSections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: FileText,
    content: `By accessing or using NextPhoton's educational platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services. These terms apply to all users: learners, guardians, educators, EduCare managers, employees, interns, and administrators.

For users under 18 years of age, a parent or legal guardian must accept these terms on their behalf and supervise their use of the platform.`
  },
  {
    id: "services",
    title: "2. Description of Services",
    icon: BookOpen,
    content: `NextPhoton provides an educational technology platform that connects learners with qualified educators for personalized learning experiences. Our services include:
    
• Matching learners with appropriate educators
• Facilitating online and in-person educational sessions
• Providing tools for scheduling, communication, and progress tracking
• Offering educational content and resources
• Managing payments and transactions
• Monitoring educational quality and outcomes

We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.`
  },
  {
    id: "accounts",
    title: "3. User Accounts & Registration",
    icon: UserCheck,
    content: `To use our platform, you must create an account and provide accurate, complete information. You are responsible for:

• Maintaining the confidentiality of your login credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized use
• Ensuring your account information remains current and accurate

We may suspend or terminate accounts that violate these terms or engage in fraudulent activity.`
  },
  {
    id: "conduct",
    title: "4. User Conduct & Prohibited Activities",
    icon: Ban,
    content: `Users must not:

• Violate any applicable laws or regulations
• Impersonate others or provide false information
• Harass, abuse, or harm other users
• Share inappropriate content or engage in inappropriate behavior
• Attempt to access unauthorized areas of the platform
• Use the platform for any commercial purposes not expressly permitted
• Interfere with or disrupt the platform's functionality
• Circumvent any security measures or access controls

Violations may result in immediate account termination and legal action.`
  },
  {
    id: "roles",
    title: "5. Role-Specific Responsibilities",
    icon: Users,
    content: `Each user type has specific responsibilities:

**Educators** must:
• Maintain valid qualifications and certifications
• Provide accurate availability and expertise information
• Deliver quality educational services as promised
• Report any safety concerns immediately

**Guardians** must:
• Supervise minors' use of the platform
• Ensure learners attend scheduled sessions
• Provide accurate learner information
• Communicate any special needs or requirements

**Learners** must:
• Engage respectfully in all educational activities
• Complete assignments and attend sessions as scheduled
• Report any concerns to guardians or platform administrators`
  },
  {
    id: "payments",
    title: "6. Payments & Refunds",
    icon: DollarSign,
    content: `Payment terms:

• All fees are clearly displayed before booking sessions
• Payment is required before session commencement
• We use secure third-party payment processors
• Refunds are available according to our cancellation policy
• Educators receive payment according to agreed schedules

Cancellation policy:
• 24+ hours notice: Full refund
• 12-24 hours notice: 50% refund
• Less than 12 hours: No refund (except emergencies)

Platform fees and educator rates may change with reasonable notice.`
  },
  {
    id: "content",
    title: "7. Content & Intellectual Property",
    icon: Shield,
    content: `Content ownership:

• Users retain rights to their original content
• By uploading content, you grant NextPhoton a license to use it for platform operations
• Educational materials provided by educators remain their intellectual property
• Platform features, design, and functionality are owned by NextPhoton

Users must not:
• Upload copyrighted material without permission
• Share proprietary platform information
• Record sessions without consent from all participants
• Redistribute educational materials without authorization`
  },
  {
    id: "privacy",
    title: "8. Privacy & Data Protection",
    icon: Shield,
    content: `Your privacy is important to us. By using our platform, you agree to our Privacy Policy, which describes:

• What information we collect
• How we use and protect your data
• Your rights regarding your personal information
• Special protections for minors' data

We implement industry-standard security measures but cannot guarantee absolute security. Users should take appropriate precautions with their data.`
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    icon: AlertCircle,
    content: `To the maximum extent permitted by law:

• NextPhoton is not liable for indirect, incidental, or consequential damages
• Our total liability is limited to the fees paid in the last 12 months
• We do not guarantee specific educational outcomes
• We are not responsible for user-generated content or third-party actions

The platform is provided "as is" without warranties of any kind, express or implied.`
  },
  {
    id: "disputes",
    title: "10. Dispute Resolution",
    icon: Gavel,
    content: `Dispute resolution process:

1. **Informal Resolution**: Contact us first to resolve issues informally
2. **Mediation**: If needed, both parties agree to attempt mediation
3. **Arbitration**: Unresolved disputes will be settled by binding arbitration
4. **Exceptions**: Small claims and injunctive relief may be sought in court

These terms are governed by the laws of [Your Jurisdiction]. Any legal action must be brought in the courts of [Your Location].`
  },
  {
    id: "changes",
    title: "11. Modifications to Terms",
    icon: Info,
    content: `We may update these terms from time to time. When we make changes:

• We will notify users via email or platform announcement
• The updated terms will be posted with a new effective date
• Continued use after changes constitutes acceptance
• Material changes will include a grace period when possible

Users who disagree with changes may close their accounts.`
  },
  {
    id: "termination",
    title: "12. Termination",
    icon: XCircle,
    content: `Either party may terminate this agreement:

**User termination**:
• Close your account at any time through account settings
• Complete any pending sessions or payments
• Download your data before closure

**Platform termination**:
• We may suspend or terminate accounts for violations
• Serious violations result in immediate termination
• We will attempt to notify users except in urgent cases

Upon termination, access to the platform ceases immediately.`
  }
];

// Quick links for navigation
const quickLinks = [
  { href: "#acceptance", label: "Acceptance" },
  { href: "#services", label: "Services" },
  { href: "#accounts", label: "Accounts" },
  { href: "#conduct", label: "Conduct" },
  { href: "#payments", label: "Payments" },
  { href: "#privacy", label: "Privacy" },
  { href: "#liability", label: "Liability" },
  { href: "#disputes", label: "Disputes" }
];

export default function TermsPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container relative mx-auto px-4">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Scale className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Terms of Service
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Please read these terms carefully before using NextPhoton
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Effective Date: January 27, 2025</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 border-t sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Jump to:
              </span>
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-primary hover:underline whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Welcome to NextPhoton. These Terms of Service ("Terms") constitute a legal agreement 
                  between you and NextPhoton regarding your use of our educational platform and services. 
                  By using our platform, you acknowledge that you have read, understood, and agree to 
                  be bound by these Terms.
                </p>
                <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-500 mb-1">Important for Minors</p>
                      <p className="text-sm text-muted-foreground">
                        If you are under 18 years old, your parent or guardian must read and accept 
                        these terms on your behalf. We require guardian consent and supervision for 
                        all minor users.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {termsSections.map((section, index) => (
              <ScrollReveal key={section.id} delay={index * 0.05}>
                <div id={section.id} className="mb-16 last:mb-0 scroll-mt-32">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  
                  <div className="ml-16">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div className="text-muted-foreground whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Questions About Our Terms?</h2>
              <p className="text-lg text-muted-foreground">
                We're here to help clarify any concerns
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-lg mx-auto">
            <ScrollReveal delay={0.1}>
              <div className="bg-card p-8 rounded-lg border text-center">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Legal Department</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For questions about these terms or legal matters
                </p>
                <a 
                  href="mailto:legal@nextphoton.com"
                  className="text-primary hover:underline font-medium"
                >
                  legal@nextphoton.com
                </a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2}>
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                These Terms of Service were last updated on January 27, 2025. We recommend 
                reviewing these terms periodically for any changes. Your continued use of 
                NextPhoton constitutes acceptance of any modifications.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}