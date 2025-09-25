'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { GlassCard } from '@/components/glass';
import { cn } from '@/lib/utils';

/**
 * ThemeSelector Component
 * 
 * A dropdown theme selector that replaces the dark mode toggle.
 * Displays all 12 themes with preview colors and descriptions.
 */
export function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentTheme, changeTheme, themes, isLoading } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (isLoading) {
    return (
      <div className="p-2 text-muted-foreground">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  const currentThemeData = themes.find(t => t.key === currentTheme);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-card/10 backdrop-blur-sm border border-border/20",
          "hover:bg-card/15 hover:border-border/30",
          "transition-all duration-200"
        )}
        aria-label="Select theme"
      >
        <span className="text-lg">{currentThemeData?.name.split(' ')[0]}</span>
        <span className="text-sm text-muted-foreground hidden sm:inline">Theme</span>
        <svg
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[70vh] overflow-y-auto custom-scrollbar scrollbar-thin z-50">
          <div className="bg-background/95 backdrop-blur-xl rounded-lg p-4 border border-border/30 shadow-2xl">
            <div className="grid grid-cols-2 gap-2">
              {/* Two column layout - themes alternate left/right based on order */}
              {themes.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => {
                    changeTheme(theme.key as any);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "text-left p-3 rounded-lg",
                    "bg-card/20 backdrop-blur-sm border border-border/30",
                    "hover:bg-card/30 hover:border-border/40",
                    "transition-all duration-200",
                    currentTheme === theme.key && "bg-primary/30 border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-5 h-5 rounded-full border border-border/50"
                      style={{ backgroundColor: theme.backgroundColor }}
                    />
                    <div 
                      className="w-5 h-5 rounded-full border border-border/50"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                  </div>
                  <div className="font-medium text-sm">{theme.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {theme.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}