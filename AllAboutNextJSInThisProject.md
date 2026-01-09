# All About Next.js in SafeDep Insights

A beginner-friendly guide to understanding all the Next.js concepts used in this project, organized by topic.

---

## Table of Contents

1. [What is Next.js?](#1-what-is-nextjs)
2. [Project Structure](#2-project-structure)
3. [The App Router](#3-the-app-router)
4. [Page Components](#4-page-components)
5. [Layout Components](#5-layout-components)
6. [Dynamic Routes](#6-dynamic-routes)
7. [Server Components vs Client Components](#7-server-components-vs-client-components)
8. [Server Actions](#8-server-actions)
9. [Data Fetching](#9-data-fetching)
10. [The Link Component](#10-the-link-component)
11. [The Image Component](#11-the-image-component)
12. [Font Optimization](#12-font-optimization)
13. [Metadata and SEO](#13-metadata-and-seo)
14. [Environment Variables](#14-environment-variables)
15. [Next.js Configuration](#15-nextjs-configuration)
16. [CSS and Styling](#16-css-and-styling)
17. [Path Aliases](#17-path-aliases)
18. [React 19 Features](#18-react-19-features)
19. [Development Scripts](#19-development-scripts)
20. [File Conventions](#20-file-conventions)
21. [**Next.js vs React: Key Differences**](#21-nextjs-vs-react-key-differences-explained) ⭐ NEW!


---

## 1. What is Next.js?

**Next.js** is a React framework that provides:

- **Server-side rendering (SSR)** - Pages render on the server for better SEO
- **File-based routing** - Create routes by adding files
- **API routes** - Build backend APIs in the same project
- **Optimizations** - Automatic image, font, and script optimization
- **Full-stack capabilities** - Server and client code in one project

### Version Used in This Project

From [package.json](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/package.json):

```json
{
  "dependencies": {
    "next": "16.1.1", // Next.js 16 (latest!)
    "react": "19.2.3", // React 19
    "react-dom": "19.2.3"
  }
}
```

This project uses **Next.js 16** with the **App Router** (the modern routing system).

---

## 2. Project Structure

Here's how this Next.js project is organized:

```
safedep-insights/
├── app/                      # 👈 App Router (routes live here)
│   ├── layout.tsx           # Root layout (wraps all pages)
│   ├── page.tsx             # Home page (/)
│   ├── globals.css          # Global styles
│   ├── favicon.ico          # Site icon
│   └── p/                   # Package routes
│       └── [ecosystem]/
│           └── [name]/
│               └── [version]/
│                   └── page.tsx  # Dynamic route page
│
├── components/              # 👈 Reusable React components
│   ├── header/
│   │   └── Header.tsx
│   ├── package/
│   │   ├── PackageHeader.tsx
│   │   └── StatsCards.tsx
│   ├── tabs/
│   │   ├── PackageTabs.tsx
│   │   └── ...
│   └── ui/                  # UI primitives (Button, Card, etc.)
│
├── lib/                     # 👈 Utilities and shared code
│   ├── api/                # API client functions
│   ├── actions/            # Server Actions
│   ├── types/              # TypeScript types
│   └── utils.ts            # Helper functions
│
├── public/                  # 👈 Static files (images, etc.)
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

### Key Directories

| Directory     | Purpose                                 |
| ------------- | --------------------------------------- |
| `app/`        | Routes, layouts, and pages (App Router) |
| `components/` | Reusable React components               |
| `lib/`        | Shared utilities, API clients, types    |
| `public/`     | Static assets served at root URL        |

---

## 3. The App Router

Next.js 13+ introduced the **App Router** which lives in the `app/` directory. This project uses it exclusively.

### How It Works

The folder structure **IS** your URL structure:

```
app/
├── page.tsx                          →  /
└── p/
    └── [ecosystem]/
        └── [name]/
            └── [version]/
                └── page.tsx          →  /p/:ecosystem/:name/:version
```

### Example URLs

| File Path                                     | URL                     |
| --------------------------------------------- | ----------------------- |
| `app/page.tsx`                                | `/`                     |
| `app/p/[ecosystem]/[name]/[version]/page.tsx` | `/p/npm/lodash/4.17.21` |

---

## 4. Page Components

A **page** is the UI shown for a specific route. Create `page.tsx` in any folder.

### Home Page

From [app/page.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/page.tsx):

```tsx
import Image from "next/image";

export default function Home() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-1/2 flex flex-col gap-10 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <img
        className="h-10"
        src="https://mintcdn.com/safedep/..."
        alt="safedep logo"
      />
      <h1 className="text-[2vw] font-bold text-gray-400">
        Welcome to SafeDep Insights
      </h1>
    </div>
  );
}
```

### Key Points About Pages

1. **Must export default** - The function component must be the default export
2. **Named `page.tsx`** - This exact filename is required
3. **Server Components by default** - Pages run on the server unless you add `"use client"`

---

## 5. Layout Components

A **layout** wraps pages and persists across navigations. Every app needs at least a root layout.

### Root Layout

From [app/layout.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/layout.tsx):

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header/Header";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Page metadata (SEO)
export const metadata: Metadata = {
  title: "SafeDep Insights - Package Security Analysis",
  description:
    "Analyze open source packages for security vulnerabilities, licenses, and more with SafeDep.",
};

// The layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
        suppressHydrationWarning
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### What This Layout Does

1. **Imports global CSS** - `./globals.css` applies to all pages
2. **Loads optimized fonts** - Geist Sans and Geist Mono from Google Fonts
3. **Defines metadata** - Title and description for SEO
4. **Renders common UI** - The `<Header />` appears on every page
5. **Wraps children** - `{children}` is where the page content goes

### Layout Hierarchy

```
RootLayout (app/layout.tsx)
└── children
    ├── Home Page (app/page.tsx)
    └── Package Page (app/p/.../page.tsx)
```

The `<Header />` renders once and stays mounted as you navigate between pages!

---

## 6. Dynamic Routes

**Dynamic routes** have segments that change based on the URL. Use brackets `[]` in folder names.

### Example: Package Details Route

```
app/p/[ecosystem]/[name]/[version]/page.tsx
       ↑           ↑      ↑
       Dynamic segments - captured as params
```

**URL:** `/p/npm/lodash/4.17.21`
**Params:** `{ ecosystem: "npm", name: "lodash", version: "4.17.21" }`

### Accessing Dynamic Params

From [app/p/[ecosystem]/[name]/[version]/page.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/p/%5Becosystem%5D/%5Bname%5D/%5Bversion%5D/page.tsx):

```tsx
// In Next.js 15+, params is a Promise!
type PageProps = {
  params: Promise<{
    ecosystem: string;
    name: string;
    version: string;
  }>;
};

export default async function PackagePage({ params }: PageProps) {
  // Must await the params in Next.js 15+
  const resolvedParams = await params;

  console.log(resolvedParams.ecosystem); // "npm"
  console.log(resolvedParams.name); // "lodash"
  console.log(resolvedParams.version); // "4.17.21"

  // Fetch data using these params
  const result = await getPackageInsights(resolvedParams);
  // ...
}
```

### Important: Next.js 15+ Change

In Next.js 15+, `params` is a **Promise** that must be awaited. This is different from earlier versions where params was a plain object.

```tsx
// ❌ Old way (Next.js 14 and earlier)
function Page({ params }) {
  const { ecosystem } = params; // Direct access
}

// ✅ New way (Next.js 15+)
async function Page({ params }) {
  const { ecosystem } = await params; // Must await!
}
```

---

## 7. Server Components vs Client Components

This is one of the most important Next.js concepts!

### Server Components (Default)

By default, all components in the `app/` directory are **Server Components**:

- Run on the server only
- Can directly access databases, APIs, file system
- Cannot use hooks like `useState`, `useEffect`
- Cannot use browser APIs
- Better for SEO and initial load performance

**Example - Server Component:**

From [app/p/[ecosystem]/[name]/[version]/page.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/p/%5Becosystem%5D/%5Bname%5D/%5Bversion%5D/page.tsx):

```tsx
// No "use client" = Server Component

import { getPackageInsights } from "@/lib/actions/getPackageInsights";

export default async function PackagePage({ params }) {
  const resolvedParams = await params;

  // This runs on the server!
  const result = await getPackageInsights(resolvedParams);

  return <div>{/* Render data */}</div>;
}
```

### Client Components

Add `"use client"` at the top of the file to make it a **Client Component**:

- Run in the browser
- Can use React hooks (`useState`, `useEffect`, etc.)
- Can use browser APIs
- Required for interactivity

**Example - Client Component:**

From [components/tabs/VersionsTab.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/tabs/VersionsTab.tsx):

```tsx
"use client"; // 👈 This makes it a Client Component

import { useState } from "react";
import Link from "next/link";

export function VersionsTab({ data, packageName, ecosystem }) {
  // useState works because this is a Client Component
  const [visibleCount, setVisibleCount] = useState(5);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div>
      <Button onClick={handleLoadMore}>Load More</Button>
    </div>
  );
}
```

### Comparison Table

| Feature                  | Server Component | Client Component |
| ------------------------ | ---------------- | ---------------- |
| `"use client"` directive | ❌ No            | ✅ Yes           |
| React hooks              | ❌ No            | ✅ Yes           |
| Browser APIs             | ❌ No            | ✅ Yes           |
| Async component          | ✅ Yes           | ❌ No            |
| Direct data fetching     | ✅ Yes           | ❌ No            |
| Bundle size              | ✅ Smaller       | ❌ Larger        |
| SEO                      | ✅ Better        | ❌ Requires care |

### Client Component Examples in This Project

| File                                                                                                                                      | Why It's a Client Component            |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [PackageTabs.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/tabs/PackageTabs.tsx)                                | Uses Radix UI tabs with built-in state |
| [VersionsTab.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/tabs/VersionsTab.tsx)                                | Uses `useState` for pagination         |
| [DebugLogger.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/p/%5Becosystem%5D/%5Bname%5D/%5Bversion%5D/DebugLogger.tsx) | Uses `useEffect` to log to console     |

---

## 8. Server Actions

**Server Actions** are functions that run on the server but can be called from client components. They're marked with `"use server"`.

### Why Use Server Actions?

- Secure server-side logic
- Database mutations
- API calls with secrets
- Form handling

### Example Server Action

From [lib/actions/getPackageInsights.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/actions/getPackageInsights.ts):

```tsx
"use server"; // 👈 This marks it as a Server Action

import { fetchPackageInsights } from "@/lib/api/safedep-insight";

export async function getPackageInsights(params: {
  ecosystem: string;
  name: string;
  version: string;
}) {
  try {
    // This runs on the SERVER
    // Can safely use API keys and secrets
    const data = await fetchPackageInsights(params);
    return { success: true, data };
  } catch (error) {
    console.error("SafeDep API error:", error);
    return {
      success: false,
      error: "Failed to fetch package insights",
    };
  }
}
```

### Calling Server Actions

From a Server Component (direct call):

```tsx
// In a Server Component page
const result = await getPackageInsights(params);
```

From a Client Component (still works!):

```tsx
"use client";

import { getPackageInsights } from "@/lib/actions/getPackageInsights";

function MyComponent() {
  const handleClick = async () => {
    const result = await getPackageInsights({
      /* params */
    });
    // Result is returned from the server
  };
}
```

### Server Actions in This Project

| File                                                                                                               | Purpose                                            |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| [getPackageInsights.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/actions/getPackageInsights.ts) | Fetches package security insights from SafeDep API |
| [getPackageMalysis.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/actions/getPackageMalysis.ts)   | Fetches malware analysis data                      |

---

## 9. Data Fetching

Next.js supports multiple data fetching patterns.

### Pattern 1: Async Server Components

The simplest pattern - just make your component `async`:

From [app/p/[ecosystem]/[name]/[version]/page.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/p/%5Becosystem%5D/%5Bname%5D/%5Bversion%5D/page.tsx):

```tsx
export default async function PackagePage({ params }: PageProps) {
  const resolvedParams = await params;

  // Fetch data directly in the component
  const result = await getPackageInsights(resolvedParams);
  const malysisResult = await getPackageMalysis(resolvedParams);

  // Handle errors
  if (!result.success) {
    return <ErrorUI />;
  }

  // Render with data
  return (
    <div>
      <PackageHeader data={result.data} />
      <StatsCards data={result.data} />
    </div>
  );
}
```

### Pattern 2: Parallel Data Fetching

For multiple independent requests, fetch in parallel:

```tsx
// ✅ Good - parallel fetching
const [result, malysisResult] = await Promise.all([
  getPackageInsights(params),
  getPackageMalysis(params),
]);

// ❌ Bad - sequential (slower)
const result = await getPackageInsights(params);
const malysisResult = await getPackageMalysis(params);
```

### Pattern 3: Passing Data to Client Components

Server components fetch data, then pass to client components as props:

```tsx
// Server Component (page.tsx)
export default async function Page() {
  const data = await fetchData(); // Server-side fetch

  return <ClientComponent data={data} />; // Pass to client
}

// Client Component
("use client");
function ClientComponent({ data }) {
  const [filter, setFilter] = useState(""); // Can use hooks now
  return <div>{/* Interactive UI */}</div>;
}
```

---

## 10. The Link Component

Use Next.js `Link` for navigation instead of `<a>` tags.

### Why Use Link?

- **Client-side navigation** - No full page reload
- **Prefetching** - Preloads linked pages in background
- **Preserves state** - Layout components stay mounted

### Basic Usage

From [components/header/Header.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/header/Header.tsx):

```tsx
import Link from "next/link";

export function Header() {
  return (
    <Link
      href="https://github.com/apps/safedep"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button>Install GitHub App</Button>
    </Link>
  );
}
```

### Internal Navigation

From [components/tabs/VersionsTab.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/components/tabs/VersionsTab.tsx):

```tsx
import Link from "next/link";

// Dynamic route with template literal
<Link
  href={`/p/${ecosystem.toLowerCase()}/${packageName}/${ver.version}`}
  className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
>
  View Version
</Link>;
```

### Link vs Anchor Tag

| Feature             | `<Link>`       | `<a>`          |
| ------------------- | -------------- | -------------- |
| Internal navigation | ✅ Client-side | ❌ Full reload |
| External links      | ✅ Works       | ✅ Works       |
| Prefetching         | ✅ Automatic   | ❌ No          |
| SEO                 | ✅ Same        | ✅ Same        |

**Rule:** Use `Link` for internal navigation, `<a>` is fine for external links.

---

## 11. The Image Component

Next.js `Image` component optimizes images automatically.

### Features

- **Automatic resizing** - Serves appropriate size for device
- **Lazy loading** - Loads images as they enter viewport
- **Format conversion** - Serves WebP/AVIF when supported
- **Prevents layout shift** - Requires dimensions

### Usage

```tsx
import Image from "next/image";

// For local images (in /public)
<Image
  src="/logo.png"
  alt="SafeDep Logo"
  width={120}
  height={40}
/>

// For external images
<Image
  src="https://example.com/image.png"
  alt="External image"
  width={200}
  height={100}
/>
```

### In This Project

The project uses regular `<img>` tags for external CDN images:

```tsx
<img
  className="h-10"
  src="https://mintcdn.com/safedep/..."
  alt="safedep logo"
/>
```

For external images with `next/image`, you'd need to configure allowed domains in `next.config.ts`.

---

## 12. Font Optimization

Next.js optimizes fonts with `next/font`.

### Benefits

- **Zero layout shift** - Fonts are preloaded
- **Self-hosted** - No requests to Google at runtime
- **Automatic subset** - Only loads characters you need

### Usage in This Project

From [app/layout.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/layout.tsx):

```tsx
import { Geist, Geist_Mono } from "next/font/google";

// Load font with options
const geistSans = Geist({
  variable: "--font-geist-sans",  // CSS variable name
  subsets: ["latin"],             // Character subsets
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Apply to body
<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
```

### Using the Font Variables in CSS

From [app/globals.css](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/globals.css):

```css
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

Now you can use `font-sans` and `font-mono` in Tailwind classes!

---

## 13. Metadata and SEO

Next.js provides built-in SEO support through the `metadata` export.

### Basic Metadata

From [app/layout.tsx](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/layout.tsx):

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SafeDep Insights - Package Security Analysis",
  description:
    "Analyze open source packages for security vulnerabilities, licenses, and more with SafeDep.",
};
```

This generates:

```html
<head>
  <title>SafeDep Insights - Package Security Analysis</title>
  <meta name="description" content="Analyze open source packages..." />
</head>
```

### Dynamic Metadata

For dynamic routes, you can generate metadata based on params:

```tsx
// In app/p/[ecosystem]/[name]/[version]/page.tsx
export async function generateMetadata({ params }) {
  const { name, version } = await params;

  return {
    title: `${name}@${version} - SafeDep Insights`,
    description: `Security analysis for ${name} version ${version}`,
  };
}
```

### Available Metadata Fields

```tsx
export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
  keywords: ["security", "npm", "packages"],
  openGraph: {
    title: "OG Title",
    description: "OG Description",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

---

## 14. Environment Variables

Next.js handles environment variables securely.

### File: `.env.local`

```env
SAFEDEP_API_KEY=your-api-key-here
SAFEDEP_TENANT_ID=your-tenant-id
```

### Accessing in Server Code

From [lib/api/safedep-insight.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/api/safedep-insight.ts):

```tsx
export async function fetchPackageInsights(params) {
  // process.env works in Server Components and Server Actions
  const token = process.env.SAFEDEP_API_KEY;
  const tenantId = process.env.SAFEDEP_TENANT_ID;

  if (!token || !tenantId) {
    throw new Error("SAFEDEP_API_KEY or SAFEDEP_TENANT_ID missing");
  }

  // Use secrets safely...
}
```

### Environment Variable Rules

| Prefix         | Server Access | Client Access |
| -------------- | ------------- | ------------- |
| None           | ✅ Yes        | ❌ No         |
| `NEXT_PUBLIC_` | ✅ Yes        | ✅ Yes        |

```env
# Only accessible on server (safe for secrets)
API_KEY=secret123

# Accessible everywhere (public values only!)
NEXT_PUBLIC_APP_URL=https://example.com
```

---

## 15. Next.js Configuration

Configuration is in `next.config.ts` (TypeScript) or `next.config.js` (JavaScript).

### This Project's Config

From [next.config.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/next.config.ts):

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true, // Enable React Compiler (experimental)
};

export default nextConfig;
```

### Common Configuration Options

```ts
const nextConfig: NextConfig = {
  // Enable React Compiler for automatic optimizations
  reactCompiler: true,

  // Allow external images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },

  // Custom redirects
  async redirects() {
    return [
      {
        source: "/old-path",
        destination: "/new-path",
        permanent: true,
      },
    ];
  },

  // Environment variables
  env: {
    CUSTOM_VAR: "value",
  },
};
```

---

## 16. CSS and Styling

This project uses **Tailwind CSS 4** for styling.

### Global Styles

From [app/globals.css](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/app/globals.css):

```css
@import "tailwindcss";
@import "tw-animate-css";

/* Custom dark mode variant */
@custom-variant dark (&:is(.dark *));

/* Tailwind theme customization */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --bg-brand: #3a9789;
  --bg-brand-hover: #337f73;
  /* ... more custom theme values */
}

/* CSS Variables for light mode */
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  /* ... */
}

/* CSS Variables for dark mode */
.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  /* ... */
}

/* Base layer styles */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Using Styles in Components

```tsx
// Tailwind classes directly
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

// Custom theme variables
<button className="bg-[#3A9789] hover:bg-[#337f73]">

// Responsive design
<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
```

### CSS-in-JS with cn() Utility

From [lib/utils.ts](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/lib/utils.ts):

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Usage:

```tsx
<div className={cn(
  "base-styles",
  isActive && "active-styles",
  className  // Allow overrides from props
)}>
```

---

## 17. Path Aliases

Path aliases make imports cleaner and easier to manage.

### Configuration

From [tsconfig.json](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/tsconfig.json):

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Usage

```tsx
// ❌ Without alias (messy relative paths)
import { Button } from "../../../components/ui/button";
import { PackageInsightsData } from "../../lib/types/insights";

// ✅ With alias (clean absolute paths)
import { Button } from "@/components/ui/button";
import { PackageInsightsData } from "@/lib/types/insights";
```

The `@/` means "project root", so:

- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/app` → `./app`

---

## 18. React 19 Features

This project uses **React 19**, which includes new features:

### Async Server Components

React 19 allows components to be `async`:

```tsx
// Only works in React 19+
export default async function Page() {
  const data = await fetchData(); // Direct await in component!
  return <div>{data}</div>;
}
```

### Promise Params in Next.js

Next.js 15 with React 19 passes params as Promises:

```tsx
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params; // Await the params
}
```

### React Compiler

Enabled in `next.config.ts`:

```ts
const nextConfig = {
  reactCompiler: true, // Automatic memoization, no more useMemo/useCallback!
};
```

The React Compiler automatically optimizes your components, reducing the need for manual `useMemo`, `useCallback`, and `React.memo`.

---

## 19. Development Scripts

From [package.json](file:///home/sapnendra/Desktop/SafeDep/safedep-insights/package.json):

```json
{
  "scripts": {
    "dev": "next dev", // Start development server
    "build": "next build", // Create production build
    "start": "next start", // Start production server
    "lint": "eslint" // Run ESLint
  }
}
```

### Running the Scripts

```bash
# Development (with hot reload)
npm run dev
# Opens at http://localhost:3000

# Production build
npm run build

# Start production server
npm run start

# Check for linting errors
npm run lint
```

---

## 20. File Conventions

Next.js uses special file names in the `app/` directory:

| File            | Purpose                                   |
| --------------- | ----------------------------------------- |
| `page.tsx`      | The UI for a route                        |
| `layout.tsx`    | Shared layout that wraps pages            |
| `loading.tsx`   | Loading UI (shown while fetching)         |
| `error.tsx`     | Error UI (shown when errors occur)        |
| `not-found.tsx` | 404 page                                  |
| `route.ts`      | API route handler                         |
| `template.tsx`  | Like layout, but re-renders on navigation |

### What This Project Uses

| File          | Location                                      | Purpose                 |
| ------------- | --------------------------------------------- | ----------------------- |
| `page.tsx`    | `app/page.tsx`                                | Home page               |
| `page.tsx`    | `app/p/[ecosystem]/[name]/[version]/page.tsx` | Package details         |
| `layout.tsx`  | `app/layout.tsx`                              | Root layout with header |
| `globals.css` | `app/globals.css`                             | Global styles           |
| `favicon.ico` | `app/favicon.ico`                             | Browser tab icon        |

### Route Groups (Optional)

You can organize routes without affecting URLs using parentheses:

```
app/
├── (marketing)/
│   └── about/
│       └── page.tsx    →  /about
└── (app)/
    └── dashboard/
        └── page.tsx    →  /dashboard
```

---

## 21. Next.js vs React: Key Differences Explained

This section compares how you'd do things in **plain React** (like Create React App or Vite) versus **Next.js**. This helps understand what Next.js adds on top of React.

---

### 21.1 Routing: React Router vs Next.js App Router

**The Problem:** In React, there's no built-in routing. You need to install a library.

#### Plain React (with React Router)

```tsx
// 1. Install react-router-dom
// npm install react-router-dom

// 2. Create components anywhere
// src/pages/Home.jsx
export function Home() {
  return <h1>Home</h1>;
}

// src/pages/PackageDetails.jsx
export function PackageDetails() {
  return <h1>Package Details</h1>;
}

// 3. Manually configure routes in App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { PackageDetails } from "./pages/PackageDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/p/:ecosystem/:name/:version"
          element={<PackageDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}
```

#### Next.js (App Router)

```tsx
// Just create files in the right folders - that's it!

// app/page.tsx → Route: /
export default function Home() {
  return <h1>Home</h1>;
}

// app/p/[ecosystem]/[name]/[version]/page.tsx → Route: /p/:ecosystem/:name/:version
export default function PackageDetails() {
  return <h1>Package Details</h1>;
}

// No configuration needed! The folder structure IS the routing.
```

#### Comparison

| Aspect           | React + React Router              | Next.js App Router    |
| ---------------- | --------------------------------- | --------------------- |
| Setup            | Install library, configure routes | Just create files     |
| Route definition | In code (`<Route path="..." />`)  | Folder structure      |
| Dynamic routes   | `:param` in path                  | `[param]` folder name |
| Learning curve   | Moderate                          | Lower                 |
| Maintenance      | Manual sync                       | Automatic             |

---

### 21.2 Data Fetching: useEffect vs Server Components

**The Problem:** Fetching data in React requires managing loading states, errors, and effects.

#### Plain React (useEffect pattern)

```tsx
import { useState, useEffect } from "react";

function PackagePage({ ecosystem, name, version }) {
  // 1. Manage loading state
  const [isLoading, setIsLoading] = useState(true);

  // 2. Manage error state
  const [error, setError] = useState(null);

  // 3. Manage data state
  const [data, setData] = useState(null);

  // 4. Fetch in useEffect
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/package/${ecosystem}/${name}/${version}`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [ecosystem, name, version]); // Don't forget dependencies!

  // 5. Handle all states in render
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h1>
        {data.name}@{data.version}
      </h1>
      {/* ... */}
    </div>
  );
}
```

**Issues with this approach:**

- ❌ Verbose boilerplate code
- ❌ Easy to forget dependency array
- ❌ Data fetches AFTER component mounts (slower)
- ❌ Loading spinner shows to users (bad UX)
- ❌ Not SEO-friendly (search engines see empty page)

#### Next.js (Async Server Components)

```tsx
// Just make the component async - that's it!

export default async function PackagePage({ params }) {
  const { ecosystem, name, version } = await params;

  // Fetch directly - no useState, no useEffect!
  const result = await getPackageInsights({ ecosystem, name, version });

  // Handle errors simply
  if (!result.success) {
    return <div>Error: Failed to load package</div>;
  }

  return (
    <div>
      <h1>
        {result.data.name}@{result.data.version}
      </h1>
      {/* Data is already available! */}
    </div>
  );
}
```

**Benefits:**

- ✅ No useState/useEffect boilerplate
- ✅ Data fetches BEFORE component renders
- ✅ No loading spinner needed (page loads with data)
- ✅ SEO-friendly (HTML includes content)
- ✅ Simpler mental model

#### Comparison

| Aspect            | React useEffect      | Next.js Server Components      |
| ----------------- | -------------------- | ------------------------------ |
| Code lines        | ~30+ lines           | ~10 lines                      |
| Loading states    | Manual with useState | Automatic (or use loading.tsx) |
| When data fetches | After mount (client) | Before render (server)         |
| Initial HTML      | Empty                | Complete with data             |
| SEO               | Poor                 | Excellent                      |
| Secrets/API keys  | Cannot use directly  | Can use safely                 |

---

### 21.3 Component Types: All Client vs Server/Client Split

**The Problem:** In React, all components run in the browser. This means larger bundles and no direct server access.

#### Plain React (Everything is a "Client Component")

```tsx
// ALL React components run in the browser

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Must call an API endpoint - can't access database directly
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId]);

  // This entire component ships to the browser
  // Including all its dependencies!
  return <div>{user?.name}</div>;
}
```

**Issues:**

- ❌ All code goes to browser bundle (larger downloads)
- ❌ Must create API routes for everything
- ❌ Can't access databases, files, or secrets directly
- ❌ Slower initial page load

#### Next.js (Server + Client Components)

```tsx
// SERVER COMPONENT (default) - runs on server only
// app/profile/page.tsx

import { db } from "@/lib/database"; // Direct database access!

export default async function ProfilePage({ params }) {
  const { userId } = await params;

  // This code NEVER ships to the browser
  const user = await db.users.findById(userId); // Direct DB query!

  // Pass data to interactive client component
  return <ProfileEditor user={user} />;
}

// CLIENT COMPONENT - only this ships to browser
// components/ProfileEditor.tsx
("use client");

export function ProfileEditor({ user }) {
  const [editing, setEditing] = useState(false); // Hooks work here

  return <div onClick={() => setEditing(true)}>{user.name}</div>;
}
```

**Benefits:**

- ✅ Smaller browser bundles (server code stays on server)
- ✅ Direct database/file/secret access
- ✅ Faster initial load
- ✅ Only interactive parts ship to browser

#### Comparison

| Aspect             | React (All Client)  | Next.js (Server + Client)   |
| ------------------ | ------------------- | --------------------------- |
| Where code runs    | All in browser      | Split: server & browser     |
| Bundle size        | Everything          | Only interactive parts      |
| Database access    | Via API routes      | Direct in Server Components |
| API keys/secrets   | Never in components | Safe in Server Components   |
| useState/useEffect | Everywhere          | Only in Client Components   |
| SEO                | Requires extra work | Built-in                    |

---

### 21.4 Layouts: Manual vs Automatic Persistence

**The Problem:** In React, you manually wrap pages with layout components, and they re-render on navigation.

#### Plain React (Manual Layouts)

```tsx
// src/components/Layout.jsx
export function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

// src/App.jsx - Must wrap EVERY route
import { Layout } from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        {/* Repeat for every route... */}
      </Routes>
    </BrowserRouter>
  );
}
```

**Issues:**

- ❌ Must remember to wrap every route
- ❌ Layout re-mounts on every navigation
- ❌ State in layout is lost on navigation
- ❌ Verbose and error-prone

#### Next.js (Automatic Layouts)

```tsx
// app/layout.tsx - Automatically wraps ALL pages
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/page.tsx - Automatically wrapped!
export default function Home() {
  return <h1>Home</h1>;
}

// app/about/page.tsx - Automatically wrapped!
export default function About() {
  return <h1>About</h1>;
}
```

**Benefits:**

- ✅ Define once, applies to all child routes
- ✅ Layout persists across navigation (no re-mount)
- ✅ State in layout is preserved
- ✅ Nested layouts work automatically

#### Comparison

| Aspect             | React (Manual)          | Next.js (Automatic)            |
| ------------------ | ----------------------- | ------------------------------ |
| Definition         | Wrap each route         | Define once                    |
| Persistence        | Re-mounts on navigation | Stays mounted                  |
| State preservation | Lost                    | Preserved                      |
| Nested layouts     | Manual nesting          | Automatic via folder structure |

---

### 21.5 API Calls with Secrets: Exposed vs Protected

**The Problem:** API keys and secrets cannot be safely used in browser code.

#### Plain React (Requires Separate Backend)

```tsx
// ❌ NEVER DO THIS - secrets are exposed in browser!
function fetchData() {
  // This API key will be visible in browser dev tools!
  const response = await fetch("https://api.example.com/data", {
    headers: {
      Authorization: "secret-api-key-123", // EXPOSED!
    },
  });
}

// ✅ Correct way - need a separate backend server
// You must create an Express/Node server or use serverless functions

// backend/server.js (separate project or service)
app.get("/api/proxy-data", async (req, res) => {
  const response = await fetch("https://api.example.com/data", {
    headers: {
      Authorization: process.env.API_KEY, // Safe on server
    },
  });
  res.json(await response.json());
});

// frontend/Component.jsx
function Component() {
  useEffect(() => {
    // Call YOUR backend, not the external API directly
    fetch("/api/proxy-data")
      .then((res) => res.json())
      .then(setData);
  }, []);
}
```

**Issues:**

- ❌ Need separate backend infrastructure
- ❌ More complexity and maintenance
- ❌ Two codebases to manage
- ❌ Deployment complexity

#### Next.js (Server Actions Handle It)

```tsx
// lib/actions/getPackageInsights.ts
"use server"; // This runs on the server only!

export async function getPackageInsights(params) {
  // These secrets are SAFE - this code never reaches the browser
  const token = process.env.SAFEDEP_API_KEY; // ✅ Safe!
  const tenantId = process.env.SAFEDEP_TENANT_ID; // ✅ Safe!

  const response = await fetch("https://api.safedep.io/...", {
    headers: {
      Authorization: token,
      "x-tenant-id": tenantId,
    },
  });

  return response.json();
}

// app/page.tsx - Just call the server action
export default async function Page() {
  const data = await getPackageInsights({ ecosystem: "npm", name: "lodash" });
  return <div>{data.name}</div>;
}
```

**Benefits:**

- ✅ No separate backend needed
- ✅ Secrets stay on server automatically
- ✅ One codebase, simple deployment
- ✅ Type-safe across client and server

#### Comparison

| Aspect             | React (Separate Backend) | Next.js (Server Actions) |
| ------------------ | ------------------------ | ------------------------ |
| Backend needed     | Yes (Express, etc.)      | No (built-in)            |
| Where secrets live | Backend server           | Same project (.env)      |
| Codebases          | 2 (frontend + backend)   | 1                        |
| Deployment         | Complex                  | Simple                   |
| Type safety        | Manual                   | Automatic                |

---

### 21.6 SEO and Meta Tags: React Helmet vs Built-in Metadata

**The Problem:** React doesn't manage `<head>` content. You need external libraries.

#### Plain React (with React Helmet)

```tsx
// 1. Install react-helmet
// npm install react-helmet-async

// 2. Wrap app with HelmetProvider
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <Routes>...</Routes>
    </HelmetProvider>
  );
}

// 3. Use Helmet in each component
import { Helmet } from "react-helmet-async";

function ProductPage({ product }) {
  return (
    <>
      <Helmet>
        <title>{product.name} - My Store</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.image} />
      </Helmet>
      <div>{/* page content */}</div>
    </>
  );
}
```

**Issues:**

- ❌ Extra dependency
- ❌ Must remember to add to every page
- ❌ Client-side only (bad for SEO crawlers)
- ❌ No type safety

#### Next.js (Built-in Metadata)

```tsx
// Static metadata
export const metadata = {
  title: "SafeDep Insights",
  description: "Package security analysis",
  openGraph: {
    images: ["/og-image.png"],
  },
};

// Dynamic metadata - works with route params!
export async function generateMetadata({ params }) {
  const { name, version } = await params;
  const data = await fetchPackageData(name, version);

  return {
    title: `${name}@${version} - SafeDep`,
    description: data.summary,
    openGraph: {
      title: name,
      description: data.summary,
    },
  };
}

export default function Page() {
  return <div>{/* page content */}</div>;
}
```

**Benefits:**

- ✅ No extra dependencies
- ✅ Type-safe with TypeScript
- ✅ Server-rendered (SEO crawlers see it)
- ✅ Static and dynamic options
- ✅ Automatic deduplication

#### Comparison

| Aspect       | React + Helmet     | Next.js Metadata      |
| ------------ | ------------------ | --------------------- |
| Dependencies | react-helmet-async | Built-in              |
| Type safety  | Manual             | Automatic             |
| SSR support  | Limited            | Full                  |
| Location     | In component JSX   | Separate export       |
| Dynamic      | With state         | With generateMetadata |

---

### 21.7 Navigation: Anchor Tags vs Link Component

**The Problem:** Regular `<a>` tags cause full page reloads, losing application state.

#### Plain React (React Router Link)

```tsx
import { Link, useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();

  return (
    <nav>
      {/* React Router Link */}
      <Link to="/about">About</Link>

      {/* Programmatic navigation */}
      <button onClick={() => navigate("/contact")}>Contact</button>
    </nav>
  );
}
```

#### Next.js (next/link)

```tsx
import Link from "next/link";
import { useRouter } from "next/navigation";

function Navigation() {
  const router = useRouter();

  return (
    <nav>
      {/* Next.js Link - automatically prefetches! */}
      <Link href="/about">About</Link>

      {/* Programmatic navigation */}
      <button onClick={() => router.push("/contact")}>Contact</button>
    </nav>
  );
}
```

#### Key Difference: Automatic Prefetching

```tsx
// Next.js Link prefetches pages when they appear in viewport

<Link href="/about">About</Link>
// ↑ When this Link appears on screen, Next.js PRELOADS /about in the background!
// Result: Instant navigation when user clicks

// React Router doesn't do this - navigation feels slower
```

#### Comparison

| Aspect         | React Router Link    | Next.js Link           |
| -------------- | -------------------- | ---------------------- |
| Import         | `react-router-dom`   | `next/link`            |
| Props          | `to="/path"`         | `href="/path"`         |
| Prefetching    | ❌ Manual            | ✅ Automatic           |
| Dynamic routes | `to={`/user/${id}`}` | `href={`/user/${id}`}` |

---

### Quick Reference: When to Use What

| I want to...           | Plain React             | Next.js                |
| ---------------------- | ----------------------- | ---------------------- |
| Create a route         | Configure React Router  | Create `page.tsx` file |
| Fetch data on load     | useEffect + useState    | async Server Component |
| Use interactive UI     | Normal component        | Add `"use client"`     |
| Call API with secrets  | Create backend server   | Use Server Actions     |
| Wrap pages with header | Manual Layout component | Create `layout.tsx`    |
| Set page title/meta    | React Helmet            | Export `metadata`      |
| Navigate between pages | `<Link to="...">`       | `<Link href="...">`    |
| Handle loading states  | useState + isLoading    | Add `loading.tsx`      |
| Handle errors          | try/catch + state       | Add `error.tsx`        |

---

| Concept           | What It Does                          | Key Files                |
| ----------------- | ------------------------------------- | ------------------------ |
| App Router        | File-based routing                    | `app/` directory         |
| Server Components | Render on server, fetch data          | Default in `app/`        |
| Client Components | Interactive UI with hooks             | `"use client"` directive |
| Server Actions    | Server functions callable from client | `"use server"` directive |
| Dynamic Routes    | URL parameters                        | `[param]` folders        |
| Layouts           | Shared UI wrapper                     | `layout.tsx`             |
| Link              | Client-side navigation                | `next/link`              |
| Image             | Optimized images                      | `next/image`             |
| Fonts             | Optimized fonts                       | `next/font`              |
| Metadata          | SEO                                   | `metadata` export        |

---

## Next Steps

1. **Explore the routes** - Navigate through `app/` to see how pages connect
2. **Toggle Server/Client** - Try removing `"use client"` and see what breaks
3. **Add new routes** - Create new folders with `page.tsx` files
4. **Experiment with loading** - Add `loading.tsx` to see loading states
5. **Try error handling** - Add `error.tsx` for graceful error handling

Happy Next.js development! 🚀
