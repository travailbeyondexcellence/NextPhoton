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
            
            // Apply gradient class
            const gradientClass = themeToGradient[savedTheme] || 'gradient-celeste';
            document.documentElement.classList.add(gradientClass);
            
            // Fetch and apply theme colors
            fetch('/api/themes')
              .then(res => res.json())
              .then(data => {
                const theme = data.themes?.[savedTheme];
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
                  
                  // Apply glass variables
                  if (theme.glass) {
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
                  
                  // Apply sidebar colors and gradients
                  if (theme.sidebar) {
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
                      root.style.setProperty('--sidebar-text-color', theme.sidebar.textColor);
                      
                      // Also set Tailwind sidebar CSS variables for consistency
                      const textHexValue = theme.sidebar.textColor.replace('#', '');
                      const textR = parseInt(textHexValue.substring(0, 2), 16);
                      const textG = parseInt(textHexValue.substring(2, 4), 16);
                      const textB = parseInt(textHexValue.substring(4, 6), 16);
                      root.style.setProperty('--sidebar-foreground', textR + ' ' + textG + ' ' + textB);
                      root.style.setProperty('--sidebar-primary', textR + ' ' + textG + ' ' + textB);
                      root.style.setProperty('--sidebar-accent-foreground', textR + ' ' + textG + ' ' + textB);
                    }
                  }
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