import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'inset';
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  gradient?: 'subtle' | 'moderate' | 'strong';
  children: React.ReactNode;
}

/**
 * GlassPanel Component
 * 
 * A larger glassmorphism panel for sections and content areas.
 * Features enhanced blur and gradient effects.
 */
export function GlassPanel({
  variant = 'default',
  blur = 'lg',
  gradient = 'subtle',
  className,
  children,
  ...props
}: GlassPanelProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl'
  };

  const gradientClasses = {
    subtle: 'bg-gradient-to-br from-card/5 via-card/10 to-background/5',
    moderate: 'bg-gradient-to-br from-card/10 via-card/15 to-background/10',
    strong: 'bg-gradient-to-br from-card/15 via-card/20 to-background/15'
  };

  const variantClasses = {
    default: 'border border-border/20',
    elevated: 'border border-border/30 shadow-2xl',
    inset: 'border border-border/10 shadow-inner'
  };

  const baseClasses = cn(
    'rounded-xl p-6',
    'transition-all duration-300',
    blurClasses[blur],
    gradientClasses[gradient],
    variantClasses[variant],
    className
  );

  return (
    <div className={baseClasses} {...props}>
      <div className="relative z-10">
        {children}
      </div>
      {/* Decorative glass overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />
    </div>
  );
}