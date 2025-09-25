import themes from '@/../../themes.json';

export interface Theme {
  key: string;
  name: string;
  description: string;
  backgroundColor: string;
  primaryColor: string;
  glass: {
    backgroundGradient: string;
    cardOpacity: number;
    borderOpacity: number;
    blurIntensity: string;
    hoverOpacity: number;
  };
}

export type ThemeKey = 
  | 'celeste' 
  | 'emerald' 
  | 'emnight' 
  | 'midnight' 
  | 'storm'
  | 'arctic'
  | 'sunset'
  | 'coral'
  | 'rosegarden'
  | 'mono'
  | 'sepia'
  | 'hicon';

/**
 * Get all available themes sorted by order
 */
export function getAllThemes(): Theme[] {
  const themesData = (themes as any).themes || {};
  return Object.entries(themesData)
    .sort((a: any, b: any) => (a[1].order || 0) - (b[1].order || 0))
    .map(([key, theme]: [string, any]) => ({
      key,
      name: theme.name,
      description: theme.description,
      backgroundColor: theme.colors.background,
      primaryColor: theme.colors.primary,
      glass: theme.glass
    }));
}

/**
 * Get a specific theme by key
 */
export function getTheme(key: ThemeKey): any {
  return (themes as any).themes[key];
}

/**
 * Convert hex color to RGB values for CSS variables
 */
export function hexToRgb(hex: string): string {
  const hexValue = hex.replace('#', '');
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Apply theme colors to CSS variables
 */
export function applyTheme(themeKey: ThemeKey): void {
  const theme = getTheme(themeKey);
  if (!theme || !theme.colors) {
    console.error('Invalid theme:', themeKey);
    return;
  }

  const root = document.documentElement;
  
  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(cssVarName, hexToRgb(value as string));
  });
  
  // Apply glass-specific variables
  if (theme.glass) {
    root.style.setProperty('--glass-bg-opacity', theme.glass.cardOpacity.toString());
    root.style.setProperty('--glass-border-opacity', theme.glass.borderOpacity.toString());
    root.style.setProperty('--glass-hover-opacity', theme.glass.hoverOpacity.toString());
    
    // Set blur intensity
    const blurMap = {
      'none': '0px',
      'sm': '8px',
      'md': '12px',
      'lg': '16px',
      'xl': '24px'
    };
    root.style.setProperty('--glass-blur', blurMap[theme.glass.blurIntensity as keyof typeof blurMap] || '12px');
    
    // Apply gradient overlay
    if (theme.glass.gradientOverlay) {
      root.style.setProperty('--glass-gradient-from', theme.glass.gradientOverlay.from);
      root.style.setProperty('--glass-gradient-to', theme.glass.gradientOverlay.to);
    }
    
    // Apply background gradient class
    root.className = root.className.replace(/gradient-\w+/g, '');
    const gradientClass = `gradient-${themeKey.replace('emnight', 'emerald').replace('rosegarden', 'rose')}`;
    root.classList.add(gradientClass);
  }
  
  // Save to localStorage
  localStorage.setItem('app-theme', themeKey);
}

/**
 * Get the current theme from localStorage or default
 */
export function getCurrentTheme(): ThemeKey {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('app-theme') as ThemeKey;
    if (saved && getAllThemes().some(t => t.key === saved)) {
      return saved;
    }
  }
  return 'celeste'; // Default theme
}

/**
 * Initialize theme on page load
 */
export function initializeTheme(): void {
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);
}