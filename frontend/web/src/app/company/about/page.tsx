/**
 * About page for NextPhoton
 * Company information, mission, team, and values
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Sparkles, 
  Target, 
  Users, 
  Heart, 
  Rocket, 
  Shield, 
  Award, 
  Globe,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Building,
  Calendar,
  CheckCircle,
  Star,
  Quote
} from "lucide-react";
import Image from "next/image";

// Company timeline milestones
const milestones = [
  {
    year: "2023",
    title: "Foundation",
    description: "NextPhoton was founded with a vision to revolutionize education through personalized learning",
    icon: Rocket
  },
  {
    year: "2024",
    title: "Platform Launch",
    description: "Launched our beta platform with 100+ educators and 500+ learners",
    icon: Globe
  },
  {
    year: "2024",
    title: "Series A Funding",
    description: "Secured funding to expand our platform and reach more communities",
    icon: TrendingUp
  },
  {
    year: "2025",
    title: "National Expansion",
    description: "Expanded services nationwide with 1000+ verified educators",
    icon: Building
  }
];

// Core values
const values = [
  {
    icon: Heart,
    title: "Student-Centered",
    description: "Every decision we make prioritizes the educational success and wellbeing of learners"
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "We maintain the highest standards of safety and verification for all platform users"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Continuously evolving our platform to meet the changing needs of modern education"
  },
  {
    icon: Users,
    title: "Community",
    description: "Building strong connections between learners, educators, and families"
  },
  {
    icon: Star,
    title: "Excellence",
    description: "Committed to delivering exceptional educational experiences and outcomes"
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Making quality education accessible to learners from all backgrounds"
  }
];

// Team members
const leadership = [
  {
    name: "Dr. Sarah Johnson",
    role: "Chief Executive Officer",
    image: "/api/placeholder/200/200",
    bio: "Former educator with 15+ years in educational technology"
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    image: "/api/placeholder/200/200",
    bio: "Led engineering teams at major EdTech companies"
  },
  {
    name: "Priya Patel",
    role: "Chief Education Officer",
    image: "/api/placeholder/200/200",
    bio: "Curriculum expert and former school principal"
  },
  {
    name: "Robert Williams",
    role: "Chief Operations Officer",
    image: "/api/placeholder/200/200",
    bio: "Scaled operations at leading marketplace platforms"
  }
];

// Company statistics
const stats = [
  { value: "10,000+", label: "Active Learners" },
  { value: "1,000+", label: "Verified Educators" },
  { value: "50,000+", label: "Sessions Completed" },
  { value: "4.9/5", label: "Average Rating" }
];

// Testimonials
const testimonials = [
  {
    quote: "NextPhoton transformed how we approach our child's education. The personalized attention has made all the difference.",
    author: "Jennifer M.",
    role: "Parent of 8th Grader"
  },
  {
    quote: "As an educator, I love the flexibility and the ability to truly connect with my students one-on-one.",
    author: "David K.",
    role: "Math Educator"
  },
  {
    quote: "The platform's focus on safety and quality gives us peace of mind. We know our daughter is in good hands.",
    author: "The Sharma Family",
    role: "Parents"
  }
];

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container relative mx-auto px-4">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Reimagining Education for Every Learner
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                NextPhoton is more than an educational platform – we're a movement to make 
                personalized, high-quality education accessible to every student, everywhere.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    We believe every student deserves access to exceptional educators who can 
                    unlock their full potential. Our mission is to bridge the gap between learners 
                    and educators through technology, creating personalized educational experiences 
                    that adapt to each student's unique needs and goals.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    By focusing on micromanagement and outside-classroom support, we ensure that 
                    learning doesn't stop when the school bell rings. We're building a comprehensive 
                    ecosystem where students, parents, and educators work together seamlessly.
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-32 h-32 text-primary/20" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These principles guide every decision we make and shape how we serve our community
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.1}>
                <div className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-lg text-muted-foreground">
                From a simple idea to transforming thousands of lives
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              
              {milestones.map((milestone, index) => (
                <ScrollReveal key={`${milestone.year}-${index}`} delay={index * 0.1}>
                  <div className="relative flex items-start mb-12 last:mb-0">
                    <div className="absolute left-8 w-4 h-4 bg-primary rounded-full -translate-x-1/2" />
                    <div className="ml-20">
                      <div className="flex items-center gap-3 mb-2">
                        <milestone.icon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-lg opacity-90">
                Numbers that showcase our growing community
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experienced professionals dedicated to transforming education
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {leadership.map((member, index) => (
              <ScrollReveal key={member.name} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-16 h-16 text-primary/30" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
              <p className="text-lg text-muted-foreground">
                Real stories from real people
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={testimonial.author} delay={index * 0.1}>
                <div className="bg-card p-6 rounded-lg border relative">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're a learner seeking knowledge, an educator wanting to make a 
                difference, or a parent looking for the best for your child – there's a place 
                for you in the NextPhoton community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium">
                  Start Learning Today
                </button>
                <button className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium">
                  Become an Educator
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}