# 1. ROOT LAYOUT

**Location:** `frontend/web/src/app/layout.tsx`

## Purpose

Global application wrapper that provides core functionality to **ALL routes** in the NextPhoton application.

## Features

### ✅ Font Configuration
- **Inter** from Google Fonts
- Applied globally via `className={inter.className}`

### ✅ Metadata & SEO
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "Next Photon EduTech Management Dashboard",
  description: "Next Photon EduTech Management System - Uber for Educators",
  icons: {
    icon: "/favicon.png",
  },
}
```

### ✅ Theme System
- **ThemeScript Component** - Prevents Flash of Unstyled Content (FOUC)
- Dark/Light mode support
- Injected in `<head>` before body rendering
- `suppressHydrationWarning` on `<html>` tag for theme switching

### ✅ Global Providers (Nested)

The application uses a carefully ordered provider chain:

```jsx
<html lang="en" suppressHydrationWarning>
  <head>
    <ThemeScript />
  </head>
  <body>
    <LoadingProvider>
      <AuthProvider>
        <ApolloProvider>
          {children}
          <GlobalLoader />
        </ApolloProvider>
      </AuthProvider>
    </LoadingProvider>
    <ToastContainer />
    <Toaster />
  </body>
</html>
```

#### Provider Details:

1. **LoadingProvider** (`@/contexts/LoadingContext`)
   - Global loading state management
   - Controls full-screen loader visibility

2. **AuthProvider** (`@/contexts/AuthProviderWithLoading`)
   - Authentication context
   - User session management
   - JWT token handling
   - Role-based access control

3. **ApolloProvider** (`@/lib/apollo`)
   - GraphQL client for data fetching
   - Query/mutation management
   - Local and remote resolvers

### ✅ Global Components

#### GlobalLoader
- Full-screen loading indicator
- Animated spinner with theme-aware styling
- Controlled by LoadingProvider

#### Toast Notifications
- **ToastContainer** (react-toastify)
  - Position: `bottom-right`
  - Theme: `dark`

- **Toaster** (sonner)
  - Position: `top-right`
  - Modern toast notifications

### ✅ Global Styling
- Imports `./globals.css`
- Applies to all routes
- Includes:
  - Tailwind CSS v4
  - Custom CSS variables for themes
  - Global resets and utilities

## Body Styling

```jsx
<body className={`
  ${inter.className}
  min-h-screen
  font-sans
  text-foreground
  transition-colors
  duration-200
`}>
```

- **min-h-screen** - Ensures full viewport height
- **font-sans** - Sans-serif font family
- **text-foreground** - Theme-aware text color
- **transition-colors** - Smooth theme transitions

## Code Reference

**File:** `frontend/web/src/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";
import { AuthProviderInner as AuthProvider } from "@/contexts/AuthProviderWithLoading";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { GlobalLoader } from "@/components/GlobalLoader";
import { ApolloProvider } from "@/lib/apollo";
import ThemeScript from "./theme-script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "Next Photon EduTech Management Dashboard",
  description: "Next Photon EduTech Management System - Uber for Educators",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme script to prevent FOUC */}
        <ThemeScript />
      </head>
      <body className={`${inter.className} min-h-screen font-sans text-foreground transition-colors duration-200`}>
        <LoadingProvider>
          <AuthProvider>
            <ApolloProvider>
              {children}
              <GlobalLoader />
            </ApolloProvider>
          </AuthProvider>
        </LoadingProvider>
        <ToastContainer position="bottom-right" theme="dark" />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

## Applies To

**All routes** in the application:
- `/` (Homepage)
- `/(auth)/*` (Authentication)
- `/(dashboard)/*` (Dashboard)
- `/(onboarding)/*` (Onboarding)
- `/(public)/*` (Public pages)
- `/company/*` (Company pages)
- `/legal/*` (Legal pages)
- `/api/*` (API routes - no rendering)
- All other routes

## Key Responsibilities

1. ✅ **Global State** - Provides authentication, loading, and GraphQL context
2. ✅ **Theme Management** - Dark/Light mode without FOUC
3. ✅ **Typography** - Global font configuration
4. ✅ **Notifications** - Toast system for user feedback
5. ✅ **Loading States** - Global loading indicator
6. ✅ **SEO** - Metadata and favicon configuration
7. ✅ **Styling Foundation** - Global CSS and Tailwind setup

## Related Files

- `frontend/web/src/app/theme-script.tsx` - Theme initialization
- `frontend/web/src/app/globals.css` - Global styles
- `frontend/web/src/contexts/LoadingContext.tsx` - Loading state
- `frontend/web/src/contexts/AuthProviderWithLoading.tsx` - Auth context
- `frontend/web/src/lib/apollo/index.ts` - Apollo client setup
- `frontend/web/src/components/GlobalLoader.tsx` - Loader component
