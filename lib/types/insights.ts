// TypeScript types for SafeDep Package Insights API response
// Updated to match actual API response structure

export interface PackageInfo {
  ecosystem?: string;
  name?: string;
}

export interface PackageVersion {
  package?: PackageInfo;
  version?: string;
}

export interface VulnerabilitySeverity {
  type?: string;
  score?: string;
  risk?: string;
}

export interface VulnerabilityId {
  type?: string;
  value?: string;
}

export interface Vulnerability {
  id?: string | VulnerabilityId;
  summary?: string;
  severity?: string;
  severities?: VulnerabilitySeverity[];
  published?: string;
  publishedAt?: string;
  modified?: string;
  modifiedAt?: string;
  aliases?: unknown[];
  related?: unknown[];
}

export interface License {
  licenseId?: string;
  name?: string;
  reference?: string;
}

// API returns licenses wrapped in an object
export interface LicensesWrapper {
  licenses?: License[];
}

export interface ScorecardCheck {
  name?: string;
  score?: number;
  reason?: string;
}

export interface Scorecard {
  score?: number;
  checks?: ScorecardCheck[];
  repository?: string;
  commit?: string;
  repo?: {
    name?: string;
    commit?: string;
  };
  date?: string;
}

export interface ProjectSource {
  type?: string;
  name?: string;
  url?: string;
}

export interface ProjectInsight {
  project?: ProjectSource;
  stars?: string;
  forks?: string;
  issues?: {
    open?: string;
  };
  scorecard?: Scorecard;
}

export interface VersionInfo {
  version?: string;
  publishedAt?: string;
  defaultVersion?: boolean;
}

// availableVersions is returned as a direct array from API
export type AvailableVersions = VersionInfo[];

export interface DependencyInfo {
  packageVersion?: PackageVersion;
  relation?: string;
}

export interface DependencyGraph {
  dependencies?: DependencyInfo[];
  dependencyRelations?: unknown[];
}

export interface Insight {
  // Overview fields (may not exist for all packages)
  summary?: string;
  analysisNote?: string;
  verificationRecord?: string;
  details?: string;
  detailsNote?: string;

  // Licenses wrapped in object
  licenses?: LicensesWrapper;

  // Vulnerabilities
  vulnerabilities?: Vulnerability[];

  // Scorecard
  scorecard?: Scorecard;

  // Dependencies
  dependencies?: DependencyInfo[];
  dependencyGraph?: DependencyGraph;

  // Projects - contains GitHub info, scorecard, etc.
  projectInsights?: ProjectInsight[];

  // Available versions (direct array from API)
  availableVersions?: VersionInfo[];

  // Package metadata
  packagePublishedAt?: string;
  registries?: string[];

  // May not be present
  sourceUrl?: string;
  sha256?: string;
  confidence?: string;
  analysedAt?: string;
}

export interface PackageInsightsData {
  packageVersion?: PackageVersion;
  insight?: Insight;
}
