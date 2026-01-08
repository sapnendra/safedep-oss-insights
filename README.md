# SafeDep OSS Insights

A web application for analyzing open source packages for security vulnerabilities, malware, licenses, and other insights. Powered by the SafeDep API.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Supported Ecosystems](#supported-ecosystems)
- [Contributing](#contributing)
- [License](#license)

## Overview

SafeDep OSS Insights is a Next.js application that provides a user-friendly interface to explore security insights for open source packages. It integrates with the SafeDep API to fetch package information including vulnerabilities, license details, version history, and malware analysis results.

## Features

- Package Security Analysis: View detailed security insights for any package version
- Vulnerability Tracking: Browse known vulnerabilities with severity ratings
- License Information: Check package licenses and compliance details
- Version History: Explore all available versions of a package
- Malware Analysis: View malware scan results when available
- Scorecard Integration: Access OpenSSF Scorecard data for packages
- Multi-Ecosystem Support: Analyze packages from npm, PyPI, Go, Maven, and more

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.1 |
| Language | TypeScript 5 |
| UI Library | React 19.2.3 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (built on Radix UI primitives) |
| Icons | Lucide React |
| API Client | ConnectRPC (Protobuf/gRPC) |
| Font | Geist (via next/font) |

## Project Structure

```
safedep-insights/
|
|-- app/                          # Next.js App Router
|   |-- globals.css               # Global styles and Tailwind imports
|   |-- layout.tsx                # Root layout with header and metadata
|   |-- page.tsx                  # Home page component
|   |-- p/
|       |-- [ecosystem]/
|           |-- [name]/
|               |-- [version]/
|                   |-- page.tsx       # Dynamic package details page
|                   |-- DebugLogger.tsx # Development debug component
|
|-- components/                   # React components
|   |-- header/
|   |   |-- Header.tsx            # Application header with navigation
|   |
|   |-- package/
|   |   |-- PackageHeader.tsx     # Package info header card
|   |   |-- StatsCards.tsx        # Statistics display cards
|   |
|   |-- tabs/
|   |   |-- PackageTabs.tsx       # Tab container component
|   |   |-- OverviewTab.tsx       # Package overview content
|   |   |-- VulnerabilitiesTab.tsx # Vulnerabilities table
|   |   |-- VersionsTab.tsx       # Version history list
|   |   |-- LicenseTab.tsx        # License information
|   |
|   |-- ui/                       # Reusable UI components
|       |-- badge.tsx
|       |-- button.tsx
|       |-- card.tsx
|       |-- separator.tsx
|       |-- skeleton.tsx
|       |-- table.tsx
|       |-- tabs.tsx
|
|-- lib/                          # Utility functions and API logic
|   |-- utils.ts                  # General utility functions
|   |
|   |-- actions/                  # Server actions
|   |   |-- getPackageInsights.ts # Fetch package insights
|   |   |-- getPackageMalysis.ts  # Fetch malware analysis
|   |
|   |-- api/                      # API integration
|   |   |-- safedep-insight.ts    # SafeDep Insights API client
|   |   |-- safedep-malysis.ts    # SafeDep Malysis API client
|   |   |-- insights-sample.json  # Sample API response (development)
|   |   |-- malysis-sample.json   # Sample malysis response (development)
|   |
|   |-- types/
|       |-- insights.ts           # TypeScript type definitions
|
|-- public/                       # Static assets
|
|-- components.json               # shadcn/ui configuration
|-- eslint.config.mjs             # ESLint configuration
|-- next.config.ts                # Next.js configuration
|-- package.json                  # Dependencies and scripts
|-- postcss.config.mjs            # PostCSS configuration
|-- tailwind.config.ts            # Tailwind CSS configuration (if present)
|-- tsconfig.json                 # TypeScript configuration
```

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun package manager
- SafeDep API credentials (API key and Tenant ID)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/sapnendra/safedep-oss-insights.git
cd safedep-oss-insights
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Configuration

Create a `.env.local` file in the root directory with your SafeDep API credentials:

```env
SAFEDEP_API_KEY=your_api_key_here
SAFEDEP_TENANT_ID=your_tenant_id_here
```

To obtain API credentials:
1. Visit https://safedep.io
2. Sign up or log in to your account
3. Navigate to API settings to generate your credentials

## Running the Application

### Development Server

Start the development server with hot reload:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 in your browser to see the application.

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## Usage

### Viewing Package Insights

Navigate to a package using the URL pattern:

```
http://localhost:3000/p/{ecosystem}/{package-name}/{version}
```

Examples:
- npm package: `http://localhost:3000/p/npm/lodash/4.17.21`
- PyPI package: `http://localhost:3000/p/pypi/requests/2.31.0`
- Go module: `http://localhost:3000/p/go/github.com%2Fgorilla%2Fmux/1.8.0`

### Package Information Tabs

Each package page displays information in four tabs:

1. Overview: Summary, analysis notes, project insights, and scorecard data
2. Vulnerabilities: List of known CVEs with severity ratings
3. Versions: Available versions with publish dates
4. License: License information and compliance details

## API Integration

The application integrates with two SafeDep API services:

### Insights API

Fetches package metadata, vulnerabilities, licenses, dependencies, and scorecard information.

- Endpoint: `https://api.safedep.io`
- Service: `InsightService.getPackageVersionInsight`

### Malysis API

Fetches malware analysis results for packages that have been scanned.

- Endpoint: `https://api.safedep.io`
- Service: `MalwareAnalysisService.queryPackageAnalysis`

Both APIs use ConnectRPC (gRPC-Web) protocol with authentication via headers.

## Supported Ecosystems

The application supports the following package ecosystems:

| Ecosystem | URL Parameter | Example Package |
|-----------|---------------|-----------------|
| npm | `npm` | lodash, react, express |
| PyPI | `pypi` | requests, django, flask |
| Go | `go` | github.com/gorilla/mux |
| Maven | `maven` | org.apache.commons:commons-lang3 |
| RubyGems | `rubygems` | rails, bundler |
| Cargo | `cargo` | serde, tokio |
| NuGet | `nuget` | Newtonsoft.Json |

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please ensure your code follows the existing style and passes linting.

## License

This project is private. See the repository for license details.

---

For more information about SafeDep, visit https://safedep.io
