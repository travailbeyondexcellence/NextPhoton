'use client'

import { Eye, EyeOff } from "lucide-react"

import { useState } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { formSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import { ThemeSelector } from '@/components/ThemeSelector';
import { LogoComponent } from '@/components/LogoComponent';

export default function SignUp() {

  const [pwdVisible, setPwdVisible] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            emailVerified: null,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { name, email, password } = values;
        
        // Show loading toast
        toast({
            title: "Please wait...",
            description: "Creating your account...",
        });

        // Call NestJS backend for registration
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
            role: 'learner', // Default role, can be made dynamic
        });

        if (error) {
            // Show error toast
            toast({ 
                title: "Registration Failed", 
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
                title: "Account Created!",
                description: "Redirecting to sign in...",
            });
            
            // Reset form
            form.reset();
            
            // Redirect to signin page after a short delay
            setTimeout(() => {
                window.location.href = '/signin';
            }, 1500);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            {/* Floating Theme Toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeSelector />
            </div>

            {/* Main Content */}
            <div className="w-full max-w-lg mx-auto px-4">
                {/* Glass morphism card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-xl p-2">
                                <LogoComponent width={48} height={48} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Sign Up</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Create your account to get started
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="John Doe" 
                                                {...field} 
                                                className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="john@mail.com" 
                                                {...field} 
                                                className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                                                    {...field} 
                                                    className="w-full px-4 py-3 pr-12 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setPwdVisible(!pwdVisible)}
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-white/10"
                                                >
                                                    {pwdVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    <span className="sr-only">{pwdVisible ? "Hide" : "Show"} password</span>
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all font-medium" type="submit">
                                Create Account
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href='/sign-in' className='text-primary hover:underline font-medium'>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}