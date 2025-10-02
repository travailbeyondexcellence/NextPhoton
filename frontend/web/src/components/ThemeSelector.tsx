'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { GlassCard } from '@/components/glass';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';
import { ThemeType } from '@/lib/theme-utils';

/**
 * ThemeSelector Component
 * 
 * A dropdown theme selector that replaces the dark mode toggle.
 * Displays all 12 themes with preview colors and descriptions.
 */
export function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentTheme, currentThemeType, changeTheme, changeThemeType, themes, isLoading } = useTheme();

  // Inject CSS to hide scrollbar for webkit browsers
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .theme-selector-no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .theme-selector-no-scrollbar {
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Map themes with their icons
  const getThemedIcons = () => {
    const iconMap: Record<string, string> = {
      'emerald': '🌿',
      'emnight': '🌲',
      'celeste': '🌌',
      'hicon': '⚡',
      'arctic': '🧊',
      'mono': '🔲',
      'sunset': '🌅',
      'sepia': '📜',
      'coral': '🌸',
      'midnight': '🌙',
      'rosegarden': '🌹',
      'storm': '⛈️'
    };

    return themes.map(theme => ({
      ...theme,
      icon: iconMap[theme.key] || '🎨'
    }));
  };

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
    <div className="relative z-[9999]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center p-2 rounded-lg",
          "glass-button",
          "transition-all duration-200"
        )}
        aria-label="Select theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-[420px] max-h-[70vh] overflow-y-auto theme-selector-no-scrollbar z-[9999]"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="glass-panel p-5 shadow-2xl relative overflow-hidden theme-selector-panel">
            {/* Theme selector background overlay for theme-based darkening */}
            <div className="theme-selector-overlay rounded-xl"></div>
            <div className="relative z-10">
              {/* Header with title and theme type switcher on same line */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Choose a Theme</h3>
                
                {/* Theme Type Tabs */}
                <div className="flex gap-2 p-1 rounded-lg bg-muted/30 border border-border/50">
                <button
                  onClick={() => changeThemeType('modern')}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 relative",
                    currentThemeType === 'modern'
                      ? "bg-primary text-primary-foreground shadow-lg border-2 border-primary/30 scale-105 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:scale-102"
                  )}
                >
                  {currentThemeType === 'modern' && (
                    <div className="absolute inset-0 bg-primary/20 rounded-md animate-pulse"></div>
                  )}
                  <span className="relative z-10">Modern</span>
                </button>
                <button
                  onClick={() => changeThemeType('glass')}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 relative",
                    currentThemeType === 'glass'
                      ? "bg-primary text-primary-foreground shadow-lg border-2 border-primary/30 scale-105 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:scale-102"
                  )}
                >
                  {currentThemeType === 'glass' && (
                    <div className="absolute inset-0 bg-primary/20 rounded-md animate-pulse"></div>
                  )}
                  <span className="relative z-10">Glass</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
              {/* Two column layout - themes alternate left/right based on order */}
              {getThemedIcons().map((theme, index) => (
                <button
                  key={theme.key}
                  onClick={() => {
                    changeTheme(theme.key as any);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "text-left p-3 rounded-lg relative overflow-hidden transition-all duration-200",
                    currentTheme === theme.key 
                      ? "border-2 border-primary bg-primary/10 shadow-lg scale-105 ring-2 ring-primary/20" 
                      : "border border-border hover:border-primary/50 hover:bg-accent/50 hover:scale-102"
                  )}
                >
                  {/* Theme icon/graphic */}
                  <div className="absolute -left-2 -top-2 text-6xl opacity-20">
                    {theme.icon}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{theme.icon}</span>
                        <div className={cn(
                          "font-medium text-sm",
                          currentTheme === theme.key ? "font-bold text-primary" : ""
                        )}>{theme.name}</div>
                      </div>
                      {currentTheme === theme.key && (
                        <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      "text-xs line-clamp-2",
                      currentTheme === theme.key ? "text-primary/80" : "text-muted-foreground"
                    )}>
                      {theme.description}
                    </div>
                  </div>
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}