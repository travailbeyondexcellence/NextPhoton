/**
 * Press page for NextPhoton
 * Press releases, media kit, and news coverage
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Newspaper,
  Download,
  Mail,
  Calendar,
  Award,
  Mic,
  Camera,
  FileText,
  ExternalLink,
  Quote,
  Building2,
  Users,
  TrendingUp,
  Globe
} from "lucide-react";

// Press releases
const pressReleases = [
  {
    date: "December 20, 2024",
    title: "NextPhoton Raises $15M Series A to Transform Education Management",
    excerpt: "Leading EdTech startup secures funding from top investors to accelerate platform development and global expansion.",
    type: "Funding",
  },
  {
    date: "November 15, 2024",
    title: "NextPhoton Surpasses 50,000 Active Users Milestone",
    excerpt: "Platform sees exponential growth as educational institutions embrace comprehensive management solutions.",
    type: "Milestone",
  },
  {
    date: "October 10, 2024",
    title: "NextPhoton Launches AI-Powered Analytics Dashboard",
    excerpt: "Revolutionary feature provides educators with deep insights into student performance and engagement patterns.",
    type: "Product",
  },
  {
    date: "September 5, 2024",
    title: "Strategic Partnership with Global Education Alliance",
    excerpt: "NextPhoton partners with GEA to bring advanced education management to developing regions.",
    type: "Partnership",
  },
];

// Media coverage
const mediaCoverage = [
  {
    outlet: "TechCrunch",
    logo: "TC",
    date: "December 15, 2024",
    title: "How NextPhoton is Building the 'Uber for Educators'",
    link: "#",
  },
  {
    outlet: "EdTech Magazine",
    logo: "ET",
    date: "November 20, 2024",
    title: "The Future of Education Management: A Deep Dive into NextPhoton",
    link: "#",
  },
  {
    outlet: "Forbes",
    logo: "F",
    date: "October 25, 2024",
    title: "10 EdTech Startups Revolutionizing Learning in 2024",
    link: "#",
  },
  {
    outlet: "Education Week",
    logo: "EW",
    date: "September 30, 2024",
    title: "NextPhoton's Approach to Student Monitoring and Guardian Engagement",
    link: "#",
  },
];

// Awards and recognition
const awards = [
  {
    year: "2024",
    title: "Best EdTech Platform",
    organization: "Global Education Awards",
    icon: Award,
  },
  {
    year: "2024",
    title: "Innovation in Education",
    organization: "Tech Excellence Awards",
    icon: TrendingUp,
  },
  {
    year: "2023",
    title: "Fastest Growing Startup",
    organization: "StartupWorld Magazine",
    icon: Globe,
  },
];

// Company facts for journalists
const companyFacts = [
  { label: "Founded", value: "2022" },
  { label: "Headquarters", value: "San Francisco, CA" },
  { label: "Active Users", value: "50,000+" },
  { label: "Institutions", value: "500+" },
  { label: "Countries", value: "15+" },
  { label: "Team Size", value: "50+" },
];

// Media kit items
const mediaKitItems = [
  {
    title: "Company Logos",
    description: "High-resolution logos in various formats",
    icon: Camera,
    size: "2.5 MB",
  },
  {
    title: "Product Screenshots",
    description: "Latest platform screenshots and UI mockups",
    icon: FileText,
    size: "8.3 MB",
  },
  {
    title: "Executive Bios & Photos",
    description: "Leadership team information and headshots",
    icon: Users,
    size: "4.1 MB",
  },
  {
    title: "Brand Guidelines",
    description: "Complete brand style guide and usage rules",
    icon: FileText,
    size: "1.8 MB",
  },
];

export default function PressPage() {
  return (
    <PageLayout
      title="Press & Media"
      subtitle="Latest news, press releases, and media resources for journalists"
    >
      {/* Latest Press Releases Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Latest Press Releases</h2>
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
              >
                View All
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 max-w-4xl">
            {pressReleases.map((release, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                        {release.type}
                      </span>
                      <span className="text-white/50 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {release.date}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                    {release.title}
                  </h3>
                  
                  <p className="text-white/70 mb-4">
                    {release.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-primary">
                    <span className="font-medium">Read Full Release</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              NextPhoton in the News
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {mediaCoverage.map((article, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <a
                  href={article.link}
                  className="block p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {article.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-white">{article.outlet}</span>
                        <span className="text-white/50 text-sm">{article.date}</span>
                      </div>
                      <h3 className="text-lg font-medium text-white/80 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                    </div>
                    <ExternalLink className="w-5 h-5 text-white/50 group-hover:text-primary transition-colors" />
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-8">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                View All Coverage
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Awards & Recognition
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {awards.map((award, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <award.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-2xl font-bold text-primary mb-2">{award.year}</div>
                  <h3 className="text-lg font-semibold text-white mb-1">{award.title}</h3>
                  <p className="text-white/70 text-sm">{award.organization}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Download className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Media Resources</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Download Media Kit
                </h2>
                <p className="text-lg text-white/70">
                  Access logos, screenshots, executive photos, and brand guidelines
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {mediaKitItems.map((item, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <item.icon className="w-10 h-10 text-primary" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-white/70 text-sm mb-2">{item.description}</p>
                        <p className="text-white/50 text-sm">Size: {item.size}</p>
                      </div>
                      <Download className="w-5 h-5 text-white/50 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="text-center">
                <button className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors">
                  Download Complete Media Kit
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Company Facts Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Quick Facts
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {companyFacts.map((fact, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold text-primary mb-1">{fact.value}</div>
                  <div className="text-sm text-white/70">{fact.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10 text-center">
              <Mic className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Press Inquiries
              </h2>
              <p className="text-lg text-white/70 mb-6">
                For media inquiries, interviews, or additional information, please contact our press team
              </p>
              
              <div className="space-y-4">
                <a
                  href="mailto:press@nextphoton.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  press@nextphoton.com
                </a>
                
                <p className="text-white/70">
                  Response time: Within 24 hours on business days
                </p>
              </div>

              {/* Executive Spokespeople */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Available for Interviews
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="font-medium text-white">Sarah Chen</p>
                    <p className="text-sm text-white/70">CEO & Co-founder</p>
                    <p className="text-xs text-white/50 mt-1">Topics: Vision, Strategy, EdTech Industry</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="font-medium text-white">Dr. Michael Rodriguez</p>
                    <p className="text-sm text-white/70">CTO & Co-founder</p>
                    <p className="text-xs text-white/50 mt-1">Topics: Technology, Innovation, AI in Education</p>
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