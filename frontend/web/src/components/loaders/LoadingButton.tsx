/**
 * Loading Button Component
 *
 * A button component with built-in loading state support.
 * Shows a minimalistic loader when loading and disables interaction.
 */

'use client';

import React from 'react';
import { ButtonLoader } from '@/components/MinimalisticLoader';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Loading state
  isLoading?: boolean;

  // Loading text to show when loading
  loadingText?: string;

  // Button variant
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

  // Button size
  size?: 'sm' | 'md' | 'lg';

  // Icon to show before text
  icon?: React.ReactNode;

  // Whether to show loader icon or just disable
  showLoader?: boolean;
}

const variantClasses = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  outline: 'border border-border bg-transparent hover:bg-muted',
  ghost: 'hover:bg-muted',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * LoadingButton Component
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  variant = 'primary',
  size = 'md',
  icon,
  showLoader = true,
  disabled,
  className,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Variant styles
        variantClasses[variant],
        // Size styles
        sizeClasses[size],
        // Loading styles
        isLoading && 'cursor-wait',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {/* Loading state */}
      {isLoading ? (
        <>
          {showLoader && <ButtonLoader size={size === 'sm' ? 'sm' : 'md'} />}
          {loadingText || children}
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

/**
 * Async Button - wraps async operations with loading state
 */
interface AsyncButtonProps extends Omit<LoadingButtonProps, 'isLoading'> {
  // Async onClick handler
  onClick?: () => Promise<void> | void;

  // Loading message
  loadingMessage?: string;
}

export const AsyncButton: React.FC<AsyncButtonProps> = ({
  onClick,
  loadingMessage,
  children,
  ...props
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    if (!onClick || isLoading) return;

    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error('AsyncButton error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      {...props}
      isLoading={isLoading}
      loadingText={loadingMessage}
      onClick={handleClick}
    >
      {children}
    </LoadingButton>
  );
};