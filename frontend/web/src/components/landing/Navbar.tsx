"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "@/components/ThemeSelector";

/**
 * Navigation structure for the landing pages
 */
const navigation = {
  product: {
    name: "Product",
    items: [
      { name: "Features", href: "/product/features" },
      { name: "Pricing", href: "/product/pricing" },
      { name: "Testimonials", href: "/product/testimonials" },
      { name: "Demo", href: "/product/demo" },
    ],
  },
  company: {
    name: "Company",
    items: [
      { name: "About", href: "/company/about" },
      { name: "Careers", href: "/company/careers" },
      { name: "Blog", href: "/company/blog" },
      { name: "Press", href: "/company/press" },
    ],
  },
  resources: {
    name: "Resources",
    items: [
      { name: "Documentation", href: "/resources/documentation" },
      { name: "Help Center", href: "/resources/help-center" },
      { name: "Community", href: "/resources/community" },
      { name: "Contact", href: "/resources/contact" },
    ],
  },
  legal: {
    name: "Legal",
    items: [
      { name: "Privacy", href: "/legal/privacy" },
      { name: "Terms", href: "/legal/terms" },
      { name: "Security", href: "/legal/security" },
      { name: "Compliance", href: "/legal/compliance" },
    ],
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-2 bg-background/5 backdrop-blur-xl border-b border-white/10"
          : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
          >
            <motion.span
              className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              NextPhoton
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {Object.entries(navigation).map(([key, section]) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setOpenDropdown(key)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors",
                    openDropdown === key && "text-foreground"
                  )}
                >
                  {section.name}
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {openDropdown === key && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-background/80 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
                    >
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "block px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors",
                            pathname === item.href && "text-foreground bg-white/5"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <ThemeSelector />

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground/80 hover:text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4"
            >
              <div className="rounded-xl bg-background/80 backdrop-blur-xl border border-white/10 p-4">
                {Object.entries(navigation).map(([key, section]) => (
                  <div key={key} className="mb-4">
                    <h3 className="text-sm font-semibold text-foreground/60 mb-2">
                      {section.name}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "block px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors",
                            pathname === item.href && "text-foreground bg-white/5"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Mobile CTA Buttons */}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                  <Link
                    href="/sign-in"
                    className="w-full px-4 py-2 text-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full px-4 py-2 text-center text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}