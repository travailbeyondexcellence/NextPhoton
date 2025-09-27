"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { LogoComponent } from "@/components/LogoComponent";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff,
  GraduationCap,
  Users,
  BookOpen,
  Briefcase,
  UserCog,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

// Form validation schema
const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  role: z.enum(["learner", "guardian", "educator", "ecm", "employee", "intern"], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

// Role configurations with icons and descriptions
const roles = [
  { 
    value: "learner", 
    label: "Learner", 
    icon: GraduationCap,
    description: "Student seeking education",
    color: "text-teal-500"
  },
  { 
    value: "guardian", 
    label: "Guardian", 
    icon: Users,
    description: "Parent or guardian",
    color: "text-blue-500"
  },
  { 
    value: "educator", 
    label: "Educator", 
    icon: BookOpen,
    description: "Teacher or instructor",
    color: "text-purple-500"
  },
  { 
    value: "ecm", 
    label: "EduCare Manager", 
    icon: UserCog,
    description: "Education care manager",
    color: "text-orange-500"
  },
  { 
    value: "employee", 
    label: "Employee", 
    icon: Briefcase,
    description: "Staff member",
    color: "text-green-500"
  },
  { 
    value: "intern", 
    label: "Intern", 
    icon: Shield,
    description: "Intern or trainee",
    color: "text-pink-500"
  },
];

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = data;
      const result = await authClient.signUp.email(registerData);
      
      if (result.error) {
        toast.error(result.error.message || "Failed to create account");
        return;
      }

      toast.success("Account created successfully!");
      
      // Redirect based on role
      const roleRedirects: Record<string, string> = {
        learner: "/dashboard/learner",
        guardian: "/dashboard/guardian",
        educator: "/dashboard/educator",
        ecm: "/dashboard/ecm",
        employee: "/dashboard/employee",
        intern: "/dashboard/intern",
        admin: "/dashboard/admin",
      };
      
      router.push(roleRedirects[data.role] || "/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Sign up form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo and heading */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 justify-center mb-8 group">
              <div className="transition-transform duration-300 group-hover:rotate-3">
                <LogoComponent width={64} height={64} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                NextPhoton
              </h1>
            </Link>
            <h2 className="text-2xl font-semibold text-foreground">Create your account</h2>
            <p className="text-muted-foreground mt-2">
              Join the education revolution
            </p>
          </div>

          {/* Sign up form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white/5 border-white/10 focus:border-primary"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white/5 border-white/10 focus:border-primary"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Role selection */}
            <div className="space-y-2">
              <Label className="text-foreground">Select Your Role</Label>
              <RadioGroup
                onValueChange={(value) => setValue("role", value as any)}
                className="grid grid-cols-2 gap-3"
              >
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <div key={role.value}>
                      <RadioGroupItem
                        value={role.value}
                        id={role.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={role.value}
                        className={`
                          flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer
                          bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20
                          peer-checked:bg-white/15 peer-checked:border-primary
                          transition-all duration-200 hover:scale-[1.02]
                        `}
                      >
                        <Icon className={`h-6 w-6 mb-2 ${role.color}`} />
                        <span className="font-medium text-foreground">{role.label}</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">
                          {role.description}
                        </span>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Feature showcase */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-500/20 via-blue-600/20 to-purple-600/20 backdrop-blur-xl p-12 items-center justify-center">
        <div className="max-w-lg space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Join NextPhoton Today
            </h3>
            <p className="text-white/80 text-lg">
              Experience the future of education management with our comprehensive platform designed for learners, educators, and guardians.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {[
              { icon: BookOpen, title: "Comprehensive Learning", description: "Access a wide range of educational resources and tools" },
              { icon: Users, title: "Community Driven", description: "Connect with educators, learners, and guardians" },
              { icon: Shield, title: "Secure & Reliable", description: "Your data is protected with enterprise-grade security" },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{feature.title}</h4>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}