import glassThemes from '@/../../glass-themes.json';
import modernThemes from '@/../../modern-themes.json';

export type ThemeType = 'modern' | 'glass';

export interface BaseTheme {
  key: string;
  name: string;
  description: string;
  backgroundColor: string;
  primaryColor: string;
}

export interface GlassTheme extends BaseTheme {
  glass: {
    backgroundGradient?: string;
    backgroundGradientFrom?: string;
    backgroundGradientVia?: string;
    backgroundGradientTo?: string;
    backgroundGradientOpacity?: number;
    cardOpacity: number;
    borderOpacity: number;
    blurIntensity: number | string;
    hoverOpacity: number;
    activeOpacity?: number;
    gradientOverlayFrom?: string;
    gradientOverlayFromOpacity?: number;
    gradientOverlayTo?: string;
    gradientOverlayToOpacity?: number;
    glassTint?: string;
    glassTextColor?: string;
    mainSectionBackgroundOverlay?: number;
  };
}

export interface ModernTheme extends BaseTheme {
  // Modern themes don't have glass properties
}

export type Theme = GlassTheme | ModernTheme;

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
 * Get the current theme type from localStorage or default to glass
 */
export function getCurrentThemeType(): ThemeType {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('app-theme-type') as ThemeType) || 'glass';
  }
  return 'glass';
}

/**
 * Set the theme type in localStorage
 */
export function setThemeType(type: ThemeType): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('app-theme-type', type);
  }
}

/**
 * Get themes data based on theme type
 */
function getThemesData(type: ThemeType = 'glass'): any {
  return type === 'modern' ? modernThemes : glassThemes;
}

/**
 * Get all available themes sorted by order
 */
export function getAllThemes(type: ThemeType = 'glass'): Theme[] {
  const themesData = getThemesData(type);
  const themes = themesData.themes || {};
  
  return Object.entries(themes)
    .sort((a: any, b: any) => (a[1].order || 0) - (b[1].order || 0))
    .map(([key, theme]: [string, any]) => {
      const baseTheme = {
        key,
        name: theme.name,
        description: theme.description,
        backgroundColor: theme.colors.background,
        primaryColor: theme.colors.primary,
      };
      
      // Add glass properties only for glass themes
      if (type === 'glass' && theme.glass) {
        return {
          ...baseTheme,
          glass: theme.glass
        } as GlassTheme;
      }
      
      return baseTheme as ModernTheme;
    });
}

/**
 * Get a specific theme by key
 */
export function getTheme(key: ThemeKey, type: ThemeType = 'glass'): any {
  const themesData = getThemesData(type);
  return themesData.themes[key];
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
export function applyTheme(themeKey: ThemeKey, type?: ThemeType): void {
  // Get the theme type (use current type if not provided)
  const themeType = type || getCurrentThemeType();
  const theme = getTheme(themeKey, themeType);
  
  if (!theme || !theme.colors) {
    console.error('Invalid theme:', themeKey);
    return;
  }

  const root = document.documentElement;
  
  // Set theme type as data attribute for conditional CSS
  root.setAttribute('data-theme-type', themeType);
  
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
    
    // Apply sidebar colors and gradients
    if (theme.sidebar) {
      if (theme.sidebar.gradientFrom) {
        root.style.setProperty('--sidebar-gradient-from', hexToRgb(theme.sidebar.gradientFrom));
      }
      if (theme.sidebar.gradientVia) {
        root.style.setProperty('--sidebar-gradient-via', hexToRgb(theme.sidebar.gradientVia));
      }
      if (theme.sidebar.gradientTo) {
        root.style.setProperty('--sidebar-gradient-to', hexToRgb(theme.sidebar.gradientTo));
      }
      if (theme.sidebar.opacity !== undefined) {
        root.style.setProperty('--sidebar-gradient-opacity', theme.sidebar.opacity.toString());
      }
      if (theme.sidebar.textColor) {
        root.style.setProperty('--sidebar-text-color', theme.sidebar.textColor);
        
        // Also set Tailwind sidebar CSS variables for consistency
        root.style.setProperty('--sidebar-foreground', hexToRgb(theme.sidebar.textColor));
        root.style.setProperty('--sidebar-primary', hexToRgb(theme.sidebar.textColor));
        root.style.setProperty('--sidebar-accent-foreground', hexToRgb(theme.sidebar.textColor));
      }
      
      // Set sidebar background from gradient colors for Tailwind variables
      if (theme.sidebar.gradientFrom) {
        root.style.setProperty('--sidebar-background', hexToRgb(theme.sidebar.gradientFrom));
        root.style.setProperty('--sidebar-accent', hexToRgb(theme.sidebar.gradientFrom));
        root.style.setProperty('--sidebar-border', hexToRgb(theme.sidebar.gradientFrom));
        root.style.setProperty('--sidebar-ring', hexToRgb(theme.sidebar.gradientFrom));
      }
    }
    
    // Apply dashboard header colors and gradients
    if (theme.dashboardHeader) {
      if (theme.dashboardHeader.gradientFrom) {
        root.style.setProperty('--dashboard-header-gradient-from', hexToRgb(theme.dashboardHeader.gradientFrom));
      }
      if (theme.dashboardHeader.gradientVia) {
        root.style.setProperty('--dashboard-header-gradient-via', hexToRgb(theme.dashboardHeader.gradientVia));
      }
      if (theme.dashboardHeader.gradientTo) {
        root.style.setProperty('--dashboard-header-gradient-to', hexToRgb(theme.dashboardHeader.gradientTo));
      }
      if (theme.dashboardHeader.opacity !== undefined) {
        root.style.setProperty('--dashboard-header-gradient-opacity', theme.dashboardHeader.opacity.toString());
      }
      if (theme.dashboardHeader.textColor) {
        root.style.setProperty('--dashboard-header-text-color', theme.dashboardHeader.textColor);
      }
    }
    
    // Apply background gradient opacity
    if (theme.glass.backgroundGradientOpacity !== undefined) {
      root.style.setProperty('--background-gradient-opacity', theme.glass.backgroundGradientOpacity.toString());
    }
    
    // Apply glass tint and text color for adaptive glass morphism
    if (theme.glass.glassTint) {
      root.style.setProperty('--glass-tint', theme.glass.glassTint);
    }
    if (theme.glass.glassTextColor) {
      root.style.setProperty('--glass-text-color', theme.glass.glassTextColor);
    }
    
    // Apply main section background overlay
    if (theme.glass.mainSectionBackgroundOverlay !== undefined) {
      root.style.setProperty('--main-section-background-overlay', theme.glass.mainSectionBackgroundOverlay.toString());
    }
    
    // Apply theme selector properties
    if (theme.themeSelector) {
      if (theme.themeSelector.backgroundOverlayGradientFrom) {
        root.style.setProperty('--theme-selector-overlay-gradient-from', hexToRgb(theme.themeSelector.backgroundOverlayGradientFrom));
      }
      if (theme.themeSelector.backgroundOverlayGradientVia) {
        root.style.setProperty('--theme-selector-overlay-gradient-via', hexToRgb(theme.themeSelector.backgroundOverlayGradientVia));
      }
      if (theme.themeSelector.backgroundOverlayGradientTo) {
        root.style.setProperty('--theme-selector-overlay-gradient-to', hexToRgb(theme.themeSelector.backgroundOverlayGradientTo));
      }
      if (theme.themeSelector.backgroundOverlay !== undefined) {
        root.style.setProperty('--theme-selector-background-overlay', theme.themeSelector.backgroundOverlay.toString());
      }
    }
  }
  
  // COMMENTED OUT: Theme-aware logo colors - always use original earth colors
  // Apply logo colors for theme-aware logo display (only for specific themes)
  // if (theme.logo && theme.logo.logoOnSidebarHeader) {
  //   const logoColors = theme.logo.logoOnSidebarHeader;
  //   
  //   // Apply gradient colors for earth
  //   if (logoColors.gradientStart) {
  //     root.style.setProperty('--logo-gradient-start', logoColors.gradientStart);
  //   }
  //   if (logoColors.gradientMid1) {
  //     root.style.setProperty('--logo-gradient-mid1', logoColors.gradientMid1);
  //   }
  //   if (logoColors.gradientMid2) {
  //     root.style.setProperty('--logo-gradient-mid2', logoColors.gradientMid2);
  //   }
  //   if (logoColors.gradientMid3) {
  //     root.style.setProperty('--logo-gradient-mid3', logoColors.gradientMid3);
  //   }
  //   if (logoColors.gradientMid4) {
  //     root.style.setProperty('--logo-gradient-mid4', logoColors.gradientMid4);
  //   }
  //   if (logoColors.gradientMid5) {
  //     root.style.setProperty('--logo-gradient-mid5', logoColors.gradientMid5);
  //   }
  //   if (logoColors.gradientBlue) {
  //     root.style.setProperty('--logo-gradient-blue', logoColors.gradientBlue);
  //   }
  //   if (logoColors.gradientTeal1) {
  //     root.style.setProperty('--logo-gradient-teal1', logoColors.gradientTeal1);
  //   }
  //   if (logoColors.gradientTeal2) {
  //     root.style.setProperty('--logo-gradient-teal2', logoColors.gradientTeal2);
  //   }
  //   if (logoColors.gradientEnd) {
  //     root.style.setProperty('--logo-gradient-end', logoColors.gradientEnd);
  //   }
  //   
  //   // Apply ring colors
  //   if (logoColors.ringColor1) {
  //     root.style.setProperty('--logo-ring-color-1', logoColors.ringColor1);
  //   }
  //   if (logoColors.ringColor2) {
  //     root.style.setProperty('--logo-ring-color-2', logoColors.ringColor2);
  //   }
  //   if (logoColors.ringColor3) {
  //     root.style.setProperty('--logo-ring-color-3', logoColors.ringColor3);
  //   }
  //   if (logoColors.ringColor4) {
  //     root.style.setProperty('--logo-ring-color-4', logoColors.ringColor4);
  //   }
  //   
  //   // Apply detail colors
  //   if (logoColors.detailColor) {
  //     root.style.setProperty('--logo-detail-color', logoColors.detailColor);
  //   }
  //   if (logoColors.detailColor2) {
  //     root.style.setProperty('--logo-detail-color-2', logoColors.detailColor2);
  //   }
  //   if (logoColors.detailColor3) {
  //     root.style.setProperty('--logo-detail-color-3', logoColors.detailColor3);
  //   }
  //   
  //   // Apply text color
  //   if (logoColors.textColor) {
  //     root.style.setProperty('--logo-text-color', logoColors.textColor);
  //   }
  // }
  
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