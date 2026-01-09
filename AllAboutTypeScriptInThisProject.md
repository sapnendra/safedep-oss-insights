# All About TypeScript in SafeDep Insights

A beginner-friendly guide to understanding all the TypeScript concepts used in this project, organized by topic.

---

## Table of Contents

1. [What is TypeScript?](#1-what-is-typescript)
2. [TypeScript Configuration (tsconfig.json)](#2-typescript-configuration-tsconfigjson)
3. [Basic Types](#3-basic-types)
4. [Interfaces](#4-interfaces)
5. [Type Aliases](#5-type-aliases)
6. [Optional Properties](#6-optional-properties)
7. [Union Types](#7-union-types)
8. [Intersection Types](#8-intersection-types)
9. [Generics](#9-generics)
10. [Type Assertions](#10-type-assertions)
11. [The `unknown` Type](#11-the-unknown-type)
12. [Type Guards](#12-type-guards)
13. [Const Assertions](#13-const-assertions)
14. [Index Signatures](#14-index-signatures)
15. [Utility Types](#15-utility-types)
16. [Function Types](#16-function-types)
17. [Async/Await with Types](#17-asyncawait-with-types)
18. [React with TypeScript](#18-react-with-typescript)
19. [Module Imports and Exports](#19-module-imports-and-exports)
20. [Type Inference](#20-type-inference)

---

## 1. What is TypeScript?

TypeScript is a **superset of JavaScript** that adds static type checking. This means you can catch errors during development (before your code runs) rather than at runtime.

### Why Use TypeScript?

- **Catch bugs early**: Find errors as you write code
- **Better editor support**: Get autocomplete, refactoring, and navigation
- **Self-documenting code**: Types explain what your code expects
- **Safer refactoring**: Change code confidently with type checking

### File Extensions

| Extension | Usage                                        |
| --------- | -------------------------------------------- |
| `.ts`     | Regular TypeScript files                     |
| `.tsx`    | TypeScript files with JSX (React components) |
| `.d.ts`   | Type declaration files (types only, no code) |

**In this project:**

- `lib/*.ts` - API functions and utilities
- `components/*.tsx` - React components
- `next-env.d.ts` - Next.js type declarations

---

## 2. TypeScript Configuration (tsconfig.json)

The `tsconfig.json` file tells TypeScript how to compile your code.

### From [tsconfig.json](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/tsconfig.json):

```json
{
  "compilerOptions": {
    "target": "ES2017", // JavaScript version to output
    "lib": ["dom", "dom.iterable", "esnext"], // Available APIs
    "allowJs": true, // Allow JavaScript files
    "skipLibCheck": true, // Skip checking node_modules types
    "strict": true, // Enable all strict type checks
    "noEmit": true, // Don't output JS files (Next.js handles this)
    "esModuleInterop": true, // Better import compatibility
    "module": "esnext", // Use modern ES modules
    "moduleResolution": "bundler", // Modern bundler resolution
    "resolveJsonModule": true, // Allow importing JSON files
    "isolatedModules": true, // Each file is a separate module
    "jsx": "react-jsx", // React JSX transformation
    "paths": {
      "@/*": ["./*"] // Path alias: @/ means project root
    }
  }
}
```

### Key Options Explained

| Option             | What It Does                                              |
| ------------------ | --------------------------------------------------------- |
| `strict: true`     | Enables all strict type-checking options. Recommended!    |
| `jsx: "react-jsx"` | Allows JSX syntax in `.tsx` files                         |
| `paths`            | Creates import aliases like `@/lib/utils` → `./lib/utils` |

---

## 3. Basic Types

TypeScript has several **primitive types** that you'll use constantly.

### Number, String, Boolean

```typescript
// From lib/api/safedep-insight.ts
const token: string = process.env.SAFEDEP_API_KEY;
const tenantId: string = process.env.SAFEDEP_TENANT_ID;
```

### Arrays

```typescript
// From lib/types/insights.ts
export interface VulnerabilitySeverity {
  severities?: VulnerabilitySeverity[]; // Array of VulnerabilitySeverity
  aliases?: unknown[]; // Array of unknown type
}
```

### Objects

Objects in TypeScript are defined using **interfaces** or **type aliases** (covered next).

---

## 4. Interfaces

An **interface** defines the shape of an object — what properties it has and their types.

### Basic Interface

From [lib/types/insights.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/types/insights.ts):

```typescript
export interface PackageInfo {
  ecosystem?: string;
  name?: string;
}
```

This says: "A `PackageInfo` object can have `ecosystem` and `name` properties, both strings, both optional."

### Nested Interfaces

Interfaces can reference other interfaces:

```typescript
export interface PackageVersion {
  package?: PackageInfo; // Uses the PackageInfo interface
  version?: string;
}
```

### Complex Interface Example

```typescript
export interface Vulnerability {
  id?: string | VulnerabilityId; // Can be string OR object
  summary?: string;
  severity?: string;
  severities?: VulnerabilitySeverity[]; // Array of another interface
  published?: string;
  publishedAt?: string;
  modified?: string;
  modifiedAt?: string;
  aliases?: unknown[];
  related?: unknown[];
}
```

### Interface for Component Props

From [components/package/StatsCards.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/package/StatsCards.tsx):

```typescript
interface StatsCardsProps {
  data: PackageInsightsData;
}

// Usage:
export function StatsCards({ data }: StatsCardsProps) {
  // data is now typed as PackageInsightsData
}
```

---

## 5. Type Aliases

A **type alias** creates a new name for a type. Use the `type` keyword.

### Simple Type Alias

From [lib/types/insights.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/types/insights.ts):

```typescript
// AvailableVersions is just an array of VersionInfo
export type AvailableVersions = VersionInfo[];
```

### Type Alias from Const

From [lib/api/safedep-insight.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/api/safedep-insight.ts):

```typescript
// Create a list of supported ecosystems
export const SUPPORTED_ECOSYSTEMS = [
  "npm",
  "pypi",
  "go",
  "maven",
  "rubygems",
  "cargo",
  "nuget",
] as const;

// Create a type from that list
export type SupportedEcosystem = (typeof SUPPORTED_ECOSYSTEMS)[number];
// Result: "npm" | "pypi" | "go" | "maven" | "rubygems" | "cargo" | "nuget"
```

### Interface vs Type Alias

| Feature             | Interface         | Type Alias                             |
| ------------------- | ----------------- | -------------------------------------- |
| Object shapes       | ✅ Great for this | ✅ Also works                          |
| Union types         | ❌ Can't do       | ✅ Can do: `type A = string \| number` |
| Extending           | ✅ Use `extends`  | ✅ Use `&` (intersection)              |
| Declaration merging | ✅ Can merge      | ❌ Can't merge                         |

**Rule of thumb:** Use **interface** for object shapes, **type** for unions or complex types.

---

## 6. Optional Properties

The `?` after a property name makes it **optional**.

From [lib/types/insights.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/types/insights.ts):

```typescript
export interface Insight {
  summary?: string; // Optional - may or may not exist
  analysisNote?: string;
  verificationRecord?: string;
  details?: string;
  vulnerabilities?: Vulnerability[];
  dependencies?: DependencyInfo[];
  // ... many more optional properties
}
```

### Why So Many Optionals?

In this project, the API responses don't always include all fields. A package might have:

- Vulnerabilities but no licenses
- Licenses but no scorecard
- Some fields present, others missing

Making properties optional prevents "undefined is not an object" errors.

### Accessing Optional Properties Safely

From [components/package/StatsCards.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/package/StatsCards.tsx):

```typescript
// Optional chaining (?.) safely accesses nested properties
const scorecardScore = projectInsight?.scorecard?.score;
// If projectInsight is undefined, this returns undefined instead of crashing

// Nullish coalescing (??) provides a default value
const vulnerabilitiesCount = data.insight?.vulnerabilities?.length || 0;
```

---

## 7. Union Types

A **union type** allows a value to be one of several types. Use the `|` symbol.

### String or Object Union

From [lib/types/insights.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/types/insights.ts):

```typescript
export interface Vulnerability {
  id?: string | VulnerabilityId; // Can be either a string OR an object
}
```

### Handling Union Types

From [components/tabs/VulnerabilitiesTab.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/tabs/VulnerabilitiesTab.tsx):

```typescript
// Helper to extract vulnerability ID (can be string or object)
const getVulnId = (id: unknown): string => {
  if (!id) return "N/A";
  if (typeof id === "string") return id; // Handle string case
  if (typeof id === "object" && id !== null) {
    // Handle object case
    const idObj = id as { type?: string; value?: string };
    return idObj.value || idObj.type || "N/A";
  }
  return "N/A";
};
```

### Literal Union Types

```typescript
// Only these exact string values are allowed
type Ecosystem =
  | "npm"
  | "pypi"
  | "go"
  | "maven"
  | "rubygems"
  | "cargo"
  | "nuget";
```

---

## 8. Intersection Types

An **intersection type** combines multiple types into one. Use the `&` symbol.

From [components/ui/button.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/ui/button.tsx):

```typescript
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & // All button HTML props
  VariantProps<typeof buttonVariants> & { // Variant and size props
    asChild?: boolean; // Custom asChild prop
  }) {
  // ...
}
```

This means the Button accepts:

1. All standard HTML button props (`onClick`, `disabled`, etc.)
2. All variant props (`variant`, `size`)
3. The custom `asChild` prop

---

## 9. Generics

**Generics** let you write reusable code that works with multiple types.

### Generic Function

From [lib/api/safedep-insight.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/api/safedep-insight.ts):

```typescript
// Promise<T> is a generic - T represents what the promise will resolve to
const client = createPromiseClient(InsightService, transport);
// createPromiseClient is generic - it returns a typed client based on InsightService
```

### React Generic Components

From [components/ui/card.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/ui/card.tsx):

```typescript
function Card({ className, ...props }: React.ComponentProps<"div">) {
  // React.ComponentProps<"div"> is a generic
  // It gives you all the props that a <div> element accepts
}
```

### Understanding `React.ComponentProps<T>`

```typescript
// These get all valid props for that HTML element
React.ComponentProps<"div">; // All div props
React.ComponentProps<"button">; // All button props (onClick, disabled, type, etc.)
React.ComponentProps<"input">; // All input props (value, onChange, placeholder, etc.)
```

### The `typeof` Operator with Generics

From [components/ui/button.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/ui/button.tsx):

```typescript
VariantProps<typeof buttonVariants>;
```

- `buttonVariants` is a value (a function)
- `typeof buttonVariants` gets the TYPE of that value
- `VariantProps<...>` extracts the variant prop types from it

---

## 10. Type Assertions

**Type assertions** tell TypeScript "trust me, I know what type this is."

### The `as` Keyword

From [app/p/[ecosystem]/[name]/[version]/page.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/p/%5Becosystem%5D/%5Bname%5D/%5Bversion%5D/page.tsx):

```typescript
const data = result.data as PackageInsightsData;
// Tell TypeScript: "result.data is definitely PackageInsightsData"

const malysisData = malysisResult.success
  ? (malysisResult.data as MalysisData)
  : undefined;
// Cast the API response to our known type
```

### When to Use Type Assertions

✅ **Good use:** When you know more than TypeScript (like API response shapes)

```typescript
const malysisTarget = (malysisData as any)?.report?.target;
```

⚠️ **Be careful:** Assertions bypass type checking. If you're wrong, you'll get runtime errors!

### Disabling ESLint for `any`

From [components/package/PackageHeader.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/package/PackageHeader.tsx):

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const malysisTarget = hasMalysisData
  ? (malysisData as any)?.report?.target
  : null;
```

This comment disables the "no any" rule for one line. Only use when necessary!

---

## 11. The `unknown` Type

`unknown` is the type-safe version of `any`. You **must** check the type before using it.

From [lib/actions/getPackageMalysis.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/actions/getPackageMalysis.ts):

```typescript
} catch (error: unknown) {
  // Can't do error.message directly - error is unknown!

  // Must check the type first:
  const errorMessage = error instanceof Error ? error.message : String(error);
  //                   ^^^^^^^^^^^^^^^^^^^^^^^^
  //                   Type guard checks if error is an Error
}
```

### `unknown` vs `any`

| Type      | Can assign to it | Can use directly     |
| --------- | ---------------- | -------------------- |
| `any`     | ✅ Anything      | ✅ Yes (unsafe!)     |
| `unknown` | ✅ Anything      | ❌ Must narrow first |

**Always prefer `unknown` over `any`** - it forces you to check types.

---

## 12. Type Guards

**Type guards** are functions or checks that narrow down a type.

### Type Guard Function

From [lib/api/safedep-insight.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/api/safedep-insight.ts):

```typescript
export function isSupportedEcosystem(
  ecosystem: string
): ecosystem is SupportedEcosystem {
  return SUPPORTED_ECOSYSTEMS.includes(
    ecosystem.toLowerCase() as SupportedEcosystem
  );
}
```

The return type `ecosystem is SupportedEcosystem` tells TypeScript:

- If this function returns `true`, then `ecosystem` is definitely a `SupportedEcosystem`
- This narrows the type in subsequent code

### Using Type Guards

```typescript
const eco = "npm"; // Type: string

if (isSupportedEcosystem(eco)) {
  // Inside this block, TypeScript knows eco is SupportedEcosystem
  // eco is now: "npm" | "pypi" | "go" | "maven" | "rubygems" | "cargo" | "nuget"
}
```

### Built-in Type Guards

From [components/tabs/VulnerabilitiesTab.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/tabs/VulnerabilitiesTab.tsx):

```typescript
const getSeverity = (severities: unknown): string | undefined => {
  if (!severities) return undefined; // Filters out null/undefined
  if (typeof severities === "string") return severities; // Type guard for string
  if (Array.isArray(severities) && severities.length > 0) {
    // Type guard for array
    // Inside here, TypeScript knows severities is an array
  }
  if (typeof severities === "object" && severities !== null) {
    // Inside here, TypeScript knows severities is an object
  }
  return undefined;
};
```

---

## 13. Const Assertions

The `as const` assertion makes values **readonly** and **literal**.

From [lib/api/safedep-insight.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/api/safedep-insight.ts):

```typescript
// Without 'as const'
const ECOSYSTEMS = ["npm", "pypi", "go"];
// Type: string[]

// With 'as const'
export const SUPPORTED_ECOSYSTEMS = [
  "npm",
  "pypi",
  "go",
  "maven",
  "rubygems",
  "cargo",
  "nuget",
] as const;
// Type: readonly ["npm", "pypi", "go", "maven", "rubygems", "cargo", "nuget"]
```

### Benefits of `as const`

1. **Literal types:** Values are exact strings, not just `string`
2. **Readonly:** Can't accidentally modify the array
3. **Extract types:** Can create union types from the values

```typescript
// Extract a union type from the const array
type SupportedEcosystem = (typeof SUPPORTED_ECOSYSTEMS)[number];
// Result: "npm" | "pypi" | "go" | "maven" | "rubygems" | "cargo" | "nuget"
```

---

## 14. Index Signatures

**Index signatures** let you define the types for dynamic object keys.

From [components/tabs/VulnerabilitiesTab.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/tabs/VulnerabilitiesTab.tsx):

```typescript
const severityConfig: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  low: {
    label: "Low",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CircleCheck className="w-3.5 h-3.5 mr-1" />,
  },
  medium: {
    /* ... */
  },
  high: {
    /* ... */
  },
  critical: {
    /* ... */
  },
  unspecified: {
    /* ... */
  },
};
```

### The `Record<K, V>` Utility Type

`Record<string, T>` means "an object where any string key maps to type T":

```typescript
Record<string, { label: string; className: string; icon: React.ReactNode }>
// Equivalent to:
{
  [key: string]: { label: string; className: string; icon: React.ReactNode }
}
```

---

## 15. Utility Types

TypeScript provides built-in **utility types** to transform types.

### `Record<Keys, Type>`

Creates an object type with specified keys and value type.

```typescript
Record<string, number>; // { [key: string]: number }
```

### `typeof`

Gets the type of a value.

```typescript
const config = { name: "test", count: 5 };
type ConfigType = typeof config; // { name: string; count: number }
```

### Array Element Access

Get the type of array elements:

```typescript
typeof SUPPORTED_ECOSYSTEMS[number];
// Gets the type of any element in the array
```

### `Promise<T>`

Represents an async value:

```typescript
async function fetchData(): Promise<PackageInsightsData> {
  // Returns a promise that resolves to PackageInsightsData
}
```

---

## 16. Function Types

Functions in TypeScript can have typed parameters and return values.

### Basic Function Types

From [lib/api/safedep-insight.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/api/safedep-insight.ts):

```typescript
// Function with typed parameters and return type
export function mapEcosystem(ecosystem: string): Ecosystem {
  switch (ecosystem.toLowerCase()) {
    case "npm":
      return Ecosystem.NPM;
    // ...
    default:
      throw new Error(`Unsupported ecosystem: ${ecosystem}`);
  }
}
```

### Object Parameter Destructuring

From [lib/api/safedep-insight.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/api/safedep-insight.ts):

```typescript
export async function fetchPackageInsights(params: {
  ecosystem: string;
  name: string;
  version: string;
}) {
  // params is an object with three required string properties
}
```

### Arrow Functions with Types

From [lib/api/safedep-insight.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/api/safedep-insight.ts):

```typescript
function authenticationInterceptor(token: string, tenant: string): Interceptor {
  return (next) => async (req) => {
    // Arrow function returning arrow function
    req.header.set("authorization", token);
    req.header.set("x-tenant-id", tenant);
    return await next(req);
  };
}
```

### Function Type as Parameter

```typescript
// Interceptor is a function type that the library defines
type Interceptor = (next: NextFn) => (req: Request) => Promise<Response>;
```

---

## 17. Async/Await with Types

Async functions return `Promise<T>` where T is the resolved type.

From [lib/api/safedep-insight.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/api/safedep-insight.ts):

```typescript
export async function fetchPackageInsights(params: {
  ecosystem: string;
  name: string;
  version: string;
}) {
  // async function - always returns a Promise

  const response = await client.getPackageVersionInsight({...});
  // await unwraps the Promise, response is the resolved value

  return response.toJson();
  // Return value is wrapped in Promise automatically
}
```

### Handling Async Props in Next.js 15

From [app/p/[ecosystem]/[name]/[version]/page.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/p/%5Becosystem%5D/%5Bname%5D/%5Bversion%5D/page.tsx):

```typescript
type PageProps = {
  params: Promise<{
    // In Next.js 15, params is a Promise!
    ecosystem: string;
    name: string;
    version: string;
  }>;
};

export default async function PackagePage({ params }: PageProps) {
  const resolvedParams = await params; // Must await to get values
  // Now resolvedParams.ecosystem, resolvedParams.name, etc. are available
}
```

---

## 18. React with TypeScript

This project uses React with TypeScript extensively.

### Functional Components

From [components/package/StatsCards.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/package/StatsCards.tsx):

```typescript
interface StatsCardsProps {
  data: PackageInsightsData;
}

export function StatsCards({ data }: StatsCardsProps) {
  // Function component with typed props
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">{/* ... */}</div>
  );
}
```

### Using `React.ComponentProps<T>`

From [components/ui/card.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/ui/card.tsx):

```typescript
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("bg-card ...", className)}
      {...props} // Spread all other div props
    />
  );
}
```

### Using `React.ReactNode`

`ReactNode` is the type for anything React can render (elements, strings, null, etc.):

```typescript
// From VulnerabilitiesTab.tsx
const severityConfig: Record<
  string,
  { label: string; className: string; icon: React.ReactNode } // icon can be any renderable
> = {
  low: {
    icon: <CircleCheck className="w-3.5 h-3.5 mr-1" />, // JSX element
  },
  // ...
};
```

### Client Components with Hooks

From [components/tabs/VersionsTab.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/tabs/VersionsTab.tsx):

```typescript
"use client"; // Mark as client component for hooks

import { useState } from "react";

export function VersionsTab({
  data,
  packageName,
  ecosystem,
}: VersionsTabProps) {
  const [visibleCount, setVisibleCount] = useState(VERSIONS_PER_PAGE);
  // useState<number> is inferred from initial value

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + VERSIONS_PER_PAGE);
    // prev is typed as number
  };
}
```

### useEffect with Dependencies

From [app/p/[ecosystem]/[name]/[version]/DebugLogger.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/p/%5Becosystem%5D/%5Bname%5D/%5Bversion%5D/DebugLogger.tsx):

```typescript
export function DebugLogger({
  data,
  label = "Debug Data",
}: {
  data: unknown; // Accept any data type
  label?: string; // Optional with default value
}) {
  useEffect(() => {
    console.log(`[${label}]`, data);
  }, [data, label]); // Dependency array

  return null; // Renders nothing
}
```

---

## 19. Module Imports and Exports

TypeScript uses ES modules for organizing code.

### Named Exports

From [lib/types/insights.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/types/insights.ts):

```typescript
// Export individual types
export interface PackageInfo { ... }
export interface PackageVersion { ... }
export type AvailableVersions = VersionInfo[];
```

### Importing Named Exports

From [components/package/StatsCards.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/package/StatsCards.tsx):

```typescript
import { PackageInsightsData } from "@/lib/types/insights";
// Import specific type from the file

import { Card, CardContent } from "@/components/ui/card";
// Import multiple named exports
```

### Import Type Only

When you only need the type (not the value), use `type`:

```typescript
import { type ClassValue } from "clsx";
// or
import type { SomeType } from "./types";
```

### Path Aliases

The `@/` alias is defined in `tsconfig.json`:

```typescript
import { cn } from "@/lib/utils";
// Equivalent to: import { cn } from "./lib/utils"
```

### Re-exporting

From [components/ui/card.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/ui/card.tsx):

```typescript
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
```

---

## 20. Type Inference

TypeScript is smart about **inferring types** - you don't always need to write them.

### Variable Inference

```typescript
const version = data.packageVersion?.version || "N/A";
// TypeScript knows version is string

const vulnerabilitiesCount = data.insight?.vulnerabilities?.length || 0;
// TypeScript knows vulnerabilitiesCount is number

const versions = Array.isArray(rawVersions) ? rawVersions : [];
// TypeScript knows versions is an array
```

### Function Return Type Inference

```typescript
function formatDate(dateString?: string) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {...});
  } catch {
    return dateString;
  }
}
// TypeScript infers return type: string
```

### Array Methods

```typescript
const sortedVersions = [...versions].sort((a, b) => {
  // TypeScript knows a and b are VersionInfo objects
  if (a.defaultVersion && !b.defaultVersion) return -1;
  const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
  // ...
});
```

### When to Add Explicit Types

Add explicit types when:

1. **Function parameters** - TypeScript can't infer these
2. **Empty arrays or objects** - Type is too broad (`any[]` or `{}`)
3. **API responses** - TypeScript can't know the shape
4. **Public APIs** - Makes intentions clear

---

## Summary

| Concept         | Syntax                         | When to Use                      |
| --------------- | ------------------------------ | -------------------------------- |
| Interface       | `interface Name { }`           | Object shapes, component props   |
| Type Alias      | `type Name = ...`              | Union types, aliases             |
| Optional        | `prop?: type`                  | Properties that might not exist  |
| Union           | `type A \| type B`             | Multiple possible types          |
| Intersection    | `type A & type B`              | Combine types                    |
| Generic         | `Type<T>`                      | Reusable type patterns           |
| Type Assertion  | `value as Type`                | Override TypeScript's inference  |
| Type Guard      | `typeof`, `instanceof`, custom | Narrow types safely              |
| Const Assertion | `as const`                     | Make values literal and readonly |

---

## Next Steps

1. Read through the actual files in `lib/types/` to see types in context
2. Hover over variables in VS Code to see inferred types
3. Try changing types and see what errors appear
4. Practice by adding types to untyped JavaScript code

Happy TypeScripting! 🎉
