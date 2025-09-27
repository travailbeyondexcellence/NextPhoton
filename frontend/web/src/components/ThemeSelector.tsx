'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { GlassCard } from '@/components/glass';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';

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
          "bg-white/5 backdrop-blur-sm border border-white/10",
          "hover:bg-white/10 hover:border-white/15",
          "transition-all duration-200"
        )}
        aria-label="Select theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[420px] max-h-[70vh] overflow-y-auto custom-scrollbar scrollbar-thin z-[9999]">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5 border border-white/20 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Choose Theme</h3>
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
                    "text-left p-3 rounded-lg relative overflow-hidden",
                    "bg-white/5 backdrop-blur-sm border",
                    currentTheme === theme.key 
                      ? "border-white/30 bg-white/15" 
                      : "border-white/10 hover:border-white/20 hover:bg-white/10",
                    "transition-all duration-200"
                  )}
                >
                  {/* Theme icon/graphic */}
                  <div className="absolute -left-2 -top-2 text-6xl opacity-20">
                    {theme.icon}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{theme.icon}</span>
                      <div className="font-medium text-sm">{theme.name}</div>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {theme.description}
                    </div>
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