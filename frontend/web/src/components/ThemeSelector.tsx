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
        <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto custom-scrollbar z-50">
          <GlassCard className="p-2" blur="xl">
            <div className="space-y-1">
              {/* Theme groups */}
              <ThemeGroup
                title="Light Themes"
                themes={themes.filter(t => ['celeste', 'emerald', 'arctic', 'sunset'].includes(t.key))}
                currentTheme={currentTheme}
                onSelect={(key) => {
                  changeTheme(key as any);
                  setIsOpen(false);
                }}
              />
              
              <div className="my-2 border-t border-border/20" />
              
              <ThemeGroup
                title="Dark Themes"
                themes={themes.filter(t => ['emnight', 'midnight', 'storm', 'mono'].includes(t.key))}
                currentTheme={currentTheme}
                onSelect={(key) => {
                  changeTheme(key as any);
                  setIsOpen(false);
                }}
              />
              
              <div className="my-2 border-t border-border/20" />
              
              <ThemeGroup
                title="Special Themes"
                themes={themes.filter(t => ['coral', 'rosegarden', 'sepia', 'hicon'].includes(t.key))}
                currentTheme={currentTheme}
                onSelect={(key) => {
                  changeTheme(key as any);
                  setIsOpen(false);
                }}
              />
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

interface ThemeGroupProps {
  title: string;
  themes: any[];
  currentTheme: string;
  onSelect: (key: string) => void;
}

function ThemeGroup({ title, themes, currentTheme, onSelect }: ThemeGroupProps) {
  return (
    <div>
      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">{title}</div>
      {themes.map((theme) => (
        <button
          key={theme.key}
          onClick={() => onSelect(theme.key)}
          className={cn(
            "w-full text-left px-3 py-2 rounded-md",
            "hover:bg-card/10 transition-colors",
            currentTheme === theme.key && "bg-primary/10 border border-primary/20"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{theme.name.split(' ')[0]}</span>
                <span className="font-medium text-sm">{theme.name.split(' ').slice(1).join(' ')}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{theme.description}</div>
            </div>
            <div className="flex gap-1 ml-2">
              <div 
                className="w-4 h-4 rounded-full border border-border/50"
                style={{ backgroundColor: theme.backgroundColor }}
              />
              <div 
                className="w-4 h-4 rounded-full border border-border/50"
                style={{ backgroundColor: theme.primaryColor }}
              />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}