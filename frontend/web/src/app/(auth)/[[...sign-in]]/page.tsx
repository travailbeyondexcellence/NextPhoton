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
// import { signInFormSchema } from "@/lib/auth-schema";
import { signInFormSchema } from "../../../lib/auth-schema"; // Adjust the import path as necessary
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

    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input type={pwdVisible ? "text" : "password"} placeholder="Enter your password" {...field}/> 
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
              <Button className="w-full mt-2 bg-gradient-to-b from-teal-500 to-blue-800  inline-block hover:from-teal-600 hover:to-blue-800 :hover:bg-gradient-to-t" type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className='flex justify-center'>
        <p className='text-sm text-muted-foreground'>
          Don&apos;t have an account yet?{' '}
          <Link href='/signup' className='text-primary hover:underline'>
            Sign up
          </Link>
        </p>
      </CardFooter>
      </Card>
    </div>

  )
}