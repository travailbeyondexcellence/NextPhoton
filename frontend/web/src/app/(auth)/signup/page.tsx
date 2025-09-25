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

        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-lg mx-auto ">
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create your account to get started.</CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john doe" {...field} />
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
                                        <Input placeholder="john@mail.com" {...field} />
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
                                            <Input type={pwdVisible ? "text" : "password"} placeholder="Enter your password" {...field} />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setPwdVisible(!pwdVisible)}
                                                className="absolute right-1 top-1/2 -translate-y-1/2"
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
                            <Button className="w-full bg-gradient-to-b from-teal-500 to-blue-800  inline-block" type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>

            <CardFooter className='flex justify-center'>
                <p className='text-sm text-muted-foreground'>
                    Already have an account?{' '}
                    <Link href='/signin' className='text-primary hover:underline'>
                        Sign in
                    </Link>
                </p>
            </CardFooter>


            {/* <div className="absolute bottom-0 left-0 right-0 h-16 bg-red-400 flex items-center justify-center">
            </div> */}
            </Card>
            
        </div>

    )
}