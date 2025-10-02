/**
 * Testimonials page for NextPhoton
 * Showcases success stories and reviews from users
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Star, 
  Quote, 
  User, 
  Building2, 
  TrendingUp,
  Award,
  Users,
  BookOpen,
  Heart
} from "lucide-react";

// Testimonial data
const testimonials = [
  {
    category: "Educators",
    items: [
      {
        name: "Dr. Sarah Chen",
        role: "Mathematics Educator",
        institution: "Elite Learning Academy",
        avatar: "SC",
        rating: 5,
        quote: "NextPhoton has revolutionized how I manage my classes. The automated scheduling and progress tracking save me hours every week, allowing me to focus more on teaching.",
        highlight: "Saved 15+ hours per week",
      },
      {
        name: "Prof. Michael Rodriguez",
        role: "Physics Educator",
        institution: "STEM Excellence Center",
        avatar: "MR",
        rating: 5,
        quote: "The analytics dashboard gives me incredible insights into student performance. I can identify struggling students early and provide targeted support.",
        highlight: "40% improvement in student outcomes",
      },
      {
        name: "Ms. Priya Sharma",
        role: "Language Arts Educator",
        institution: "Global Language Institute",
        avatar: "PS",
        rating: 5,
        quote: "The platform's content creation tools are fantastic. I can easily create interactive lessons and track student engagement in real-time.",
        highlight: "3x increase in student engagement",
      },
    ],
  },
  {
    category: "Learners",
    items: [
      {
        name: "Alex Thompson",
        role: "Grade 12 Student",
        institution: "Westfield High School",
        avatar: "AT",
        rating: 5,
        quote: "The personalized study plans have been a game-changer. I can track my progress, set goals, and stay motivated throughout my learning journey.",
        highlight: "Improved grades by 25%",
      },
      {
        name: "Emily Zhang",
        role: "University Prep Student",
        institution: "Cambridge Prep Academy",
        avatar: "EZ",
        rating: 5,
        quote: "Having all my educational resources in one place is amazing. The mobile app lets me study anywhere, anytime.",
        highlight: "Accepted to top university",
      },
      {
        name: "Raj Patel",
        role: "JEE Aspirant",
        institution: "Tech Prep Institute",
        avatar: "RP",
        rating: 5,
        quote: "The practice tests and performance analytics helped me identify my weak areas and improve systematically. Couldn't have cracked JEE without it!",
        highlight: "Scored in top 1% JEE",
      },
    ],
  },
  {
    category: "Guardians",
    items: [
      {
        name: "Jennifer Williams",
        role: "Parent of 2",
        institution: "Mother",
        avatar: "JW",
        rating: 5,
        quote: "Finally, a platform that keeps me informed about my children's education. I can track attendance, communicate with teachers, and monitor progress all in one place.",
        highlight: "Peace of mind guaranteed",
      },
      {
        name: "David Kumar",
        role: "Working Parent",
        institution: "Father",
        avatar: "DK",
        rating: 5,
        quote: "The transparency in fee management and direct communication with educators has made managing my child's education so much easier.",
        highlight: "Saved 5+ hours weekly",
      },
    ],
  },
  {
    category: "Institutions",
    items: [
      {
        name: "Lisa Anderson",
        role: "Director",
        institution: "Bright Minds Academy",
        avatar: "LA",
        rating: 5,
        quote: "NextPhoton has transformed our institution. We've streamlined operations, improved parent satisfaction, and seen significant growth in enrollment.",
        highlight: "30% increase in enrollment",
      },
      {
        name: "Robert Chang",
        role: "Principal",
        institution: "Innovation School Network",
        avatar: "RC",
        rating: 5,
        quote: "The multi-campus support and enterprise features allow us to maintain consistency across all our locations while providing flexibility for local needs.",
        highlight: "Managing 15+ campuses efficiently",
      },
    ],
  },
];

// Statistics
const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Users",
  },
  {
    icon: Building2,
    value: "500+",
    label: "Institutions",
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "Satisfaction Rate",
  },
  {
    icon: Award,
    value: "4.9/5",
    label: "Average Rating",
  },
];

export default function TestimonialsPage() {
  return (
    <PageLayout
      title="Success Stories"
      subtitle="Hear from educators, learners, and guardians who have transformed their educational experience with NextPhoton"
    >
      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
                  <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials by Category */}
      {testimonials.map((category, categoryIndex) => (
        <section key={categoryIndex} className="py-16">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                {category.category}
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((testimonial, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                    {/* Quote Icon */}
                    <Quote className="w-8 h-8 text-primary/30 mb-4" />

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-white/80 mb-6 flex-grow">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Highlight */}
                    {testimonial.highlight && (
                      <div className="mb-4 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-flex items-center gap-2 self-start">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                          {testimonial.highlight}
                        </span>
                      </div>
                    )}

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-white/70">{testimonial.role}</div>
                        <div className="text-xs text-white/50">{testimonial.institution}</div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Video Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Video Testimonials
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Watch real users share their transformative experiences with NextPhoton
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((_, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="aspect-video rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden group cursor-pointer hover:bg-white/10 transition-all duration-300">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1" />
                      </div>
                      <p className="text-white/70">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Join Our Growing Community
              </h2>
              <p className="text-lg text-white/70 mb-8">
                Experience the difference that NextPhoton can make in your educational journey
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/sign-in"
                  className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Your Journey
                </a>
                <a
                  href="/product/demo"
                  className="px-8 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
                >
                  Book a Demo
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}