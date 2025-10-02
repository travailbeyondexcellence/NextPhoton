'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThemeKey, ThemeType, applyTheme, getCurrentTheme, getCurrentThemeType, getAllThemes, setThemeType as setThemeTypeUtil } from '@/lib/theme-utils';

/**
 * useTheme Hook
 * 
 * Manages theme state and provides methods to change themes and theme types.
 * Handles localStorage persistence and smooth transitions.
 */
export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('celeste');
  const [currentThemeType, setCurrentThemeType] = useState<ThemeType>('glass');
  const [isLoading, setIsLoading] = useState(true);
  const [themes, setThemes] = useState(getAllThemes(currentThemeType));

  // Change theme with transition
  const changeTheme = useCallback((newTheme: ThemeKey) => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    
    applyTheme(newTheme, currentThemeType);
    setCurrentTheme(newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 200);
  }, [currentThemeType]);
  
  // Change theme type and reload themes
  const changeThemeType = useCallback((newType: ThemeType) => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    
    // Update theme type in state and localStorage
    setCurrentThemeType(newType);
    setThemeTypeUtil(newType);
    
    // Load themes for the new type
    setThemes(getAllThemes(newType));
    
    // Reapply current theme with new type
    applyTheme(currentTheme, newType);
    
    // Remove transition class after animation
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 200);
  }, [currentTheme]);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = getCurrentTheme();
    const savedThemeType = getCurrentThemeType();
    
    setCurrentTheme(savedTheme);
    setCurrentThemeType(savedThemeType);
    setThemes(getAllThemes(savedThemeType));
    
    applyTheme(savedTheme, savedThemeType);
    setIsLoading(false);
  }, []);

  return {
    currentTheme,
    currentThemeType,
    changeTheme,
    changeThemeType,
    themes,
    isLoading
  };
}