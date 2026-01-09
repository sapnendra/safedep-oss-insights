// Custom hooks for tab components
export { useOverviewData, formatOverviewText } from "./useOverviewData";
export type { MalysisData } from "./useOverviewData";

export {
  useVulnerabilitiesData,
  formatVulnerabilityDate,
  getSeverityConfig,
} from "./useVulnerabilitiesData";
export type {
  ProcessedVulnerability,
  SeverityConfig,
} from "./useVulnerabilitiesData";

export { useVersionsData, formatVersionDate } from "./useVersionsData";

export {
  useLicenseData,
  getLicenseDisplay,
  getLicenseName,
} from "./useLicenseData";
