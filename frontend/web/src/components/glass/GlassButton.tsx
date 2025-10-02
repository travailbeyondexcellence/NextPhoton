import React from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  glowOnHover?: boolean;
  children: React.ReactNode;
}

/**
 * GlassButton Component
 * 
 * A glassmorphism button with multiple variants and hover effects.
 * Includes optional glow effect on hover.
 */
export function GlassButton({
  variant = 'default',
  size = 'md',
  glowOnHover = false,
  className,
  children,
  disabled,
  ...props
}: GlassButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    default: cn(
      'bg-card/10 border-border/20 text-foreground',
      'hover:bg-card/15 hover:border-border/30'
    ),
    primary: cn(
      'bg-primary/10 border-primary/20 text-primary',
      'hover:bg-primary/15 hover:border-primary/30'
    ),
    secondary: cn(
      'bg-secondary/10 border-secondary/20 text-secondary',
      'hover:bg-secondary/15 hover:border-secondary/30'
    ),
    ghost: cn(
      'bg-transparent border-transparent text-foreground',
      'hover:bg-card/10 hover:border-border/20'
    ),
    destructive: cn(
      'bg-destructive/10 border-destructive/20 text-destructive',
      'hover:bg-destructive/15 hover:border-destructive/30'
    )
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center',
    'rounded-md border font-medium',
    'backdrop-blur-md',
    'transition-all duration-200',
    'transform active:scale-95',
    sizeClasses[size],
    variantClasses[variant],
    {
      'hover:shadow-lg': !disabled,
      'hover:shadow-primary/25': glowOnHover && variant === 'primary' && !disabled,
      'hover:shadow-secondary/25': glowOnHover && variant === 'secondary' && !disabled,
      'opacity-50 cursor-not-allowed': disabled,
    },
    className
  );

  return (
    <button
      className={baseClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}