/**
 * About page for NextPhoton
 * Company story, mission, vision, and values
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Target,
  Eye,
  Heart,
  Users,
  Globe,
  Award,
  Zap,
  TrendingUp,
  Sparkles,
  BookOpen,
  Lightbulb,
  Shield
} from "lucide-react";

// Company values
const values = [
  {
    icon: Heart,
    title: "Student-Centered",
    description: "Every decision we make prioritizes the success and wellbeing of learners.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously evolve our platform to meet the changing needs of education.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We believe in the power of bringing educators, learners, and guardians together.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "We maintain the highest standards of data protection and privacy.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Education should be accessible to everyone, everywhere, at any time.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every feature, interaction, and outcome.",
    color: "from-teal-500 to-cyan-500",
  },
];

// Timeline milestones
const milestones = [
  {
    year: "2022",
    title: "The Beginning",
    description: "NextPhoton was founded with a vision to revolutionize education management",
  },
  {
    year: "2023",
    title: "Platform Launch",
    description: "Released our MVP with core features for educators and learners",
  },
  {
    year: "2024",
    title: "Rapid Growth",
    description: "Reached 50,000+ users and 500+ institutions across multiple regions",
  },
  {
    year: "2025",
    title: "Global Expansion",
    description: "Expanding internationally with multi-language support and local partnerships",
  },
];

// Team stats
const teamStats = [
  { value: "50+", label: "Team Members" },
  { value: "15+", label: "Countries" },
  { value: "10+", label: "Languages" },
  { value: "24/7", label: "Support" },
];

export default function AboutPage() {
  return (
    <PageLayout
      title="About NextPhoton"
      subtitle="We're on a mission to transform education through technology and innovation"
    >
      {/* Mission & Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-white/80 leading-relaxed">
                  To empower educators with comprehensive tools for micromanagement and 
                  outside-classroom monitoring, enabling them to focus on what matters most - 
                  nurturing student success. We bridge the gap between traditional education 
                  and modern technology, creating seamless experiences for all stakeholders.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-secondary/10 to-transparent backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-secondary/20">
                    <Eye className="w-8 h-8 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Our Vision</h2>
                </div>
                <p className="text-white/80 leading-relaxed">
                  To become the global leader in education management platforms, known for 
                  our innovative approach to student monitoring and educator empowerment. 
                  We envision a world where every educational institution operates at peak 
                  efficiency, and every learner receives the attention they deserve.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Our Story</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Built by Educators, for Education
                </h2>
              </div>

              <div className="prose prose-lg prose-invert mx-auto">
                <p className="text-white/80 leading-relaxed mb-6">
                  NextPhoton was born from a simple observation: while there were countless 
                  platforms for content delivery and online learning, there was a significant 
                  gap in tools for comprehensive education management, particularly in 
                  micromanagement and outside-classroom monitoring.
                </p>
                <p className="text-white/80 leading-relaxed mb-6">
                  Our founders, having experienced the challenges of education management 
                  firsthand, recognized that educators needed more than just content delivery 
                  systems. They needed tools to track attendance, monitor progress, manage 
                  communications, handle administrative tasks, and maintain strong connections 
                  with learners and their guardians.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Today, NextPhoton serves as the "Uber for Educators" - a comprehensive 
                  platform that handles the operational complexities of education, allowing 
                  educators to focus on what they do best: teaching and mentoring.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                The principles that guide every decision we make
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${value.color} bg-opacity-10 mb-4`}>
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-white/70">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Our Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Milestones & Achievements
              </h2>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/50 via-secondary/50 to-primary/50" />

              {/* Timeline items */}
              {milestones.map((milestone, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <div className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <div className="text-primary font-bold text-lg mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                        <p className="text-white/70 text-sm">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Global Team
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Passionate individuals from around the world, united by a common goal
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
            {teamStats.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10 text-center max-w-3xl mx-auto">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Join Our Mission
              </h3>
              <p className="text-white/70 mb-6">
                We're always looking for talented individuals who share our passion for transforming education
              </p>
              <a
                href="/company/careers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                View Open Positions
                <Zap className="w-5 h-5" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}