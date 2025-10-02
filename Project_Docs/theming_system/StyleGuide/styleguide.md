# NextPhoton Style Guide

## Overview
This style guide defines the design system for NextPhoton, ensuring consistency across all components and pages. The design philosophy centers around a modern glassmorphism aesthetic with subtle animations and clear visual hierarchy.

## Core Design Principles

### 1. Glassmorphism Design
NextPhoton uses glassmorphism as its primary design language, creating a modern, translucent interface that feels light and sophisticated.

### 2. Consistency
All components should maintain consistent spacing, colors, and interactions throughout the application.

### 3. Accessibility
Ensure sufficient contrast ratios and clear visual indicators for interactive elements.

### 4. Performance
Use CSS transitions and transforms for animations to ensure smooth performance.

## Component Structure

### Base Container
Every page should use this base structure:
```jsx
<div className="min-h-full">
  {/* Page content */}
</div>
```

### Page Headers
Consistent header structure for all pages:
```jsx
{/* Header Section */}
<div className="mb-8">
  <div className="flex items-center gap-4">
    <IconComponent className="h-8 w-8 text-primary" />
    <div>
      <h1 className="text-3xl font-bold text-foreground">Page Title</h1>
      <p className="text-muted-foreground">Page description</p>
    </div>
  </div>
</div>
```

## Glassmorphism Classes

### Primary Glass Container
For main content sections and cards:
```css
bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20
```

### Hover State
Add smooth hover transitions:
```css
hover:bg-white/15 transition-all
```

### Complete Glass Card
```jsx
<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
  {/* Content */}
</div>
```

### Nested Glass Elements
For elements inside glass containers:
```css
bg-white/5 rounded-lg hover:bg-white/10 transition-all
```

## Layout Grids

### Stats/Metrics Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {/* Grid items */}
</div>
```

### Three Column Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  {/* Grid items */}
</div>
```

## Typography

### Headings
- **Page Title**: `text-3xl font-bold text-foreground`
- **Section Title**: `text-xl font-semibold`
- **Card Title**: `text-lg font-medium`

### Body Text
- **Primary Text**: `text-foreground`
- **Secondary Text**: `text-muted-foreground`
- **Small Text**: `text-xs text-muted-foreground`

### Metric Display
```jsx
<div className="text-2xl font-bold">Value</div>
<div className="text-xs text-muted-foreground mt-2">Description</div>
```

## Color Usage

### Text Colors
- **Primary**: `text-foreground` - Main text color
- **Secondary**: `text-muted-foreground` - Descriptive/secondary text
- **Primary Brand**: `text-primary` - Brand color for icons/highlights
- **Success**: `text-success` - Positive states
- **Warning**: `text-warning` - Warning states
- **Error**: `text-error` - Error states

### Background Colors
- **Glass Background**: `bg-white/10` - Primary glass effect
- **Glass Hover**: `bg-white/15` - Hover state
- **Nested Glass**: `bg-white/5` - For nested elements
- **Full Transparency**: `bg-transparent` - No background

### Border Colors
- **Glass Border**: `border-white/20` - Subtle glass border
- **Interactive Border**: `border-white/10` - For interactive elements

## Common Patterns

### Stat Card Pattern
```jsx
<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
  <div className="flex items-center justify-between mb-4">
    <div className="text-muted-foreground">Metric Name</div>
    <div className="text-primary">📊</div>
  </div>
  <div className="text-2xl font-bold">0</div>
  <div className="text-xs text-muted-foreground mt-2">Description</div>
</div>
```

### Settings Toggle Pattern
```jsx
<div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
  <div>
    <p className="font-medium">Setting Name</p>
    <p className="text-sm text-muted-foreground">Setting description</p>
  </div>
  <Switch />
</div>
```

### Action Button Pattern
```jsx
<button className="w-full p-3 bg-white/5 text-foreground rounded-lg border border-white/10 hover:bg-white/10 transition-all text-left">
  <div className="font-medium">Action Title</div>
  <div className="text-xs text-muted-foreground">Action description</div>
</button>
```

## Spacing Guidelines

### Padding
- **Container Padding**: `p-6` (24px)
- **Card Padding**: `p-6` (24px)
- **Button/Input Padding**: `p-4` (16px) or `p-3` (12px)

### Margins
- **Section Spacing**: `mb-8` (32px) between major sections
- **Element Spacing**: `mb-4` (16px) between elements
- **Text Spacing**: `mt-2` (8px) for description text

### Gaps
- **Grid Gap**: `gap-6` (24px)
- **Flex Gap**: `gap-4` (16px) for icon/text combinations
- **Small Gap**: `gap-2` (8px) for tight groupings

## Icons

### Icon Usage
- Use Lucide React icons for consistency
- Icon size: `h-8 w-8` for page headers, `h-4 w-4` or `h-5 w-5` for inline
- Apply brand color: `className="h-8 w-8 text-primary"`

### Emoji Icons
Use emojis as visual indicators in stat cards:
- 📊 - Analytics/Charts
- 📈 - Growth/Improvement
- 🏆 - Achievement/Top Performance
- ⚠️ - Warning/Needs Attention
- ✅ - Completed/Success
- 📋 - Tasks/Lists
- ⏳ - Pending/Waiting
- 📢 - Announcements
- ⏰ - Scheduled
- 💰 - Financial/Revenue
- 🟢 - Active/Online

## Animation Guidelines

### Transitions
Always include smooth transitions:
```css
transition-all
```

### Hover Effects
- Background opacity changes: `hover:bg-white/15`
- Scale on hover (optional): `hover:scale-105`
- Shadow on hover (optional): `hover:shadow-lg`

### Duration
Use default Tailwind transition duration (150ms) for snappy interactions

## Responsive Design

### Breakpoint Usage
- **Mobile First**: Start with single column layouts
- **Tablet**: `md:` prefix for 768px and up
- **Desktop**: `lg:` prefix for 1024px and up

### Grid Responsiveness Example
```css
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
```

## Dark Mode Considerations
The glassmorphism design works well in both light and dark modes:
- Glass effects automatically adapt to the background
- Use semantic color variables (foreground, muted-foreground) that respond to theme changes
- Avoid hardcoded colors that don't adapt to theme

## Component Examples

### Full Page Template
```jsx
export default function PageName() {
  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <IconName className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Page Title</h1>
            <p className="text-muted-foreground">Page description</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stat cards */}
      </div>

      {/* Main Content Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold mb-4">Section Title</h2>
        {/* Content */}
      </div>
    </div>
  )
}
```

## Do's and Don'ts

### Do's
- ✅ Use consistent spacing values from Tailwind
- ✅ Apply glassmorphism to create visual hierarchy
- ✅ Include hover states for interactive elements
- ✅ Use semantic color classes that adapt to themes
- ✅ Maintain consistent border radius (rounded-lg)
- ✅ Add appropriate icons or emojis for visual interest
- ✅ Use proper heading hierarchy

### Don'ts
- ❌ Don't use the Card component from UI libraries for glassmorphism sections
- ❌ Don't mix different border radius values
- ❌ Don't forget hover states on interactive elements
- ❌ Don't use opaque backgrounds that break the glass effect
- ❌ Don't hardcode colors that won't adapt to theme changes
- ❌ Don't create overly deep nesting of glass effects (max 2 levels)

## Implementation Checklist
When creating a new page or component:
- [ ] Use `min-h-full` container
- [ ] Apply consistent header structure
- [ ] Use glassmorphism for content sections
- [ ] Include proper hover states
- [ ] Add appropriate spacing between sections
- [ ] Use semantic color classes
- [ ] Include responsive grid layouts
- [ ] Add smooth transitions
- [ ] Follow typography hierarchy
- [ ] Test in both light and dark modes