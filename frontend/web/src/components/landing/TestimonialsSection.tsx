"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "../animations/ScrollReveal";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Parent of 2 Students",
    image: "/api/placeholder/64/64",
    rating: 5,
    content: "NextPhoton has transformed how I monitor my children's education. The real-time updates and progress tracking give me peace of mind.",
    highlight: "Real-time monitoring",
  },
  {
    name: "Dr. Michael Chen",
    role: "Physics Educator",
    image: "/api/placeholder/64/64",
    rating: 5,
    content: "The platform's micromanagement features are exceptional. I can track each student's progress outside the classroom effectively.",
    highlight: "Exceptional tracking",
  },
  {
    name: "Priya Patel",
    role: "EduCare Manager",
    image: "/api/placeholder/64/64",
    rating: 5,
    content: "Managing multiple educators and hundreds of students has never been easier. The analytics dashboard is incredibly powerful.",
    highlight: "Powerful analytics",
  },
  {
    name: "Alex Thompson",
    role: "High School Student",
    image: "/api/placeholder/64/64",
    rating: 5,
    content: "I love how organized everything is. My study plans, assignments, and session bookings are all in one place.",
    highlight: "Well organized",
  },
  {
    name: "Rebecca Martinez",
    role: "Math Educator",
    image: "/api/placeholder/64/64",
    rating: 5,
    content: "The session booking system saves me hours every week. Students can easily schedule sessions based on my availability.",
    highlight: "Time-saving",
  },
  {
    name: "James Wilson",
    role: "School Administrator",
    image: "/api/placeholder/64/64",
    rating: 5,
    content: "NextPhoton's ABAC security gives us confidence that our data is protected. The role-based access control is perfect.",
    highlight: "Secure platform",
  },
];

/**
 * Testimonials section with animated cards
 */
export function TestimonialsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-purple-500 fill-purple-500" />
              <span className="text-sm font-medium text-purple-500">Testimonials</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"> Thousands</span>
            </h2>
            
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              See what educators, parents, and students are saying about their experience with NextPhoton.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                className="group h-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  
                  {/* Content */}
                  <p className="text-white/70 mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  {/* Highlight badge */}
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <span className="text-xs font-medium text-primary">{testimonial.highlight}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-white">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-white/60">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Stats section */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                98%
              </div>
              <div className="text-sm text-white/70">Satisfaction Rate</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <div className="text-sm text-white/70">Average Rating</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-sm text-white/70">Happy Users</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-sm text-white/70">Support Available</div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}