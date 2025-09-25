# Theme Configuration (themes.json)

## Overview

The `themes.json` file is the central configuration for all themes in the system. It defines color schemes, metadata, and special properties for each theme.

## File Structure

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
      "name": "Display Name with Emoji",
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

## Required Properties

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

## Example Theme Definition

```json
{
  "emerald": {
    "name": "🌿 Emerald",
    "description": "Fresh green, perfect for daytime reading",
    "order": 1,
    "colors": {
      "background": "#eafff2",
      "foreground": "#09090b",
      "card": "#e6ffe8",
      "cardForeground": "#18181b",
      "primary": "#059669",
      "primaryForeground": "#ffffff",
      "secondary": "#10b981",
      "secondaryForeground": "#ffffff",
      "accent": "#34d399",
      "accentForeground": "#022c22",
      "muted": "#d4ffd8",
      "mutedForeground": "#6b7280",
      "border": "#c3ffc8",
      "selection": "#a7f3d0",
      "link": "#059669",
      "linkHover": "#047857",
      "destructive": "#dc2626",
      "destructiveForeground": "#ffffff",
      "success": "#059669",
      "successForeground": "#ffffff",
      "warning": "#d97706",
      "warningForeground": "#ffffff"
    },
    "progressGradient": {
      "from": "#10b981",
      "to": "#059669"
    },
    "recentEditColor": "#fef08a",
    "recentEditOpacity": 0.3
  }
}
```

## Theme Keys

Theme keys are used as identifiers in the system:
- Must be lowercase
- No spaces (use hyphens or underscores)
- Should be descriptive but concise
- Examples: `emerald`, `midnight`, `hicon`, `emnight`

## Color Selection Guidelines

### Contrast Ratios
- Ensure WCAG AA compliance (4.5:1 for normal text)
- Higher contrast for accessibility themes
- Test foreground/background combinations

### Color Harmony
- Use complementary or analogous color schemes
- Maintain consistent saturation levels
- Consider color psychology for different use cases

### Dark Theme Considerations
- Lower background luminance
- Higher foreground luminance
- Adjusted saturation for better visibility
- Avoid pure black (#000000) - use dark grays

### Light Theme Considerations
- Avoid pure white (#ffffff) for backgrounds
- Use slightly tinted whites for warmth
- Maintain sufficient contrast with pastels

## Adding New Themes

1. Choose a unique theme key
2. Define all required color properties
3. Set appropriate order value
4. Add optional gradient and highlight properties
5. Test in different lighting conditions
6. Verify accessibility compliance

## Theme Categories

Organize themes by use case:
- **Reading**: Optimized for long-form content
- **Working**: High contrast for productivity
- **Night**: Reduced eye strain in dark environments
- **Accessibility**: WCAG AAA compliant options
- **Aesthetic**: Stylized themes for visual appeal

## Validation

Themes are validated for:
- Presence of all required properties
- Valid hex color format
- Unique theme keys
- Proper contrast ratios (recommended)

## Best Practices

1. **Test all color combinations** in the actual UI
2. **Provide variety** - light, dark, and specialty options
3. **Consider color blindness** - test with simulators
4. **Document color choices** - explain the rationale
5. **Version control** - track theme changes
6. **User feedback** - iterate based on preferences

## Color Format Conversion

Hex colors are automatically converted to RGB:
```javascript
// #059669 becomes "5 150 105"
// This allows Tailwind to add alpha values
// Example: bg-primary/50 for 50% opacity
```

## Theme Ordering

Themes appear in the selector based on the `order` property:
1. Lower numbers appear first
2. Use increments of 1 for easy reordering
3. Group similar themes together
4. Place most popular themes first