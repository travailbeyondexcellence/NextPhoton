"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogoComponent } from "@/components/LogoComponent";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    
    try {
      // TODO: Implement actual forgot password API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background relative">
        {/* Background gradient effect - subtle */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Floating Theme Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeSelector />
        </div>

        {/* Success Message */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[456px] px-4"
        >
          <div className="glass-card p-8 rounded-3xl text-center">
            {/* Logo and Brand */}
            <div className="mb-6">
              <Link href="/" className="flex items-center justify-center gap-3 group">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-all">
                    <LogoComponent width={24} height={24} />
                  </div>
                </div>
                <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">NextPhoton</span>
              </Link>
            </div>

            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-green-500" />
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-semibold text-foreground mb-4">Check Your Email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent password reset instructions to <br />
              <strong className="text-foreground">{getValues("email")}</strong>
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/sign-in"
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl border-2 border-primary hover:bg-primary/90 hover:border-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
              
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  toast.info("You can try again with a different email.");
                }}
                className="w-full py-3 bg-muted/50 hover:bg-muted/70 border border-input rounded-xl transition-all font-medium text-foreground"
              >
                Try Different Email
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background relative">
      {/* Background gradient effect - subtle */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeSelector />
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[456px] px-4"
      >
        {/* Glass morphism card */}
        <div className="glass-card p-8 rounded-3xl">
          {/* Logo and Brand */}
          <div className="mb-6">
            <Link href="/" className="flex items-center justify-center gap-3 group">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <LogoComponent width={24} height={24} />
                </div>
              </div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">NextPhoton</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Forgot Password?</h2>
            <p className="text-muted-foreground">Enter your email address and we'll send you instructions to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  className="w-full pl-11 pr-4 py-3 glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  style={{
                    WebkitTextFillColor: 'var(--foreground) !important',
                    WebkitBoxShadow: '0 0 0 1000px var(--background) inset !important',
                    transition: 'background-color 5000s ease-in-out 0s',
                  }}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl border-2 border-primary hover:bg-primary/90 hover:border-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? "Sending Instructions..." : "Send Reset Instructions"}
            </button>
          </form>

          {/* Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link 
              href="/sign-in" 
              className="text-primary hover:text-primary/80 font-medium text-sm transition-all duration-200 hover:scale-105 hover:translate-x-1 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}