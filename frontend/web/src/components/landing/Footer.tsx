"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LogoComponent } from "../LogoComponent";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Demo", href: "#demo" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Press", href: "/press" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Help Center", href: "/help" },
    { name: "Community", href: "/community" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "/security" },
    { name: "Compliance", href: "/compliance" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

/**
 * Footer component with company information and links
 */
export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 bg-black/5 backdrop-blur-sm border-t border-white/10">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand section - Top Left */}
          <div className="lg:col-span-2">
            {/* NextPhoton Brand - Prominent positioning */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <LogoComponent width={48} height={48} />
                <span className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                  NextPhoton
                </span>
              </div>
              
              <p className="text-white/70 text-lg">
                Revolutionizing education management with cutting-edge technology and comprehensive monitoring solutions.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-2">
              <a href="mailto:hello@nextphoton.com" className="flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                hello@nextphoton.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </a>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4" />
                Bangalore, India
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5 text-white/80" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-4 gap-8">
            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-sm text-white/60 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company & Resources */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Company & Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/company/about" className="text-sm text-white/60 hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/resources/contact" className="text-sm text-white/60 hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-white/60 hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-white/60 hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-sm text-white/60 hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-sm text-white/60 hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/legal/privacy" className="text-sm text-white/60 hover:text-primary transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="text-sm text-white/60 hover:text-primary transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/legal/security" className="text-sm text-white/60 hover:text-primary transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/legal/compliance" className="text-sm text-white/60 hover:text-primary transition-colors">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="py-8 border-t border-white/10 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1 text-white">Subscribe to our newsletter</h3>
              <p className="text-sm text-white/60">Get updates on new features and educational insights</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder:text-white/40"
              />
              <motion.button
                type="submit"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} NextPhoton. All rights reserved.
          </p>
          <p className="text-sm text-white/60 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}