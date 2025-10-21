# ProfileDropdown Component

## Overview
User profile dropdown menu with account actions and logout.

## Location
`/components/utilities/ProfileDropdown.tsx`

## Purpose
Provide user account menu with profile, settings, notifications, help, and logout.

## Key Features
- Dropdown with user avatar (initials)
- Click-outside-to-close
- Menu items: Profile, Settings, Notifications, Help, Logout
- Uses auth-client for logout
- Responsive positioning

## Dependencies
- next/navigation: useRouter
- @/lib/auth-client: authClient
- lucide-react: Icons
- @/lib/utils: cn()

## State
```typescript
isOpen: boolean - Dropdown open/close state
dropdownRef: Ref - For click-outside detection
```

## User Data
Currently mock data (replace with auth context):
- name, email, role, initials

## Menu Items
1. **Profile**: User icon
2. **Settings**: Settings icon
3. **Notifications**: Bell icon
4. **Help**: HelpCircle icon
5. **Logout**: LogOut icon (with signOut handler)

## Interactions with Sister Components

### LogoComponent (Sister)
**Relationship**: Independent utilities
- No direct interaction
- Both in utilities folder

## Interactions with Parent Components

### DashboardNavbar (Parent)
**Relationship**: Child ← Parent
- Rendered in navbar right section
- Next to ThemeSelector
- Provides user account access

## Click Outside Behavior
```typescript
useEffect: Adds mousedown listener when open
Cleanup: Removes listener when closed
```

## Logout Flow
```typescript
authClient.signOut() → Navigate to login
```

## Styling
- Glassmorphism dropdown
- Hover effects on menu items
- Avatar with initials badge
- Smooth transitions

## Future
- Real user data from auth context
- User profile page navigation
- Settings page navigation
- Notifications panel
- Keyboard navigation (arrow keys)
