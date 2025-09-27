/**
 * Sign In Page
 * 
 * Login page using JWT authentication with NestJS backend
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LogoComponent } from '@/components/LogoComponent';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      // Redirect handled by AuthContext
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeSelector />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md space-y-8 px-4">
        {/* Glass morphism card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-xl p-2">
                <LogoComponent width={48} height={48} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Welcome to NextPhoton</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 backdrop-blur-sm text-destructive px-4 py-3 rounded-lg text-sm border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/sign-up" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </div>

        {/* Test Credentials Info - Remove in Production */}
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
          <p className="text-sm font-semibold text-foreground mb-2">Test Credentials:</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Admin: admin@nextphoton.com / Admin@123456</p>
            <p>Educator: john.educator@nextphoton.com / Educator@123</p>
            <p>Learner: mike.learner@nextphoton.com / Learner@123</p>
            <p>Guardian: robert.guardian@nextphoton.com / Guardian@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}