import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

/**
 * Main landing page for NextPhoton
 * The entry point when users visit the root URL
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section with main CTA */}
      <HeroSection />
      
      {/* Features showcase */}
      <FeaturesSection />
      
      {/* Social proof */}
      <TestimonialsSection />
      
      {/* Pricing options */}
      <PricingSection />
      
      {/* Footer with links and info */}
      <Footer />
    </div>
  );
}

/**
 * Metadata for the landing page
 */
export const metadata = {
  title: "NextPhoton - The Uber for Educators | Education Management Platform",
  description: "Transform education with NextPhoton's comprehensive management platform. Focus on micromanagement and outside-classroom monitoring while we handle the rest.",
  keywords: "education management, online tutoring, educator platform, student monitoring, educare, learning management system",
  openGraph: {
    title: "NextPhoton - Revolutionizing Education Management",
    description: "The comprehensive platform for educators, learners, and guardians",
    type: "website",
    url: "https://nextphoton.com",
    images: [
      {
        url: "/PhotonLogo/PhotonEarth.png",
        width: 813,
        height: 815,
        alt: "NextPhoton Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextPhoton - The Uber for Educators",
    description: "Transform education with our comprehensive management platform",
    images: ["/PhotonLogo/PhotonEarth.png"],
  },
};