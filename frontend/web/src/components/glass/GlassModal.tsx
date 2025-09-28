import React from 'react';
import { cn } from '@/lib/utils';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * GlassModal Component
 * 
 * A modal dialog with glassmorphism effects.
 * Features backdrop blur and smooth animations.
 */
export function GlassModal({
  isOpen,
  onClose,
  children,
  className,
  size = 'md'
}: GlassModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        'relative w-full',
        'bg-background/20 backdrop-blur-2xl',
        'border border-border/30',
        'rounded-xl shadow-2xl',
        'p-6',
        'animate-in fade-in zoom-in-95 duration-300',
        sizeClasses[size],
        className
      )}>
        {/* Glass tint overlay */}
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ backgroundColor: 'var(--glass-tint, transparent)' }}
        />
        {/* Glass overlay effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10" style={{ color: 'var(--glass-text-color, inherit)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}