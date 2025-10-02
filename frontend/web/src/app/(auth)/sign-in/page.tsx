/**
 * Sign In Page
 * 
 * Login page using JWT authentication with NestJS backend
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthProviderWithLoading';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LogoComponent } from '@/components/LogoComponent';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { AsyncButton } from '@/components/LoadingButton';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setError('');

    try {
      await login({ email, password });
      // Redirect handled by AuthContext
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    }
  };

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
          <div className="mb-4">
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
            <h2 className="text-2xl font-semibold text-foreground">Welcome, Glad to see you!</h2>
          </div>

          <div className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 backdrop-blur-sm text-destructive px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  style={{
                    WebkitTextFillColor: 'var(--foreground) !important',
                    WebkitBoxShadow: '0 0 0 1000px var(--background) inset !important',
                    transition: 'background-color 5000s ease-in-out 0s',
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3 glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  style={{
                    WebkitTextFillColor: 'var(--foreground) !important',
                    WebkitBoxShadow: '0 0 0 1000px var(--background) inset !important',
                    transition: 'background-color 5000s ease-in-out 0s',
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>


            {/* Login Button */}
            <AsyncButton
              variant="primary"
              size="lg"
              className="w-full py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={handleLogin}
              loadingMessage="Signing in..."
            >
              Login
            </AsyncButton>

            {/* Or Login With */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-muted-foreground/60">Or Login with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-3 px-4 glass-button bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group text-sm font-medium hover:scale-[1.02] hover:shadow-md"
                onClick={() => {
                  toast.info("This feature is coming soon");
                }}
              >
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-foreground">Facebook</span>
              </button>
              <button
                type="button"
                className="flex-1 py-3 px-4 glass-button bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group text-sm font-medium hover:scale-[1.02] hover:shadow-md"
                onClick={() => {
                  toast.info("This feature is coming soon");
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-foreground">Google</span>
              </button>
            </div>
          </div>

          {/* Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex justify-between items-center text-sm">
            <Link
              href="/forgot-password"
              className="inline-block px-4 py-2 glass-button bg-card/20 hover:bg-card/30 border border-border/20 text-foreground rounded-xl transition-all duration-200 hover:scale-105"
            >
              Forgot Password?
            </Link>
            <div>
              <span className="text-muted-foreground">New here? </span>
              <Link 
                href="/sign-up" 
                className="inline-block px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}