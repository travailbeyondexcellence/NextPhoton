# Coding Standard Operating Procedures (SOP)

**Last Updated:** 2025-10-05
**Project:** NextPhoton - Next.js 15 with TypeScript Strict Mode
**Purpose:** Ensure development code is production-ready and passes build without errors

---

## Table of Contents

1. [Syntax & Formatting Rules](#1-syntax--formatting-rules)
2. [Next.js 15 Specific Rules](#2-nextjs-15-specific-rules)
3. [TypeScript Strict Mode Requirements](#3-typescript-strict-mode-requirements)
4. [React & Component Patterns](#4-react--component-patterns)
5. [State Management & Context Patterns](#5-state-management--context-patterns)
6. [Import/Export Best Practices](#6-importexport-best-practices)
7. [Mock Deployment Patterns](#7-mock-deployment-patterns)
8. [Common Error Patterns & Fixes](#8-common-error-patterns--fixes)
9. [Build Checklist](#9-build-checklist)

---

## 1. Syntax & Formatting Rules

### 1.1 Apostrophes and Quotes in JSX

**❌ NEVER DO THIS:**
```jsx
// Wrong: Curly/smart quotes
<p>Don't use curly quotes</p>
<p>It's incorrect</p>

// Wrong: HTML entities in JSX text
<p>Don&apos;t use HTML entities in text</p>
```

**✅ ALWAYS DO THIS:**
```jsx
// Correct: Straight quotes/apostrophes
<p>Don't use curly quotes</p>
<p>It's correct</p>

// Correct: HTML entities only in attributes or when necessary
<meta content="Don't" />
```

**Rule:** Use straight apostrophes (`'`) in JSX text content, not curly quotes (`'`) or HTML entities.

---

### 1.2 Comments in JSX

**❌ NEVER DO THIS:**
```jsx
<div>
  // This is wrong
  {/* Content */}
</div>
```

**✅ ALWAYS DO THIS:**
```jsx
<div>
  {/* This is correct */}
  {/* Multi-line comments
      should use this format */}
  <Content />
</div>
```

**Rule:** Inside JSX, use `{/* comment */}` format, never `//` or `/* */` directly.

---

### 1.3 String Consistency

**✅ BEST PRACTICE:**
```typescript
// Use consistent quote style (prefer single quotes for strings)
const message = 'Hello world';
const template = `Hello ${name}`;

// Use double quotes only when escaping is needed
const quote = "It's a beautiful day";
```

---

## 2. Next.js 15 Specific Rules

### 2.1 Async Route Handler Params

**❌ WRONG (Next.js 14 pattern):**
```typescript
// This will fail in Next.js 15
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // ...
}
```

**✅ CORRECT (Next.js 15 pattern):**
```typescript
// Params are now Promise-based
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

**Rule:** In Next.js 15, route handler params are Promise-based. Always:
1. Type params as `Promise<{ ... }>`
2. Await params before accessing properties

---

### 2.2 API Route Exports

**❌ WRONG:**
```typescript
// Empty or fully commented file
// export async function GET() { ... }
```

**✅ CORRECT:**
```typescript
// Every route file must have at least one export
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'API ready' });
}
```

**Rule:** API route files must export at least one HTTP method handler.

---

### 2.3 File Module Requirements

**❌ WRONG:**
```typescript
// File with all code commented out
// const something = 'value';
```

**✅ CORRECT:**
```typescript
// If all code is commented, add empty export
export {};

// Or keep at least one active export
export const config = {};
```

**Rule:** Every TypeScript file must either export something or have `export {}` to be treated as a module.

---

## 3. TypeScript Strict Mode Requirements

### 3.1 TypeScript Compilation Target

**❌ WRONG:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5"  // Doesn't support Set iteration
  }
}
```

**✅ CORRECT:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017"  // Supports modern features
  }
}
```

**Rule:** Use `ES2017` or higher to support Set/Map iteration and modern JavaScript features.

---

### 3.2 Explicit Type Annotations

**❌ WRONG:**
```typescript
// Implicit any types
items.map((item, idx) => (
  <div key={idx}>{item.name}</div>
))

// No type for parameters
function handleUpdate(id, data) {
  // ...
}
```

**✅ CORRECT:**
```typescript
// Explicit types for map callbacks
items.map((item: any, idx: number) => (
  <div key={idx}>{item.name}</div>
))

// Or with proper typing
items.map((item: ItemType, idx: number) => (
  <div key={idx}>{item.name}</div>
))

// Explicit parameter types
function handleUpdate(id: string, data: UpdateData) {
  // ...
}
```

**Rule:** In strict mode, always provide explicit type annotations for:
- Function parameters
- Map/filter/reduce callbacks
- Event handlers
- Any place TypeScript can't infer the type

---

### 3.3 Type Casting When Necessary

**❌ WRONG:**
```typescript
// Trying to access property TypeScript doesn't know about
const readBy = communication.readBy || {};

// Trying to assign void to string
const key = startLoading('my-key', 'Loading...') as string;
```

**✅ CORRECT:**
```typescript
// Cast to any when accessing dynamic properties
const readBy = (communication as any).readBy || {};

// Don't try to assign void returns
startLoading('my-key', 'Loading...');
const key = 'my-key';  // Use the key directly
```

**Rule:** Use type casting (`as any`) when:
- Accessing properties on untyped objects
- Working with third-party libraries with incomplete types
- Intentionally working around type limitations (document why)

**Warning:** Don't abuse `as any` - use proper types when possible.

---

### 3.4 Switch Statement Type Matching

**❌ WRONG:**
```typescript
type Priority = 'urgent' | 'high' | 'normal' | 'low';

function getColor(priority: Priority) {
  switch (priority) {
    case 'urgent': return 'red';
    case 'medium': return 'yellow';  // ❌ 'medium' not in type
    case 'pending': return 'blue';   // ❌ 'pending' not in type
    default: return 'gray';
  }
}
```

**✅ CORRECT:**
```typescript
type Priority = 'urgent' | 'high' | 'normal' | 'low';

function getColor(priority: Priority) {
  switch (priority) {
    case 'urgent': return 'red';
    case 'high': return 'orange';
    case 'normal': return 'yellow';
    case 'low': return 'green';
    default: return 'gray';
  }
}
```

**Rule:** Switch case values must exactly match the TypeScript type union. Remove invalid cases.

---

### 3.5 Index Signatures for Dynamic Properties

**❌ WRONG:**
```typescript
const statusClasses = {
  active: 'bg-green-500',
  inactive: 'bg-gray-500'
};

// Error: Element implicitly has 'any' type
const className = statusClasses[status];
```

**✅ CORRECT:**
```typescript
const statusClasses: Record<string, string> = {
  active: 'bg-green-500',
  inactive: 'bg-gray-500'
};

// Works fine
const className = statusClasses[status];
```

**Rule:** Add index signatures (`Record<string, T>`) when accessing objects with dynamic keys.

---

## 4. React & Component Patterns

### 4.1 Component vs Context

**❌ WRONG:**
```typescript
// Creating Context and trying to use it as a component
const SelectContext = React.createContext<SelectContextType>({});

// Then in JSX
<SelectContext value={value} onValueChange={onChange}>
  {children}
</SelectContext>
```

**✅ CORRECT:**
```typescript
// Create Context
const SelectContext = React.createContext<SelectContextType>({});

// Create Component that uses the Context
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  );
};
```

**Rule:**
- `createContext` creates a Context, not a Component
- Wrap Context.Provider in a proper component with typed props
- Export the component, not the Context

---

### 4.2 Component Props Validation

**❌ WRONG:**
```typescript
// Component definition
interface EducatorsListProps {
  educators: Educator[];
}

const EducatorsList: React.FC<EducatorsListProps> = ({ educators }) => {
  // ...
};

// Usage - passing non-existent prop
<EducatorsList educators={data} initialView="table" />
```

**✅ CORRECT:**
```typescript
// Check component interface first
interface EducatorsListProps {
  educators: Educator[];
  initialView?: 'table' | 'grid';  // Add to interface
}

// Or remove the prop if not needed
<EducatorsList educators={data} />
```

**Rule:** Only pass props that are defined in the component's interface. Check the component definition first.

---

### 4.3 Component Props with Defaults

**❌ WRONG:**
```typescript
// Making prop optional and trying to provide default in function
interface CardProps {
  educator?: Educator;
}

const Card: React.FC<CardProps> = ({ educator = defaultEducator }) => {
  // defaultEducator must be defined somewhere
};
```

**✅ CORRECT:**
```typescript
// Make prop required
interface CardProps {
  educator: Educator;
}

const Card: React.FC<CardProps> = ({ educator }) => {
  // No default needed
};

// Or use defaultProps pattern
const Card: React.FC<CardProps> = ({ educator }) => {
  const educatorData = educator ?? defaultEducator;
  // ...
};
```

**Rule:** Prefer required props over optional with defaults. Use `??` operator for fallbacks when needed.

---

### 4.4 Removing Unused Props

**❌ WRONG:**
```typescript
// Passing props that component doesn't use
<Slider
  id="opacity-slider"  // ❌ Slider doesn't accept id prop
  value={opacity}
  onChange={setOpacity}
/>
```

**✅ CORRECT:**
```typescript
// Only pass props the component accepts
<Slider
  value={opacity}
  onChange={setOpacity}
/>
```

**Rule:** Remove unused props. They cause type errors and confusion.

---

## 5. State Management & Context Patterns

### 5.1 Loading Context - Key Management

**❌ WRONG:**
```typescript
// Trying to capture return value
const loadingKey = startLoading('my-operation', 'Loading...');
// Later
stopLoading(loadingKey);  // loadingKey is undefined! startLoading returns void
```

**✅ CORRECT:**
```typescript
// Use string literal directly
const OPERATION_KEY = 'my-operation';
startLoading(OPERATION_KEY, 'Loading...');

try {
  // ... operation
} finally {
  stopLoading(OPERATION_KEY);  // Use same key
}
```

**Rule:**
- `startLoading()` returns `void`, not the key
- Define key as const string and use it for both start and stop
- Always match start/stop keys exactly

---

### 5.2 Loading Keys Must Match

**❌ WRONG:**
```typescript
const register = async (data: RegisterData) => {
  startLoading('auth-register', 'Creating account...');

  try {
    // ... register logic
  } finally {
    stopLoading('auth-login');  // ❌ Different key!
  }
};
```

**✅ CORRECT:**
```typescript
const register = async (data: RegisterData) => {
  startLoading('auth-register', 'Creating account...');

  try {
    // ... register logic
  } finally {
    stopLoading('auth-register');  // ✅ Same key
  }
};
```

**Rule:** startLoading and stopLoading must use identical key strings. Define as const to avoid typos.

---

### 5.3 Async/Await in useEffect

**❌ WRONG:**
```typescript
useEffect(async () => {
  await fetchData();
}, []);  // ❌ useEffect can't be async directly
```

**✅ CORRECT:**
```typescript
useEffect(() => {
  async function fetchData() {
    const data = await api.getData();
    setState(data);
  }

  fetchData();
}, []);
```

**Rule:** Define async function inside useEffect, then call it. Don't make useEffect callback async.

---

## 6. Import/Export Best Practices

### 6.1 Importing Non-Exported Types

**❌ WRONG:**
```typescript
// Trying to import type that isn't exported
import { ThemeProviderProps } from 'next-themes';
```

**✅ CORRECT:**
```typescript
// Use utility types
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type MyProps = React.ComponentProps<typeof NextThemesProvider>;
```

**Rule:** When types aren't exported, use utility types like:
- `React.ComponentProps<typeof Component>`
- `Parameters<typeof function>`
- `ReturnType<typeof function>`

---

### 6.2 Import Path Validation

**❌ WRONG:**
```typescript
// Importing from paths outside project structure
import { prisma } from '../../../../../shared/db';

// Importing from non-existent modules
import { extractSubdomain } from '../shared/auth/getTenant';
```

**✅ CORRECT:**
```typescript
// Option 1: Use correct relative path within monorepo
import { prisma } from '@/lib/prisma';

// Option 2: Comment out and provide mock for deployment
// import { extractSubdomain } from '../shared/auth/getTenant';
const extractSubdomain = (host: string): string | null => {
  // Mock implementation
  return host.split('.')[0] || 'default';
};
```

**Rule:**
- Verify import paths exist and are accessible
- Use path aliases (`@/`) when configured
- Provide mocks for unavailable imports in production builds

---

### 6.3 Named vs Default Exports

**✅ BEST PRACTICE:**
```typescript
// Prefer named exports for clarity
export const MyComponent = () => { ... };
export const useMyHook = () => { ... };

// Use default export only for page components
export default function Page() { ... }
```

**Rule:** Use named exports for better refactoring and auto-import support.

---

## 7. Mock Deployment Patterns

### 7.1 External Authentication Libraries

**Pattern:** When building for production without backend/auth configured:

**❌ WRONG:**
```typescript
import { signUp } from 'better-auth/react';

const handleSignup = async () => {
  await signUp.email({ ... });  // Will fail if not configured
};
```

**✅ CORRECT:**
```typescript
// Comment out external auth
// import { signUp } from 'better-auth/react';

const handleSignup = async () => {
  // Mock deployment: Skip authentication
  // await signUp.email({ ... });

  // Redirect to login or next step
  router.push('/sign-in');
};
```

**Rule:** For mock deployments:
1. Comment out external auth imports
2. Add mock navigation/behavior
3. Add comment explaining it's for mock deployment
4. Keep original code commented for later restoration

---

### 7.2 Database Operations

**Pattern:** When using Prisma or database operations:

**❌ WRONG:**
```typescript
import { clerkClient } from '@clerk/nextjs/server';

const user = await clerkClient().users.createUser({ ... });
```

**✅ CORRECT:**
```typescript
// import { clerkClient } from '@clerk/nextjs/server';

// Mock deployment: Skip external auth
const user = { id: `mock-user-${Date.now()}` };
// const user = await clerkClient().users.createUser({ ... });
```

**Rule:** For external services:
1. Comment out the import
2. Provide mock data
3. Comment out the actual call
4. Document it's for mock deployment

---

### 7.3 Environment Variable Handling

**✅ BEST PRACTICE:**
```typescript
// Check for mock mode
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

if (useMockData) {
  // Return mock data
  return mockEducators;
} else {
  // Call real API
  const response = await fetch('/api/educators');
  return response.json();
}
```

**Rule:** Use environment variables to toggle between mock and real data.

---

## 8. Common Error Patterns & Fixes

### 8.1 "Property does not exist on type"

**Error:** `Property 'readBy' does not exist on type 'BaseEntity'`

**Fix:**
```typescript
// Cast to any when accessing dynamic properties
const readBy = (communication as any).readBy || {};
```

---

### 8.2 "Cannot find module"

**Error:** `Cannot find module '../../../../../shared/db'`

**Fixes:**
1. Verify path exists
2. Use path alias: `@/lib/db`
3. Comment out and provide mock
4. Add to tsconfig paths

---

### 8.3 "has no exported member"

**Error:** `'ThemeProviderProps' has no exported member`

**Fix:**
```typescript
// Use utility type instead
type Props = React.ComponentProps<typeof ThemeProvider>;
```

---

### 8.4 "Element implicitly has 'any' type"

**Error:** `Element implicitly has an 'any' type because expression of type 'string' can't be used to index type`

**Fix:**
```typescript
// Add index signature
const obj: Record<string, string> = { ... };
```

---

### 8.5 "Type 'void' is not assignable"

**Error:** `Type 'void' is not assignable to type 'string'`

**Fix:**
```typescript
// Don't try to capture void return
// ❌ const key = startLoading(...);
// ✅
startLoading('my-key', 'Loading...');
const key = 'my-key';
```

---

### 8.6 "Conversion of type 'void' to type 'string' may be a mistake"

**Error:** Related to type casting void to string

**Fix:**
```typescript
// Don't cast void returns
// ❌ startLoading(key, msg) as string
// ✅ Just call it
startLoading(key, msg);
```

---

### 8.7 Missing Properties in Types

**Error:** `Property 'messageTemplates' does not exist`

**Fix:**
```typescript
// Add missing properties to type definition
export type NotificationData = {
  notifications: Notification[];
  messageTemplates: MessageTemplate[];  // Add this
  recipientGroups: RecipientGroup[];    // Add this
};
```

---

## 9. Build Checklist

Before running production build, verify:

### ✅ Syntax & Formatting
- [ ] No curly quotes (`'`) - use straight quotes (`'`)
- [ ] No `&apos;` in JSX text - use `'` directly
- [ ] JSX comments use `{/* */}` format
- [ ] Consistent quote style throughout

### ✅ TypeScript
- [ ] All function parameters have explicit types
- [ ] Map/filter callbacks have typed parameters
- [ ] No implicit `any` types
- [ ] Switch cases match type unions exactly
- [ ] Index signatures for dynamic object access
- [ ] TypeScript target is ES2017 or higher

### ✅ Next.js 15
- [ ] Route handler params are `Promise<{...}>`
- [ ] Route handler params are awaited before use
- [ ] All API routes export at least one handler
- [ ] Files either export something or have `export {}`

### ✅ React & Components
- [ ] Only pass props defined in component interface
- [ ] Context wrapped in proper Component
- [ ] Component props match interface exactly
- [ ] No unused props passed to components

### ✅ State & Context
- [ ] Loading keys defined as const strings
- [ ] startLoading/stopLoading use matching keys
- [ ] No attempt to capture void returns
- [ ] useEffect async functions defined inside, not as callback

### ✅ Imports & Dependencies
- [ ] All import paths verified and accessible
- [ ] External auth commented out for mock deployment
- [ ] Mock implementations provided where needed
- [ ] No importing non-existent modules

### ✅ Mock Deployment
- [ ] External services mocked or commented
- [ ] Mock data provided for testing
- [ ] Environment variables configured
- [ ] Comments explain mock vs production code

---

## 10. AI Assistant Instructions

### When Writing New Code:

1. **Read this SOP** before writing any code
2. **Follow TypeScript strict mode** - add explicit types everywhere
3. **Use Next.js 15 patterns** - async params in route handlers
4. **Test for production** - write code that will pass `bun run build`
5. **Document deviations** - if you must break a rule, explain why
6. **Prefer prevention** - write it correctly first time rather than fixing later

### When Reviewing Existing Code:

1. **Check against this SOP** - does it follow all rules?
2. **Flag violations** - point out where code breaks SOP
3. **Suggest fixes** - provide correct pattern from this doc
4. **Explain why** - reference section number from this SOP

### When Debugging Build Errors:

1. **Check Section 8** - Common Error Patterns
2. **Reference relevant sections** - match error to pattern
3. **Apply documented fix** - use the fix from this SOP
4. **Update SOP** - add new patterns if encountered

---

## 11. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-05 | Initial SOP created from production build error analysis (40+ fixes) |

---

## 12. Contributing to This SOP

When you encounter a new error pattern:

1. Document the error message
2. Show the wrong pattern
3. Show the correct pattern
4. Explain the rule
5. Add to appropriate section
6. Update version history

---

**Remember:** The goal is to write production-ready code during development, not to fix production errors during deployment.

**Cost of Prevention vs Fix:**
- Writing correctly first time: 1x effort
- Fixing during production build: 10x effort (diagnosis + fix + rebuild + retest)

**Always choose prevention.**
