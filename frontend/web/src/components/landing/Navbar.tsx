"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ChevronDown,
  Package,
  Star,
  CreditCard,
  MessageSquare,
  Rocket,
  Building,
  Users,
  Mail,
  Briefcase,
  BookOpen,
  FileText,
  HelpCircle,
  UsersRound,
  Shield,
  ScrollText,
  Lock,
  FileCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "@/components/ThemeSelector";
import { LogoComponent } from "@/components/LogoComponent";

/**
 * Navigation structure for the landing pages
 */
const navigation = {
  product: {
    name: "Product",
    items: [
      { name: "Features", href: "/product/features", icon: Package, description: "Explore our comprehensive features" },
      { name: "Pricing", href: "/product/pricing", icon: CreditCard, description: "Simple, transparent pricing plans" },
      { name: "Testimonials", href: "/product/testimonials", icon: Star, description: "What our users are saying" },
      { name: "Demo", href: "/product/demo", icon: Rocket, description: "See NextPhoton in action" },
    ],
    isTwoColumn: false,
  },
  aboutUs: {
    name: "About Us",
    items: [
      // Company items
      { name: "About", href: "/company/about", icon: Building, description: "Learn about our mission", category: "company" },
      { name: "Careers", href: "/company/careers", icon: Briefcase, description: "Join our growing team", category: "company" },
      { name: "Blog", href: "/company/blog", icon: BookOpen, description: "Latest news and insights", category: "company" },
      { name: "Press", href: "/company/press", icon: FileText, description: "Press releases and media", category: "company" },
      // Resources items
      { name: "Contact", href: "/resources/contact", icon: Mail, description: "Get in touch with us", category: "resources" },
      { name: "Documentation", href: "/resources/documentation", icon: FileCheck, description: "Technical documentation", category: "resources" },
      { name: "Help Center", href: "/resources/help-center", icon: HelpCircle, description: "Find answers to your questions", category: "resources" },
      { name: "Community", href: "/resources/community", icon: UsersRound, description: "Connect with other users", category: "resources" },
    ],
    isTwoColumn: true,
    columnTitles: { company: "Company", resources: "Resources" },
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
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              {/* Logo with background for visibility */}
              <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg p-1">
                <LogoComponent width={32} height={32} />
              </div>
              <span className="text-xl font-bold text-foreground">
                NextPhoton
              </span>
            </motion.div>
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
                      className={cn(
                        "absolute top-full mt-2 z-50",
                        section.isTwoColumn ? "left-1/2 -translate-x-1/2 w-[540px]" : "left-0 w-[320px]"
                      )}
                    >
                      <div className="bg-background backdrop-blur-xl rounded-xl p-5 border border-white/20 shadow-2xl">
                        {section.isTwoColumn && section.columnTitles ? (
                          // Two-column layout for About Us
                          <div>
                            <h3 className="text-lg font-semibold mb-4">{section.name}</h3>
                            <div className="grid grid-cols-2 gap-3">
                              {/* Company Column */}
                              <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                                  {section.columnTitles.company}
                                </h4>
                                {section.items
                                  .filter((item: any) => item.category === "company")
                                  .map((item: any) => (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      className={cn(
                                        "flex items-start gap-3 p-3 rounded-lg relative overflow-hidden",
                                        "bg-white/5 backdrop-blur-sm border mb-2",
                                        pathname === item.href 
                                          ? "border-white/30 bg-white/15" 
                                          : "border-white/10 hover:border-white/20 hover:bg-white/10",
                                        "transition-all duration-200"
                                      )}
                                    >
                                      <item.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {item.description}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                              </div>
                              
                              {/* Resources Column */}
                              <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                                  {section.columnTitles.resources}
                                </h4>
                                {section.items
                                  .filter((item: any) => item.category === "resources")
                                  .map((item: any) => (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      className={cn(
                                        "flex items-start gap-3 p-3 rounded-lg relative overflow-hidden",
                                        "bg-white/5 backdrop-blur-sm border mb-2",
                                        pathname === item.href 
                                          ? "border-white/30 bg-white/15" 
                                          : "border-white/10 hover:border-white/20 hover:bg-white/10",
                                        "transition-all duration-200"
                                      )}
                                    >
                                      <item.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {item.description}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Single column layout for Product dropdown
                          <div>
                            <h3 className="text-lg font-semibold mb-4">{section.name}</h3>
                            <div className="space-y-2">
                              {section.items.map((item: any) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className={cn(
                                    "flex items-start gap-3 p-3 rounded-lg relative overflow-hidden",
                                    "bg-white/5 backdrop-blur-sm border",
                                    pathname === item.href 
                                      ? "border-white/30 bg-white/15" 
                                      : "border-white/10 hover:border-white/20 hover:bg-white/10",
                                    "transition-all duration-200"
                                  )}
                                >
                                  <item.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {item.description}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
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
                      {section.items.map((item: any) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors",
                            pathname === item.href && "text-foreground bg-white/5"
                          )}
                        >
                          <item.icon className="w-4 h-4" />
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
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}