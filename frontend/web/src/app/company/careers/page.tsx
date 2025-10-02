/**
 * Careers page for NextPhoton
 * Job opportunities and company culture information
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Coffee,
  Laptop,
  Users,
  Zap,
  Award,
  Sparkles,
  Globe,
  Rocket,
  BookOpen,
  Home,
  Calendar,
  ArrowRight
} from "lucide-react";

// Benefits
const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and wellness programs",
  },
  {
    icon: Home,
    title: "Remote-First",
    description: "Work from anywhere with flexible hours and async collaboration",
  },
  {
    icon: BookOpen,
    title: "Learning Budget",
    description: "$2,000 annual budget for courses, conferences, and certifications",
  },
  {
    icon: Calendar,
    title: "Unlimited PTO",
    description: "Take the time you need to recharge and maintain work-life balance",
  },
  {
    icon: Laptop,
    title: "Top Equipment",
    description: "Latest MacBook Pro or equivalent, plus $500 home office stipend",
  },
  {
    icon: DollarSign,
    title: "Competitive Pay",
    description: "Market-leading salaries with equity options for all employees",
  },
];

// Open positions
const openPositions = [
  {
    category: "Engineering",
    positions: [
      {
        title: "Senior Full Stack Developer",
        location: "Remote",
        type: "Full-time",
        level: "Senior",
        description: "Join our core team to build and scale our Next.js and NestJS platform",
      },
      {
        title: "DevOps Engineer",
        location: "Remote",
        type: "Full-time",
        level: "Mid-Senior",
        description: "Help us build robust infrastructure and CI/CD pipelines",
      },
      {
        title: "Mobile Developer (React Native)",
        location: "Remote",
        type: "Full-time",
        level: "Mid-Level",
        description: "Lead the development of our mobile applications",
      },
    ],
  },
  {
    category: "Product & Design",
    positions: [
      {
        title: "Product Manager",
        location: "Remote",
        type: "Full-time",
        level: "Senior",
        description: "Define and execute product strategy for our education platform",
      },
      {
        title: "UI/UX Designer",
        location: "Remote",
        type: "Full-time",
        level: "Mid-Level",
        description: "Create intuitive and beautiful experiences for our users",
      },
    ],
  },
  {
    category: "Sales & Marketing",
    positions: [
      {
        title: "Head of Sales",
        location: "Remote",
        type: "Full-time",
        level: "Senior",
        description: "Build and lead our sales team to drive growth",
      },
      {
        title: "Content Marketing Manager",
        location: "Remote",
        type: "Full-time",
        level: "Mid-Level",
        description: "Create compelling content to engage our education community",
      },
    ],
  },
  {
    category: "Customer Success",
    positions: [
      {
        title: "Customer Success Manager",
        location: "Remote",
        type: "Full-time",
        level: "Mid-Level",
        description: "Ensure our institutions achieve their goals with NextPhoton",
      },
      {
        title: "Implementation Specialist",
        location: "Remote",
        type: "Full-time",
        level: "Entry-Mid",
        description: "Guide new customers through onboarding and setup",
      },
    ],
  },
];

// Company culture values
const cultureValues = [
  {
    icon: Users,
    title: "Collaborative",
    description: "We believe in the power of teamwork and open communication",
  },
  {
    icon: Rocket,
    title: "Innovative",
    description: "We encourage creative thinking and bold ideas",
  },
  {
    icon: Globe,
    title: "Inclusive",
    description: "We celebrate diversity and create an environment where everyone belongs",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for quality in everything we do",
  },
];

export default function CareersPage() {
  return (
    <PageLayout
      title="Join Our Team"
      subtitle="Help us transform education technology and make a lasting impact on millions of learners worldwide"
    >
      {/* Why Join Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <ScrollReveal>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Why NextPhoton?</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Build the Future of Education
                </h2>
                
                <p className="text-lg text-white/80 mb-6">
                  At NextPhoton, we're not just building software - we're creating tools that 
                  empower educators, engage learners, and involve guardians in the educational 
                  journey. Our platform impacts thousands of lives daily, and we need passionate 
                  individuals to help us scale our mission globally.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-white/80">Work on challenging problems in education technology</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-white/80">Collaborate with a talented, diverse global team</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-white/80">Make a real impact on education worldwide</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-white/80">Grow your career with mentorship and learning opportunities</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm border border-white/10">
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <p className="text-white/70">Team Members</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-transparent backdrop-blur-sm border border-white/10">
                    <div className="text-3xl font-bold text-secondary mb-2">15+</div>
                    <p className="text-white/70">Countries</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent backdrop-blur-sm border border-white/10">
                    <div className="text-3xl font-bold text-accent mb-2">98%</div>
                    <p className="text-white/70">Employee Satisfaction</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm border border-white/10">
                    <div className="text-3xl font-bold text-primary mb-2">4.8/5</div>
                    <p className="text-white/70">Glassdoor Rating</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Benefits & Perks
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                We take care of our team so they can take care of our mission
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <benefit.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Open Positions</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Find Your Next Role
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Join us in building the future of education technology
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            {openPositions.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-10">
                <ScrollReveal delay={categoryIndex * 0.1}>
                  <h3 className="text-2xl font-bold text-white mb-6">{category.category}</h3>
                </ScrollReveal>

                <div className="space-y-4">
                  {category.positions.map((position, index) => (
                    <ScrollReveal key={index} delay={index * 0.05}>
                      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                          <h4 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                            {position.title}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-sm">
                              <MapPin className="w-3 h-3" />
                              {position.location}
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-sm">
                              <Clock className="w-3 h-3" />
                              {position.type}
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-sm">
                              <Award className="w-3 h-3" />
                              {position.level}
                            </span>
                          </div>
                        </div>
                        <p className="text-white/70 mb-4">{position.description}</p>
                        <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                          <span className="font-medium">View Details</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-12">
              <p className="text-white/70 mb-4">
                Don't see a position that fits? We're always looking for talented people.
              </p>
              <a
                href="mailto:careers@nextphoton.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                Send Us Your Resume
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Culture
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                What makes NextPhoton a great place to work
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            {cultureValues.map((value, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-white/70">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10 text-center max-w-3xl mx-auto">
              <Coffee className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Life at NextPhoton
              </h3>
              <p className="text-white/70 mb-6">
                From virtual coffee chats to team retreats, we make sure to stay connected 
                and celebrate our wins together, no matter where we are in the world.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="#positions"
                  className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  View Open Positions
                </a>
                <a
                  href="/company/about"
                  className="px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
                >
                  Learn More About Us
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}