# Glassmorphism Design Guide for NextPhoton

## Core Design Principles

### 1. Glass Effects
All UI components should follow the glassmorphism aesthetic with:
- **Backdrop blur**: `backdrop-blur-sm` to `backdrop-blur-xl` depending on context
- **Semi-transparent backgrounds**: Using `bg-card/10` or `bg-white/10` patterns
- **Subtle borders**: `border-border/20` for glass panels
- **Layered transparency**: Progressive opacity for depth

### 2. Standard Glass Components

#### Glass Card (Primary Container)
```css
- Background: bg-white/10 or bg-card/10
- Backdrop: backdrop-blur-sm to backdrop-blur-xl
- Border: border border-white/20 or border-border/20
- Rounded: rounded-lg
- Hover: hover:bg-white/15 or hover:bg-card/15
```

#### Glass Button
```css
- Background: bg-primary/10 to bg-primary/20
- Border: border-primary/20 to border-primary/40
- Hover: hover:bg-primary/15 to hover:bg-primary/25
- Active: Active state with slight scale transform
```

#### Glass Navigation
```css
- Background: bg-card/10
- Backdrop: backdrop-blur-xl
- Border: border-r border-border/20 (for sidebars)
- Border: border-b border-border/20 (for top nav)
```

### 3. Color Palette Usage

#### Background Gradients
Each theme has a signature gradient that should be applied to the body:
```css
background: linear-gradient(to bottom right, 
  rgb(var(--gradient-from)),
  rgb(var(--gradient-via)), 
  rgb(var(--gradient-to)));
```

#### Text Colors
- **Primary text**: `text-foreground` - High contrast against backgrounds
- **Secondary text**: `text-muted-foreground` - For less important information
- **Accent text**: `text-primary`, `text-secondary`, `text-accent` - For highlights

### 4. Spacing & Layout

#### Consistent Padding
- **Cards**: `p-4` to `p-6`
- **Buttons**: `px-3 py-2` to `px-4 py-3`
- **Sections**: `p-6` to `p-8`

#### Grid Layouts
- **Two-column grid**: `grid grid-cols-2 gap-2` to `gap-4`
- **Three-column grid**: `grid grid-cols-1 lg:grid-cols-3 gap-6`
- **Responsive**: Always include mobile-first responsive classes

### 5. Scrollbars

All scrollable areas MUST use the slim scrollbar:
```css
custom-scrollbar scrollbar-thin
```

This applies to:
- Main content areas
- Sidebars
- Dropdown menus
- Modal content
- Any overflow containers

### 6. Borders & Shadows

#### Border Styles
- **Glass panels**: `border border-border/20`
- **Hover states**: `hover:border-border/30`
- **Active/Selected**: `border-primary/40`

#### Shadow Effects
```css
box-shadow: 
  0 8px 32px 0 rgba(31, 38, 135, 0.15),
  inset 0 0 0 1px rgba(255, 255, 255, 0.1);
```

### 7. Animation & Transitions

#### Standard Transitions
```css
transition-all duration-200 ease-in-out
```

#### Transform Effects
- **Hover lift**: `hover:transform hover:translateY(-2px)`
- **Active press**: `active:transform active:scale(0.98)`

### 8. Typography

#### Font Sizes
- **Headings**: `text-3xl` to `text-4xl font-bold`
- **Subheadings**: `text-xl font-semibold`
- **Body**: `text-sm` to `text-base`
- **Small text**: `text-xs text-muted-foreground`

### 9. Component Patterns

#### Dashboard Layout
```jsx
<div className="min-h-screen">
  {/* Background gradient applied to body */}
  <div className="container mx-auto px-4 py-8">
    {/* Glass navbar */}
    <nav className="bg-card/10 backdrop-blur-xl border-b border-border/20">
      {/* Navigation content */}
    </nav>
    
    {/* Main content grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Glass cards */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        {/* Card content */}
      </div>
    </div>
  </div>
</div>
```

#### Form Inputs
```jsx
<input 
  className="w-full p-3 bg-white/5 text-white placeholder-gray-400 
             rounded-lg border border-white/10 focus:border-primary/50 
             focus:outline-none backdrop-blur-sm"
/>
```

### 10. Theme-Specific Adjustments

Each theme should maintain its unique character while following these patterns:

- **Light themes** (Celeste, Emerald, Arctic, Sunset): 
  - Use higher opacity for backgrounds (0.15-0.25)
  - Ensure text contrast is sufficient
  
- **Dark themes** (Emerald Night, Midnight, Storm, Monochrome):
  - Use lower opacity for backgrounds (0.05-0.15)
  - Emphasize glow effects
  
- **Special themes** (Coral Fushia, Rosey Garden, Sepia, HiCon):
  - Adjust opacity based on theme brightness
  - Maintain brand colors prominently

## Implementation Checklist

- [ ] All pages use consistent glass card styling
- [ ] Scrollbars are slim and styled (`custom-scrollbar scrollbar-thin`)
- [ ] Borders follow the opacity pattern (border/20 for normal, border/30 for hover)
- [ ] Background gradients are applied from themes.json
- [ ] Text colors provide sufficient contrast
- [ ] Hover and active states are consistent
- [ ] Animations use standard duration (200ms)
- [ ] Forms use glass input styling
- [ ] Navigation uses glass navbar pattern
- [ ] Grid layouts are responsive

## Reference Implementation

The `test-graphql` page serves as the reference implementation for glassmorphism styling:
- Glass cards with proper backdrop blur
- Consistent border opacity
- Proper text contrast
- Grid layout with responsive columns
- Animated hover states