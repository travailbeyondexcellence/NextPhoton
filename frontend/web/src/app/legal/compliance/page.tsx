/**
 * Compliance page for NextPhoton
 * Regulatory compliance information and certifications
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Shield,
  FileText,
  Globe,
  Users,
  Building2,
  Award,
  CheckCircle,
  Lock,
  Database,
  Scale,
  AlertCircle,
  Download,
  ExternalLink,
  Fingerprint,
  Heart
} from "lucide-react";

// Compliance frameworks
const complianceFrameworks = [
  {
    name: "GDPR",
    fullName: "General Data Protection Regulation",
    region: "European Union",
    icon: Globe,
    status: "Fully Compliant",
    description: "Comprehensive data protection and privacy for EU citizens",
    keyPoints: [
      "Right to access and portability",
      "Right to erasure (right to be forgotten)",
      "Data protection by design and default",
      "Explicit consent mechanisms",
      "Data breach notifications within 72 hours",
    ],
  },
  {
    name: "FERPA",
    fullName: "Family Educational Rights and Privacy Act",
    region: "United States",
    icon: FileText,
    status: "Fully Compliant",
    description: "Protection of student education records and privacy rights",
    keyPoints: [
      "Parental access rights to educational records",
      "Strict consent requirements for data disclosure",
      "Directory information opt-out options",
      "Audit trail for all record access",
      "Annual notification requirements",
    ],
  },
  {
    name: "COPPA",
    fullName: "Children's Online Privacy Protection Act",
    region: "United States",
    icon: Users,
    status: "Fully Compliant",
    description: "Protection for children under 13 years of age online",
    keyPoints: [
      "Verifiable parental consent",
      "Limited data collection from minors",
      "Parental review and deletion rights",
      "No behavioral advertising to children",
      "Special safeguards for young users",
    ],
  },
  {
    name: "CCPA/CPRA",
    fullName: "California Consumer Privacy Act / Privacy Rights Act",
    region: "California, USA",
    icon: Shield,
    status: "Fully Compliant",
    description: "Consumer privacy rights for California residents",
    keyPoints: [
      "Right to know what data is collected",
      "Right to delete personal information",
      "Right to opt-out of data sales",
      "Non-discrimination for privacy rights exercise",
      "Annual privacy policy updates",
    ],
  },
  {
    name: "SOC 2 Type II",
    fullName: "Service Organization Control 2",
    region: "International",
    icon: Award,
    status: "Certified",
    description: "Security, availability, and confidentiality controls",
    keyPoints: [
      "Annual independent audits",
      "Security control validation",
      "Availability guarantees",
      "Processing integrity verification",
      "Confidentiality assurance",
    ],
  },
  {
    name: "PIPEDA",
    fullName: "Personal Information Protection and Electronic Documents Act",
    region: "Canada",
    icon: Building2,
    status: "Fully Compliant",
    description: "Privacy protection for Canadian personal information",
    keyPoints: [
      "Consent for collection and use",
      "Limited collection principle",
      "Accuracy requirements",
      "Safeguards for personal data",
      "Individual access rights",
    ],
  },
];

// Industry standards
const industryStandards = [
  {
    name: "ISO 27001",
    description: "Information security management systems",
    status: "In Progress",
    target: "Q2 2025",
  },
  {
    name: "ISO 27018",
    description: "Protection of personally identifiable information in the cloud",
    status: "Planned",
    target: "Q3 2025",
  },
  {
    name: "NIST Cybersecurity Framework",
    description: "Improving critical infrastructure cybersecurity",
    status: "Implemented",
    target: "Completed",
  },
  {
    name: "OWASP Top 10",
    description: "Web application security standards",
    status: "Implemented",
    target: "Ongoing",
  },
];

// Compliance features
const complianceFeatures = [
  {
    icon: Fingerprint,
    title: "Privacy by Design",
    description: "Privacy considerations built into every feature from the ground up",
  },
  {
    icon: Database,
    title: "Data Minimization",
    description: "We only collect data that's necessary for educational purposes",
  },
  {
    icon: Lock,
    title: "Consent Management",
    description: "Granular consent controls for all data processing activities",
  },
  {
    icon: Scale,
    title: "Legal Basis",
    description: "Clear legal basis for all data processing operations",
  },
];

// Compliance resources
const resources = [
  {
    title: "GDPR Data Processing Agreement",
    description: "Standard contractual clauses for data processing",
    icon: FileText,
    action: "Download PDF",
  },
  {
    title: "FERPA Compliance Guide",
    description: "Guidelines for educational institutions",
    icon: BookOpen,
    action: "View Guide",
  },
  {
    title: "Privacy Impact Assessment",
    description: "Template for conducting privacy assessments",
    icon: Shield,
    action: "Download Template",
  },
  {
    title: "Compliance Checklist",
    description: "Comprehensive compliance verification checklist",
    icon: CheckCircle,
    action: "Access Checklist",
  },
];

export default function CompliancePage() {
  return (
    <PageLayout
      title="Compliance & Regulations"
      subtitle="Meeting and exceeding global standards for data protection and privacy"
    >
      {/* Compliance Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  Commitment to Compliance
                </h2>
                <p className="text-lg text-white/80 leading-relaxed mb-4">
                  NextPhoton maintains the highest standards of regulatory compliance to protect 
                  the privacy and rights of learners, educators, and institutions worldwide. 
                  Our compliance program is continuously updated to meet evolving regulations.
                </p>
                <p className="text-white/70">
                  We work with leading legal experts and undergo regular third-party audits to 
                  ensure our platform meets or exceeds all applicable regulatory requirements.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Compliance Features */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {complianceFeatures.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                  <feature.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Frameworks */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Regulatory Compliance
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                We comply with major data protection regulations across all jurisdictions
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-8 max-w-5xl mx-auto">
            {complianceFrameworks.map((framework, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Header */}
                    <div className="md:w-1/3">
                      <div className="flex items-start gap-4 mb-4">
                        <framework.icon className="w-10 h-10 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-bold text-white">{framework.name}</h3>
                          <p className="text-sm text-white/50">{framework.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-white/50" />
                        <span className="text-sm text-white/70">{framework.region}</span>
                      </div>
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                        {framework.status}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="md:w-2/3">
                      <p className="text-white/80 mb-4">{framework.description}</p>
                      <h4 className="text-sm font-semibold text-white mb-2">Key Compliance Points:</h4>
                      <ul className="space-y-1">
                        {framework.keyPoints.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-white/70">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Standards */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Industry Standards
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Beyond regulatory compliance, we adhere to industry best practices
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {industryStandards.map((standard, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{standard.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      standard.status === 'Implemented' 
                        ? 'bg-green-500/20 text-green-500'
                        : standard.status === 'In Progress'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {standard.status}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-2">{standard.description}</p>
                  <p className="text-white/50 text-xs">
                    <span className="font-medium">Target:</span> {standard.target}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection Officer */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Data Protection Officer</h2>
                </div>
                
                <p className="text-white/80 mb-6">
                  Our dedicated Data Protection Officer (DPO) oversees all privacy and 
                  compliance matters, ensuring we maintain the highest standards of data protection.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Responsibilities</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-white/70 text-sm">Monitor compliance with regulations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-white/70 text-sm">Conduct privacy impact assessments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-white/70 text-sm">Handle data subject requests</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-white/70 text-sm">Provide compliance training</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Contact DPO</h3>
                    <p className="text-white/70 mb-4">
                      For privacy inquiries, data requests, or compliance questions:
                    </p>
                    <a
                      href="mailto:dpo@nextphoton.com"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                    >
                      dpo@nextphoton.com
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Compliance Resources */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Compliance Resources
              </h2>
              <p className="text-lg text-white/70">
                Download templates and guides for compliance implementation
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {resources.map((resource, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <resource.icon className="w-10 h-10 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-white/70 text-sm mb-3">{resource.description}</p>
                      <span className="inline-flex items-center gap-2 text-primary text-sm font-medium">
                        {resource.action}
                        <Download className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Audits */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Regular Third-Party Audits
              </h2>
              <p className="text-white/80 mb-6">
                We undergo regular independent audits to verify our compliance with all 
                applicable regulations and industry standards. Our commitment to transparency 
                means these audit results are available upon request.
              </p>
              <button className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors">
                Request Audit Report
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Compliance Commitment */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Continuous Improvement
                    </h3>
                    <p className="text-white/70">
                      Compliance is not a one-time achievement but an ongoing commitment. 
                      We continuously monitor regulatory changes, update our practices, and 
                      invest in new technologies to ensure we remain at the forefront of 
                      data protection and privacy compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}