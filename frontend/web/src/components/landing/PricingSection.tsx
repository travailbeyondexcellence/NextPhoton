"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "../animations/ScrollReveal";
import Link from "next/link";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for individual learners and small families",
    price: "₹499",
    period: "per month",
    icon: Sparkles,
    color: "from-teal-500 to-cyan-500",
    features: [
      "Up to 2 learners",
      "Basic progress tracking",
      "Session booking",
      "Email support",
      "Mobile app access",
      "Basic analytics",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    description: "Ideal for educators and tutoring centers",
    price: "₹1,999",
    period: "per month",
    icon: Zap,
    color: "from-blue-500 to-purple-500",
    features: [
      "Up to 50 learners",
      "Advanced analytics",
      "Priority session booking",
      "24/7 phone support",
      "Custom branding",
      "API access",
      "Performance reports",
      "Team collaboration",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    description: "For institutions and large organizations",
    price: "Custom",
    period: "contact us",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    features: [
      "Unlimited learners",
      "White-label solution",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security",
      "SLA guarantee",
      "On-premise deployment",
      "Custom training",
    ],
    highlighted: false,
  },
];

/**
 * Pricing section with animated cards
 */
export function PricingSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">Flexible Pricing</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"> Perfect Plan</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as you grow. All plans include core features with no hidden fees.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                className={`relative h-full ${plan.highlighted ? 'md:-mt-4' : ''}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className={`h-full p-8 rounded-2xl bg-white/5 backdrop-blur-sm border ${
                  plan.highlighted ? 'border-primary/30 bg-white/10' : 'border-white/10'
                } hover:bg-white/10 transition-colors`}>
                  {/* Plan icon and name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.color} bg-opacity-10`}>
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/signup"
                      className={`block w-full py-3 px-6 rounded-xl text-center font-semibold transition-all ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-500/25'
                          : 'bg-white/10 border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Additional info */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm">No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm">Instant access</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}