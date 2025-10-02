# Theme Configuration (modern-themes.json & glass-themes.json)

## Overview

The NextPhoton theming system uses two separate JSON files to configure themes:
- `modern-themes.json` - Flat design themes with solid colors
- `glass-themes.json` - Glass morphism themes with transparency effects

Both files share a common structure but glass themes include additional properties for visual effects.

## File Structure

### Modern Themes (modern-themes.json)
```json
{
  "colorDefinitions": {
    "_comment": "Documentation of required color properties",
    "required": [
      // List of required color properties
    ]
  },
  "themes": {
    "themeKey": {
      "name": "🎨 Display Name",
      "description": "Brief description",
      "order": 1,
      "colors": {
        // Color definitions
      },
      "progressGradient": {
        "from": "#hexcolor",
        "to": "#hexcolor"
      },
      "recentEditColor": "#hexcolor",
      "recentEditOpacity": 0.3
    }
  }
}
```

### Glass Themes (glass-themes.json)
```json
{
  "themes": {
    "themeKey": {
      "name": "Display Name",
      "description": "Brief description",
      "order": 1,
      "colors": {
        // Same as modern themes
      },
      "glass": {
        // Glass morphism properties
        "backgroundGradientFrom": "#hexcolor",
        "backgroundGradientVia": "#hexcolor",
        "backgroundGradientTo": "#hexcolor",
        "backgroundGradientOpacity": 0.75,
        "cardOpacity": 0.1,
        "borderOpacity": 0.2,
        "blurIntensity": 12,
        "hoverOpacity": 0.15,
        "activeOpacity": 0.2,
        "gradientOverlayFrom": "#hexcolor",
        "gradientOverlayTo": "#hexcolor",
        "glassTint": "rgba(r, g, b, a)",
        "glassTextColor": "#hexcolor",
        "mainSectionBackgroundOverlay": 0.0
      },
      "sidebar": {
        "gradientFrom": "#hexcolor",
        "gradientVia": "#hexcolor",
        "gradientTo": "#hexcolor",
        "opacity": 1.0,
        "textColor": "#hexcolor"
      },
      "dashboardHeader": {
        "gradientFrom": "#hexcolor",
        "gradientVia": "#hexcolor",
        "gradientTo": "#hexcolor",
        "opacity": 0.75,
        "textColor": "#hexcolor"
      },
      "themeSelector": {
        "backgroundOverlay": 0.0,
        "overlayGradientFrom": "r g b",
        "overlayGradientVia": "r g b",
        "overlayGradientTo": "r g b"
      },
      "logo": {
        "iconColor": "#hexcolor",
        "textColor": "#hexcolor"
      },
      "progressGradient": { /* same as modern */ },
      "recentEditColor": "#hexcolor",
      "recentEditOpacity": 0.3
    }
  }
}
```

## Common Properties (Both Systems)

### Theme Metadata
- `name`: Display name with optional emoji prefix
- `description`: Short description (shown in selector)
- `order`: Display order in theme selector (lower numbers first)

### Color Properties
All colors must be in hex format (#RRGGBB). They will be converted to RGB values for CSS variables.

#### Essential Colors
- `background`: Main background color
- `foreground`: Main text color
- `card`: Card/panel background
- `cardForeground`: Card text color

#### Action Colors
- `primary`: Primary action color (buttons, links)
- `primaryForeground`: Text on primary background
- `secondary`: Secondary action color
- `secondaryForeground`: Text on secondary background
- `accent`: Accent/highlight color
- `accentForeground`: Text on accent background

#### UI Colors
- `muted`: Muted/disabled background
- `mutedForeground`: Muted/disabled text
- `border`: Border color
- `selection`: Text selection background

#### Interactive Colors
- `link`: Link color
- `linkHover`: Link hover state

#### Status Colors
- `destructive`: Error/delete actions
- `destructiveForeground`: Text on destructive background
- `success`: Success states
- `successForeground`: Text on success background
- `warning`: Warning states
- `warningForeground`: Text on warning background

### Optional Properties
- `progressGradient`: Gradient colors for progress indicators
  - `from`: Start color
  - `to`: End color
- `recentEditColor`: Highlight color for recently edited content
- `recentEditOpacity`: Opacity value (0-1) for recent edit highlights

## Glass Theme Exclusive Properties

### Glass Object
Controls the glass morphism effects:
- `backgroundGradientFrom/Via/To`: Main background gradient colors
- `backgroundGradientOpacity`: Opacity of the background gradient (0-1)
- `cardOpacity`: Transparency of card backgrounds (0-1)
- `borderOpacity`: Transparency of borders (0-1)
- `blurIntensity`: Backdrop blur strength in pixels
- `hoverOpacity`: Opacity on hover state (0-1)
- `activeOpacity`: Opacity on active state (0-1)
- `gradientOverlayFrom/To`: Additional gradient overlay colors
- `gradientOverlayFromOpacity/ToOpacity`: Overlay gradient opacities
- `glassTint`: RGBA color for glass tinting effect
- `glassTextColor`: Text color for glass surfaces
- `mainSectionBackgroundOverlay`: Darkness overlay for main content (0-1)

### Sidebar Configuration
- `gradientFrom/Via/To`: Sidebar gradient colors
- `opacity`: Overall sidebar opacity (0-1)
- `textColor`: Sidebar text color (typically white for glass themes)

### Dashboard Header Configuration
- `gradientFrom/Via/To`: Header gradient colors
- `opacity`: Header opacity (0-1)
- `textColor`: Header text color

### Theme Selector Configuration
- `backgroundOverlay`: Overlay darkness (0-1)
- `overlayGradientFrom/Via/To`: Theme selector gradient (RGB format)

### Logo Configuration
- `iconColor`: Logo icon color
- `textColor`: Logo text color

## Example Definitions

### Modern Theme Example (Celeste)
```json
{
  "celeste": {
    "name": "🌌 Celeste",
    "description": "Calming blue, great for focus",
    "order": 3,
    "colors": {
      "background": "#f0f8ff",
      "foreground": "#02479F",
      "card": "#e6f2ff",
      "cardForeground": "#1e293b",
      "primary": "#0052FF",
      "primaryForeground": "#ffffff",
      "secondary": "#0ea5e9",
      "secondaryForeground": "#ffffff",
      "accent": "#38bdf8",
      "accentForeground": "#0c4a6e",
      "muted": "#cce6ff",
      "mutedForeground": "#64748b",
      "border": "#b3d9ff",
      "selection": "#bae6fd",
      "link": "#2563eb",
      "linkHover": "#1d4ed8",
      "destructive": "#ef4444",
      "destructiveForeground": "#ffffff",
      "success": "#22c55e",
      "successForeground": "#ffffff",
      "warning": "#f59e0b",
      "warningForeground": "#ffffff"
    },
    "progressGradient": {
      "from": "#0ea5e9",
      "to": "#0052FF"
    },
    "recentEditColor": "#fed4e7",
    "recentEditOpacity": 0.3
  }
}
```

### Glass Theme Example (Storm)
```json
{
  "storm": {
    "name": "Storm",
    "description": "Dark slate with electric glass",
    "order": 12,
    "colors": {
      "background": "#0f172a",
      "foreground": "#e2e8f0",
      // ... other colors
    },
    "glass": {
      "backgroundGradientFrom": "#01CDFF",
      "backgroundGradientVia": "#0970FF",
      "backgroundGradientTo": "#010CFF",
      "backgroundGradientOpacity": 0.84,
      "cardOpacity": 0.12,
      "borderOpacity": 0.25,
      "blurIntensity": 16,
      "hoverOpacity": 0.18,
      "activeOpacity": 0.22,
      "glassTint": "rgba(59, 130, 246, 0.08)",
      "glassTextColor": "#cbd5e1",
      "mainSectionBackgroundOverlay": 0.36
    },
    "sidebar": {
      "gradientFrom": "#090192",
      "gradientVia": "#010227",
      "gradientTo": "#010227",
      "opacity": 0.9,
      "textColor": "#cbd5e1"
    },
    "dashboardHeader": {
      "gradientFrom": "#010227",
      "gradientVia": "#010227",
      "gradientTo": "#090192",
      "opacity": 0.9,
      "textColor": "#cbd5e1"
    }
  }
}
```

## How Components Use Themes

### Modern Themes
Components use standard CSS variables:
```css
.component {
  background: rgb(var(--card));
  color: rgb(var(--card-foreground));
  border: 1px solid rgb(var(--border));
}

.hover-state:hover {
  background: rgb(var(--accent));
  color: rgb(var(--accent-foreground));
}
```

### Glass Themes
Components apply additional glass effects:
```css
[data-theme-type="glass"] .component {
  background: rgb(var(--card) / var(--glass-opacity));
  backdrop-filter: blur(calc(var(--glass-blur) * 1px));
  border: 1px solid rgb(var(--border) / var(--glass-border-opacity));
}

/* Sidebar uses custom gradients */
[data-theme-type="glass"] .sidebar {
  background: linear-gradient(135deg,
    rgb(var(--sidebar-gradient-from) / var(--sidebar-gradient-opacity)),
    rgb(var(--sidebar-gradient-via) / var(--sidebar-gradient-opacity)),
    rgb(var(--sidebar-gradient-to) / var(--sidebar-gradient-opacity)));
  color: var(--sidebar-text-color);
}
```

## Theme-Aware Components

Several components adapt their styling based on theme type:

1. **DashboardSidebar**
   - Modern: Solid background with theme colors
   - Glass: Gradient background with blur effects

2. **ProfileDropdown & ThemeSelector**
   - Modern: Transparent buttons with subtle borders
   - Glass: Translucent backgrounds with blur

3. **Cards and Panels**
   - Modern: Solid backgrounds with shadows
   - Glass: Transparent with backdrop blur

4. **Notifications & Modals**
   - Modern: Standard elevation with shadows
   - Glass: Layered transparency effects

## Adding New Themes

1. **Choose the theme type** (modern or glass)
2. **Add to appropriate JSON file**
3. **Define all required color properties**
4. **For glass themes**, add glass-specific properties
5. **Set appropriate order value**
6. **Test in both light and dark environments**
7. **Verify accessibility compliance**
8. **Test theme-aware components**

## Best Practices

1. **Consistency**: Keep similar themes across both systems
2. **Accessibility**: Ensure proper contrast ratios
3. **Performance**: Glass effects can impact performance on low-end devices
4. **Fallbacks**: Modern themes serve as fallbacks for unsupported glass effects
5. **Testing**: Test all interactive states and component variations
6. **Documentation**: Document any special considerations for each theme

## Theme Keys

Theme keys must match between modern and glass versions:
- Use lowercase
- No spaces (use hyphens)
- Examples: `emerald`, `celeste`, `storm`, `midnight`

## Color Format Notes

- **Hex to RGB Conversion**: All hex colors are converted to RGB format for CSS variables
- **Alpha Support**: RGB format allows Tailwind opacity utilities (e.g., `bg-primary/50`)
- **Glass Tints**: Use RGBA format for glass tint colors
- **RGB Strings**: Some properties use space-separated RGB values (e.g., "17 24 39")