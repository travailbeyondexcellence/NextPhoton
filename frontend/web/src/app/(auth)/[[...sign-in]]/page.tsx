'use client'

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react";
import { GlassCard, GlassButton } from "@/components/glass";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signInFormSchema } from "../../../lib/auth-schema";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  const [pwdVisible, setPwdVisible] = useState(false);

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    const { email, password } = values;

    // Show loading toast
    toast({
      title: "Please wait...",
      description: "Signing you in...",
    });

    // Call NestJS backend for login
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      // Show error toast
      toast({
        title: "Login Failed",
        description: error.message,
        variant: 'destructive'
      });
      
      // Set form error
      form.setError('email', {
        type: 'manual',
        message: error.message
      });
    } else if (data) {
      // Success - show success toast
      toast({
        title: "Welcome back!",
        description: "Redirecting to dashboard...",
      });
      
      // Reset form
      form.reset();
      
      // Redirect based on user role
      setTimeout(() => {
        // You can customize redirect based on user roles
        const userRoles = data.user.roles;
        if (userRoles.includes('admin')) {
          window.location.href = '/admin';
        } else if (userRoles.includes('educator')) {
          window.location.href = '/educator';
        } else if (userRoles.includes('learner')) {
          window.location.href = '/learner';
        } else {
          window.location.href = '/dashboard';
        }
      }, 1500);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Glass background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 blur-3xl" />
      
      <GlassCard className="w-full max-w-md mx-auto p-8 relative z-10" variant="hover" blur="lg" gradient>
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Sign In
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="john@mail.com" 
                        className="glass-input" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="flex items-center relative">
                        <Input 
                          type={pwdVisible ? "text" : "password"} 
                          placeholder="Enter your password" 
                          className="glass-input pr-10"
                          {...field}
                        /> 
                        <button
                          type="button"
                          onClick={() => setPwdVisible(!pwdVisible)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-card/10 transition-colors"
                        >
                          {pwdVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span className="sr-only">{pwdVisible ? "Hide" : "Show"} password</span>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:text-primary-hover transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              
              {/* Submit Button */}
              <GlassButton 
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                glowOnHover
              >
                Sign In
              </GlassButton>
            </form>
          </Form>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-border/20">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account yet?{' '}
              <Link 
                href='/signup' 
                className='text-primary hover:text-primary-hover font-medium transition-colors'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}