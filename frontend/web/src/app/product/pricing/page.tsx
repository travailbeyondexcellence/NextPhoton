/**
 * Pricing page for NextPhoton
 * Displays pricing plans and options for different user types
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Check, 
  X, 
  Zap, 
  Users, 
  Building2, 
  Sparkles,
  Calculator,
  HelpCircle,
  ArrowRight
} from "lucide-react";

// Pricing tiers
const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for individual educators and small tutoring centers",
    price: "$49",
    period: "/month",
    color: "from-teal-500 to-cyan-500",
    features: [
      { text: "Up to 50 learners", included: true },
      { text: "5 educator accounts", included: true },
      { text: "Basic analytics", included: true },
      { text: "Email support", included: true },
      { text: "Standard scheduling", included: true },
      { text: "Mobile app access", included: true },
      { text: "Advanced analytics", included: false },
      { text: "Custom branding", included: false },
      { text: "API access", included: false },
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    description: "Ideal for growing educational institutions",
    price: "$149",
    period: "/month",
    color: "from-blue-500 to-indigo-500",
    features: [
      { text: "Up to 500 learners", included: true },
      { text: "Unlimited educators", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority support", included: true },
      { text: "Smart scheduling", included: true },
      { text: "Mobile app access", included: true },
      { text: "Custom branding", included: true },
      { text: "Performance insights", included: true },
      { text: "API access", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large institutions with advanced needs",
    price: "Custom",
    period: "",
    color: "from-purple-500 to-pink-500",
    features: [
      { text: "Unlimited learners", included: true },
      { text: "Unlimited educators", included: true },
      { text: "Enterprise analytics", included: true },
      { text: "Dedicated support", included: true },
      { text: "Advanced scheduling", included: true },
      { text: "Mobile app access", included: true },
      { text: "White-label solution", included: true },
      { text: "Custom integrations", included: true },
      { text: "Full API access", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

// FAQ items
const faqs = [
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer: "We offer a 14-day free trial for all plans. No credit card required to start.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and bank transfers for enterprise customers.",
  },
  {
    question: "Do you offer discounts for educational institutions?",
    answer: "Yes, we offer special pricing for non-profit educational institutions. Contact our sales team for details.",
  },
];

export default function PricingPage() {
  return (
    <PageLayout
      title="Simple, Transparent Pricing"
      subtitle="Choose the perfect plan for your educational needs. Scale up as you grow."
    >
      {/* Pricing Plans Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Billing Toggle */}
          <ScrollReveal>
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10">
                <button className="px-6 py-2 rounded-full bg-primary text-white font-medium">
                  Monthly
                </button>
                <button className="px-6 py-2 rounded-full text-white/70 hover:text-white transition-colors">
                  Annual (Save 20%)
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className={`relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border ${
                  plan.popular ? 'border-primary' : 'border-white/10'
                } hover:bg-white/10 transition-all duration-300`}>
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="px-4 py-1 rounded-full bg-primary text-white text-sm font-medium flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/70 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-white/70 ml-1">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-red-500/50 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-white' : 'text-white/40'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button className={`w-full py-3 px-6 rounded-full font-medium transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Pricing Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Custom Solutions</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Need a Custom Plan?
              </h2>
              
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                We understand that every educational institution has unique needs. 
                Let's create a custom plan that perfectly fits your requirements.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">Volume Discounts</h3>
                  <p className="text-sm text-white/70">Special rates for 1000+ learners</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <Building2 className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">Multi-Campus</h3>
                  <p className="text-sm text-white/70">Manage multiple locations seamlessly</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">Custom Features</h3>
                  <p className="text-sm text-white/70">Tailored functionality for your needs</p>
                </div>
              </div>

              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Sales Team
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">FAQs</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
            </div>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="mb-6 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-white/70">
                    {faq.answer}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}