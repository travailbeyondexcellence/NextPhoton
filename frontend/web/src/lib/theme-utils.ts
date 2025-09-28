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