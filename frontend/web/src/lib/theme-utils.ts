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
    // Apply glass opacity values
    root.style.setProperty('--glass-opacity', theme.glass.cardOpacity.toString());
    root.style.setProperty('--glass-border-opacity', theme.glass.borderOpacity.toString());
    root.style.setProperty('--glass-hover-opacity', theme.glass.hoverOpacity.toString());
    root.style.setProperty('--glass-active-opacity', theme.glass.activeOpacity?.toString() || '0.2');
    
    // Set blur intensity as a numeric value (will be multiplied by 1px in CSS)
    root.style.setProperty('--glass-blur', theme.glass.blurIntensity.toString());
    
    // Apply background gradient colors from themes.json
    if (theme.glass.backgroundGradientFrom) {
      root.style.setProperty('--gradient-from', hexToRgb(theme.glass.backgroundGradientFrom));
    }
    if (theme.glass.backgroundGradientVia) {
      root.style.setProperty('--gradient-via', hexToRgb(theme.glass.backgroundGradientVia));
    }
    if (theme.glass.backgroundGradientTo) {
      root.style.setProperty('--gradient-to', hexToRgb(theme.glass.backgroundGradientTo));
    }
    
    // Apply gradient overlay colors and opacities
    if (theme.glass.gradientOverlayFrom) {
      root.style.setProperty('--gradient-overlay-from', hexToRgb(theme.glass.gradientOverlayFrom));
      root.style.setProperty('--gradient-overlay-from-opacity', 
        theme.glass.gradientOverlayFromOpacity?.toString() || '0.1');
    }
    if (theme.glass.gradientOverlayTo) {
      root.style.setProperty('--gradient-overlay-to', hexToRgb(theme.glass.gradientOverlayTo));
      root.style.setProperty('--gradient-overlay-to-opacity', 
        theme.glass.gradientOverlayToOpacity?.toString() || '0.05');
    }
    
    // Apply sidebar gradient colors
    if (theme.glass.sidebarGradientFrom) {
      root.style.setProperty('--sidebar-gradient-from', hexToRgb(theme.glass.sidebarGradientFrom));
    }
    if (theme.glass.sidebarGradientVia) {
      root.style.setProperty('--sidebar-gradient-via', hexToRgb(theme.glass.sidebarGradientVia));
    }
    if (theme.glass.sidebarGradientTo) {
      root.style.setProperty('--sidebar-gradient-to', hexToRgb(theme.glass.sidebarGradientTo));
    }
    
    // Apply dashboard header gradient colors
    if (theme.glass.dashboardHeaderGradientFrom) {
      root.style.setProperty('--dashboard-header-gradient-from', hexToRgb(theme.glass.dashboardHeaderGradientFrom));
    }
    if (theme.glass.dashboardHeaderGradientVia) {
      root.style.setProperty('--dashboard-header-gradient-via', hexToRgb(theme.glass.dashboardHeaderGradientVia));
    }
    if (theme.glass.dashboardHeaderGradientTo) {
      root.style.setProperty('--dashboard-header-gradient-to', hexToRgb(theme.glass.dashboardHeaderGradientTo));
    }
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