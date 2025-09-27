"use client";

import { motion } from "framer-motion";
import { Copy, CheckCircle2, KeyRound, Users } from "lucide-react";
import { useState } from "react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { LogoComponent } from "@/components/LogoComponent";
import Link from "next/link";
import { toast } from "sonner";

interface Credential {
  role: string;
  email: string;
  password: string;
  description: string;
  color: string;
}

const testCredentials: Credential[] = [
  {
    role: "Admin",
    email: "admin@nextphoton.com",
    password: "Admin@123456",
    description: "Full system access with administrative privileges",
    color: "from-red-500 to-pink-500"
  },
  {
    role: "Educator",
    email: "john.educator@nextphoton.com",
    password: "Educator@123",
    description: "Access to teaching tools and student management",
    color: "from-purple-500 to-indigo-500"
  },
  {
    role: "Learner",
    email: "mike.learner@nextphoton.com",
    password: "Learner@123",
    description: "Student dashboard with learning resources",
    color: "from-teal-500 to-green-500"
  },
  {
    role: "Guardian",
    email: "robert.guardian@nextphoton.com",
    password: "Guardian@123",
    description: "Parent portal with child monitoring features",
    color: "from-blue-500 to-cyan-500"
  },
  {
    role: "EduCare Manager",
    email: "sarah.ecm@nextphoton.com",
    password: "ECM@123456",
    description: "Educational care management dashboard",
    color: "from-orange-500 to-amber-500"
  },
  {
    role: "Employee",
    email: "tom.employee@nextphoton.com",
    password: "Employee@123",
    description: "Staff dashboard with operational tools",
    color: "from-emerald-500 to-teal-500"
  },
  {
    role: "Intern",
    email: "emma.intern@nextphoton.com",
    password: "Intern@123",
    description: "Limited access for training purposes",
    color: "from-pink-500 to-rose-500"
  }
];

export default function TestCredentialsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background relative py-12">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeSelector />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <Link href="/" className="inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl" />
                <div className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-3 border border-white/20">
                  <LogoComponent width={48} height={48} />
                </div>
              </div>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Test Credentials</h1>
          <p className="text-muted-foreground text-lg">
            Use these test accounts to explore different user roles and features
          </p>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl backdrop-blur-sm"
        >
          <p className="text-amber-600 dark:text-amber-400 text-center flex items-center justify-center gap-2">
            <KeyRound size={20} />
            <span className="font-medium">For testing purposes only - Do not use in production</span>
          </p>
        </motion.div>

        {/* Credentials Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {testCredentials.map((cred, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Role Header */}
              <div className="mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${cred.color} text-white text-sm font-semibold`}>
                  <Users size={16} />
                  {cred.role}
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-4">
                {cred.description}
              </p>

              {/* Credentials */}
              <div className="space-y-3">
                {/* Email */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono text-foreground truncate pr-2">
                      {cred.email}
                    </p>
                    <button
                      onClick={() => copyToClipboard(cred.email, index * 2)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      {copiedIndex === index * 2 ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} className="text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Password</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono text-foreground">
                      {cred.password}
                    </p>
                    <button
                      onClick={() => copyToClipboard(cred.password, index * 2 + 1)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      {copiedIndex === index * 2 + 1 ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} className="text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <Link
                href="/sign-in"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary font-medium text-sm transition-all"
              >
                Go to Login
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-muted-foreground text-sm"
        >
          <p>These test accounts are reset periodically. Data may be cleared without notice.</p>
        </motion.div>
      </div>
    </div>
  );
}