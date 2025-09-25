import React from 'react';
import { cn } from '@/lib/utils';

interface GlassNavbarProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean;
  transparent?: boolean;
  bordered?: boolean;
  children: React.ReactNode;
}

/**
 * GlassNavbar Component
 * 
 * A glassmorphism navigation bar with enhanced blur effects.
 * Perfect for headers and navigation areas.
 */
export function GlassNavbar({
  sticky = true,
  transparent = false,
  bordered = true,
  className,
  children,
  ...props
}: GlassNavbarProps) {
  const baseClasses = cn(
    'w-full z-40',
    'backdrop-blur-xl',
    'transition-all duration-300',
    {
      'sticky top-0': sticky,
      'bg-background/5': transparent,
      'bg-background/10': !transparent,
      'border-b border-border/10': bordered,
      'shadow-sm': !transparent,
    },
    className
  );

  return (
    <nav className={baseClasses} {...props}>
      <div className="relative">
        {children}
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>
    </nav>
  );
}