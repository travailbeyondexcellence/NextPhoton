/**
 * Security page for NextPhoton
 * Security measures, certifications, and best practices
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Shield,
  Lock,
  Key,
  Server,
  Cloud,
  AlertTriangle,
  CheckCircle,
  Eye,
  Users,
  FileText,
  Award,
  Zap,
  Database,
  Globe,
  Fingerprint
} from "lucide-react";

// Security measures
const securityMeasures = [
  {
    category: "Data Encryption",
    icon: Lock,
    color: "from-green-500 to-emerald-500",
    measures: [
      {
        title: "In Transit",
        description: "256-bit SSL/TLS encryption for all data transmissions",
        details: ["HTTPS enforced", "Certificate pinning", "Perfect forward secrecy"],
      },
      {
        title: "At Rest",
        description: "AES-256 encryption for stored data",
        details: ["Encrypted databases", "Encrypted file storage", "Encrypted backups"],
      },
      {
        title: "End-to-End",
        description: "Additional encryption for sensitive communications",
        details: ["Private messages", "Assessment data", "Personal information"],
      },
    ],
  },
  {
    category: "Access Control",
    icon: Key,
    color: "from-blue-500 to-indigo-500",
    measures: [
      {
        title: "ABAC System",
        description: "Attribute-Based Access Control for fine-grained permissions",
        details: ["Role-based permissions", "Context-aware access", "Principle of least privilege"],
      },
      {
        title: "Authentication",
        description: "Multi-layered authentication systems",
        details: ["Two-factor authentication", "Biometric support", "Session management"],
      },
      {
        title: "Authorization",
        description: "Strict authorization protocols",
        details: ["API key management", "OAuth 2.0 implementation", "Token-based access"],
      },
    ],
  },
  {
    category: "Infrastructure Security",
    icon: Server,
    color: "from-purple-500 to-pink-500",
    measures: [
      {
        title: "Cloud Security",
        description: "Enterprise-grade cloud infrastructure",
        details: ["AWS/Azure compliance", "Regional data residency", "DDoS protection"],
      },
      {
        title: "Network Security",
        description: "Multiple layers of network protection",
        details: ["Firewalls", "Intrusion detection", "VPN access for admins"],
      },
      {
        title: "Application Security",
        description: "Secure development practices",
        details: ["Code reviews", "Dependency scanning", "Security testing"],
      },
    ],
  },
];

// Compliance certifications
const certifications = [
  {
    name: "SOC 2 Type II",
    description: "Annual audit of security controls",
    icon: Award,
    status: "Certified",
  },
  {
    name: "GDPR",
    description: "EU data protection compliance",
    icon: Globe,
    status: "Compliant",
  },
  {
    name: "FERPA",
    description: "Educational records privacy",
    icon: FileText,
    status: "Compliant",
  },
  {
    name: "COPPA",
    description: "Children's online privacy protection",
    icon: Users,
    status: "Compliant",
  },
  {
    name: "ISO 27001",
    description: "Information security management",
    icon: Shield,
    status: "In Progress",
  },
  {
    name: "HIPAA",
    description: "Health information privacy",
    icon: Lock,
    status: "Available",
  },
];

// Security features
const securityFeatures = [
  {
    icon: Fingerprint,
    title: "Biometric Login",
    description: "Support for fingerprint and face recognition on mobile devices",
  },
  {
    icon: AlertTriangle,
    title: "Threat Detection",
    description: "AI-powered anomaly detection and real-time threat monitoring",
  },
  {
    icon: Database,
    title: "Backup & Recovery",
    description: "Automated backups with point-in-time recovery capabilities",
  },
  {
    icon: Eye,
    title: "Audit Logging",
    description: "Comprehensive logs of all security-relevant activities",
  },
];

// Security best practices for users
const bestPractices = [
  {
    title: "Strong Passwords",
    tips: [
      "Use passwords with at least 12 characters",
      "Include uppercase, lowercase, numbers, and symbols",
      "Never reuse passwords across sites",
      "Consider using a password manager",
    ],
  },
  {
    title: "Account Security",
    tips: [
      "Enable two-factor authentication",
      "Regularly review account activity",
      "Keep your email address up to date",
      "Log out from shared devices",
    ],
  },
  {
    title: "Data Protection",
    tips: [
      "Be cautious about sharing personal information",
      "Verify recipient identity before sharing sensitive data",
      "Report suspicious activities immediately",
      "Keep your devices and browsers updated",
    ],
  },
];

export default function SecurityPage() {
  return (
    <PageLayout
      title="Security at NextPhoton"
      subtitle="Learn about our comprehensive security measures and commitment to protecting your data"
    >
      {/* Security Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  Security is Our Top Priority
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  At NextPhoton, we understand that educational institutions trust us with 
                  sensitive data. We employ industry-leading security measures and maintain 
                  strict compliance standards to ensure your information remains protected 
                  at all times.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {securityFeatures.map((feature, index) => (
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

      {/* Security Measures */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Multi-Layered Security Approach
            </h2>
          </ScrollReveal>

          <div className="space-y-12 max-w-6xl mx-auto">
            {securityMeasures.map((category, categoryIndex) => (
              <ScrollReveal key={categoryIndex} delay={categoryIndex * 0.1}>
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} bg-opacity-10`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{category.category}</h3>
                  </div>

                  {/* Measures Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {category.measures.map((measure, index) => (
                      <FadeIn key={index} delay={index * 0.05}>
                        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <h4 className="text-lg font-semibold text-white mb-2">{measure.title}</h4>
                          <p className="text-white/70 mb-4">{measure.description}</p>
                          <ul className="space-y-2">
                            {measure.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-white/60">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Certifications */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Compliance</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Certifications & Compliance
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                We maintain strict compliance with international standards and regulations
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {certifications.map((cert, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <cert.icon className="w-10 h-10 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{cert.name}</h3>
                      <p className="text-sm text-white/70 mb-2">{cert.description}</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        cert.status === 'Certified' || cert.status === 'Compliant' 
                          ? 'bg-green-500/20 text-green-500'
                          : cert.status === 'In Progress'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {cert.status}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Security Best Practices
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Help us keep your account secure by following these recommendations
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {bestPractices.map((practice, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">{practice.title}</h3>
                  <ul className="space-y-2">
                    {practice.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-white/70 text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Security Incident Response */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Incident Response</h2>
                </div>
                
                <p className="text-white/80 mb-6">
                  In the unlikely event of a security incident, we have a comprehensive 
                  response plan:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Immediate Actions</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-white/70 text-sm">Contain and assess the incident</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-white/70 text-sm">Notify affected users promptly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-white/70 text-sm">Implement emergency patches</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Follow-up Measures</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-white/70 text-sm">Conduct thorough investigation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-white/70 text-sm">Provide detailed incident report</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-white/70 text-sm">Implement preventive measures</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
              <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Report Security Concerns
              </h2>
              <p className="text-white/80 mb-6">
                Found a vulnerability or have security concerns? We appreciate responsible 
                disclosure and will respond promptly to all reports.
              </p>
              <a
                href="mailto:security@nextphoton.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                security@nextphoton.com
              </a>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm text-white/60">
                  For urgent security matters, please encrypt your message using our 
                  <a href="#" className="text-primary hover:text-primary/80 mx-1">PGP key</a>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}