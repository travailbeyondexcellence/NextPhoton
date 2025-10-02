/**
 * Theme Script Component
 * 
 * This script runs before the page is rendered to prevent flash of unstyled content (FOUC).
 * It loads the saved theme from localStorage and applies it immediately.
 */
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            // Get saved theme or default to 'celeste'
            const savedTheme = localStorage.getItem('app-theme') || 'celeste';
            // Get saved theme type or default to 'glass'
            const savedThemeType = localStorage.getItem('app-theme-type') || 'glass';
            
            // Set theme type as data attribute
            document.documentElement.setAttribute('data-theme-type', savedThemeType);
            // Set theme name as data attribute
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            // Map theme keys to gradient classes
            const themeToGradient = {
              'celeste': 'gradient-celeste',
              'emerald': 'gradient-emerald',
              'emnight': 'gradient-emerald',
              'midnight': 'gradient-midnight',
              'storm': 'gradient-storm',
              'arctic': 'gradient-arctic',
              'sunset': 'gradient-sunset',
              'coral': 'gradient-coral',
              'rosegarden': 'gradient-rose',
              'mono': 'gradient-mono',
              'sepia': 'gradient-sepia',
              'hicon': 'gradient-hicon'
            };
            
            // Apply gradient class only for glass themes
            if (savedThemeType === 'glass') {
              const gradientClass = themeToGradient[savedTheme] || 'gradient-celeste';
              document.documentElement.classList.add(gradientClass);
            }
            
            // Fetch and apply theme colors with the correct type
            fetch('/api/themes?type=' + savedThemeType)
              .then(res => res.json())
              .then(data => {
                const theme = data.themes?.themes?.[savedTheme];
                if (theme && theme.colors) {
                  const root = document.documentElement;
                  
                  // Apply color variables
                  Object.entries(theme.colors).forEach(([key, value]) => {
                    const hexValue = value.replace('#', '');
                    const r = parseInt(hexValue.substring(0, 2), 16);
                    const g = parseInt(hexValue.substring(2, 4), 16);
                    const b = parseInt(hexValue.substring(4, 6), 16);
                    const cssVarName = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    root.style.setProperty(cssVarName, r + ' ' + g + ' ' + b);
                  });
                  
                  // Apply glass variables only for glass themes
                  if (savedThemeType === 'glass' && theme.glass) {
                    root.style.setProperty('--glass-bg-opacity', theme.glass.cardOpacity);
                    root.style.setProperty('--glass-border-opacity', theme.glass.borderOpacity);
                    root.style.setProperty('--glass-hover-opacity', theme.glass.hoverOpacity);
                    
                    const blurMap = {
                      'none': '0px',
                      'sm': '8px',
                      'md': '12px',
                      'lg': '16px',
                      'xl': '24px'
                    };
                    root.style.setProperty('--glass-blur', blurMap[theme.glass.blurIntensity] || '12px');
                    
                    // Apply background gradient colors from themes.json
                    if (theme.glass.backgroundGradientFrom) {
                      const hexValue = theme.glass.backgroundGradientFrom.replace('#', '');
                      const r = parseInt(hexValue.substring(0, 2), 16);
                      const g = parseInt(hexValue.substring(2, 4), 16);
                      const b = parseInt(hexValue.substring(4, 6), 16);
                      root.style.setProperty('--gradient-from', r + ' ' + g + ' ' + b);
                    }
                    if (theme.glass.backgroundGradientVia) {
                      const hexValue = theme.glass.backgroundGradientVia.replace('#', '');
                      const r = parseInt(hexValue.substring(0, 2), 16);
                      const g = parseInt(hexValue.substring(2, 4), 16);
                      const b = parseInt(hexValue.substring(4, 6), 16);
                      root.style.setProperty('--gradient-via', r + ' ' + g + ' ' + b);
                    }
                    if (theme.glass.backgroundGradientTo) {
                      const hexValue = theme.glass.backgroundGradientTo.replace('#', '');
                      const r = parseInt(hexValue.substring(0, 2), 16);
                      const g = parseInt(hexValue.substring(2, 4), 16);
                      const b = parseInt(hexValue.substring(4, 6), 16);
                      root.style.setProperty('--gradient-to', r + ' ' + g + ' ' + b);
                    }
                  }
                  
                  // Apply sidebar colors and gradients only for glass themes
                  if (savedThemeType === 'glass' && theme.sidebar) {
                    if (theme.sidebar.gradientFrom) {
                      const hexValue = theme.sidebar.gradientFrom.replace('#', '');
                      const r = parseInt(hexValue.substring(0, 2), 16);
                      const g = parseInt(hexValue.substring(2, 4), 16);
                      const b = parseInt(hexValue.substring(4, 6), 16);
                      root.style.setProperty('--sidebar-gradient-from', r + ' ' + g + ' ' + b);
                      root.style.setProperty('--sidebar-background', r + ' ' + g + ' ' + b);
                      root.style.setProperty('--sidebar-accent', r + ' ' + g + ' ' + b);
                    }
                    if (theme.sidebar.gradientVia) {
                      const hexValue = theme.sidebar.gradientVia.replace('#', '');
                      const r = parseInt(hexValue.substring(0, 2), 16);
                      const g = parseInt(hexValue.substring(2, 4), 16);
                      const b = parseInt(hexValue.substring(4, 6), 16);
                      root.style.setProperty('--sidebar-gradient-via', r + ' ' + g + ' ' + b);
                    }
                    if (theme.sidebar.gradientTo) {
                      const hexValue = theme.sidebar.gradientTo.replace('#', '');
                      const r = parseInt(hexValue.substring(0, 2), 16);
                      const g = parseInt(hexValue.substring(2, 4), 16);
                      const b = parseInt(hexValue.substring(4, 6), 16);
                      root.style.setProperty('--sidebar-gradient-to', r + ' ' + g + ' ' + b);
                    }
                    if (theme.sidebar.opacity !== undefined) {
                      root.style.setProperty('--sidebar-gradient-opacity', theme.sidebar.opacity.toString());
                    }
                    if (theme.sidebar.textColor) {
                      // Convert hex to RGB for CSS variable usage
                      const textHexValue = theme.sidebar.textColor.replace('#', '');
                      const textR = parseInt(textHexValue.substring(0, 2), 16);
                      const textG = parseInt(textHexValue.substring(2, 4), 16);
                      const textB = parseInt(textHexValue.substring(4, 6), 16);
                      root.style.setProperty('--sidebar-text-color', textR + ' ' + textG + ' ' + textB);
                      
                      // Also set Tailwind sidebar CSS variables for consistency
                      root.style.setProperty('--sidebar-foreground', textR + ' ' + textG + ' ' + textB);
                      root.style.setProperty('--sidebar-primary', textR + ' ' + textG + ' ' + textB);
                      root.style.setProperty('--sidebar-accent-foreground', textR + ' ' + textG + ' ' + textB);
                    }
                  }
                  
                  // Apply dashboard header colors and gradients only for glass themes
                  if (savedThemeType === 'glass' && theme.dashboardHeader) {
                    if (theme.dashboardHeader.gradientFrom) {
                      const hexValue = theme.dashboardHeader.gradientFrom.replace('#', '');
                      const r = parseInt(hexValue.substring(0, 2), 16);
                      const g = parseInt(hexValue.substring(2, 4), 16);
                      const b = parseInt(hexValue.substring(4, 6), 16);
                      root.style.setProperty('--dashboard-header-gradient-from', r + ' ' + g + ' ' + b);
                    }
                    if (theme.dashboardHeader.gradientVia) {
                      const hexValue = theme.dashboardHeader.gradientVia.replace('#', '');
                      const r = parseInt(hexValue.substring(0, 2), 16);
                      const g = parseInt(hexValue.substring(2, 4), 16);
                      const b = parseInt(hexValue.substring(4, 6), 16);
                      root.style.setProperty('--dashboard-header-gradient-via', r + ' ' + g + ' ' + b);
                    }
                    if (theme.dashboardHeader.gradientTo) {
                      const hexValue = theme.dashboardHeader.gradientTo.replace('#', '');
                      const r = parseInt(hexValue.substring(0, 2), 16);
                      const g = parseInt(hexValue.substring(2, 4), 16);
                      const b = parseInt(hexValue.substring(4, 6), 16);
                      root.style.setProperty('--dashboard-header-gradient-to', r + ' ' + g + ' ' + b);
                    }
                    if (theme.dashboardHeader.opacity !== undefined) {
                      root.style.setProperty('--dashboard-header-gradient-opacity', theme.dashboardHeader.opacity.toString());
                    }
                    if (theme.dashboardHeader.textColor) {
                      root.style.setProperty('--dashboard-header-text-color', theme.dashboardHeader.textColor);
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
                }
              })
              .catch(() => {
                console.error('Failed to load theme data');
              });
          } catch (e) {
            console.error('Theme initialization error:', e);
          }
        `,
      }}
    />
  );
}