import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'static';
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  opacity?: 'low' | 'medium' | 'high';
  gradient?: boolean;
  children: React.ReactNode;
}

/**
 * GlassCard Component
 * 
 * A glassmorphism card component with customizable blur, opacity, and gradient effects.
 * Adapts to the current theme automatically.
 */
export function GlassCard({
  variant = 'default',
  blur = 'md',
  opacity = 'medium',
  gradient = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  const blurClasses = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  const opacityClasses = {
    low: 'bg-card/5',
    medium: 'bg-card/10',
    high: 'bg-card/20'
  };

  const baseClasses = cn(
    'relative rounded-lg border border-border/20',
    'shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]',
    'transition-all duration-300',
    blurClasses[blur],
    opacityClasses[opacity],
    {
      'hover:transform hover:-translate-y-0.5 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.25)]': variant === 'hover',
      'bg-gradient-to-br from-card/10 to-background/5': gradient,
    },
    className
  );

  return (
    <div className={baseClasses} {...props}>
      {/* Glass tint overlay */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{ backgroundColor: 'var(--glass-tint, transparent)' }}
      />
      {gradient && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      )}
      <div className="relative z-10" style={{ color: 'var(--glass-text-color, inherit)' }}>
        {children}
      </div>
    </div>
  );
}