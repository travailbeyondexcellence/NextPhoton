'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThemeKey, applyTheme, getCurrentTheme, getAllThemes } from '@/lib/theme-utils';

/**
 * useTheme Hook
 * 
 * Manages theme state and provides methods to change themes.
 * Handles localStorage persistence and smooth transitions.
 */
export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('celeste');
  const [isLoading, setIsLoading] = useState(true);
  const [themes] = useState(getAllThemes());

  // Change theme with transition
  const changeTheme = useCallback((newTheme: ThemeKey) => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    
    applyTheme(newTheme);
    setCurrentTheme(newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 200);
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = getCurrentTheme();
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
    setIsLoading(false);
  }, []);

  return {
    currentTheme,
    changeTheme,
    themes,
    isLoading
  };
}