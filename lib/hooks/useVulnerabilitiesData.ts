import { useMemo } from "react";
import { PackageInsightsData, Vulnerability } from "@/lib/types/insights";

interface UseVulnerabilitiesDataParams {
  data: PackageInsightsData;
}

interface ProcessedVulnerability {
  id: string;
  summary: string;
  severity: string | undefined;
  publishedAt: string | undefined;
  modifiedAt: string | undefined;
}

interface VulnerabilitiesData {
  vulnerabilities: ProcessedVulnerability[];
  hasVulnerabilities: boolean;
}

// Helper to extract vulnerability ID (can be string or object with {type, value})
function getVulnId(id: unknown): string {
  if (!id) return "N/A";
  if (typeof id === "string") return id;
  if (typeof id === "object" && id !== null) {
    const idObj = id as { type?: string; value?: string };
    return idObj.value || idObj.type || "N/A";
  }
  return "N/A";
}

// Helper to extract summary (can be string or object)
function getSummary(summary: unknown): string {
  if (!summary) return "No summary available";
  if (typeof summary === "string") return summary;
  if (typeof summary === "object" && summary !== null) {
    const summaryObj = summary as { value?: string; text?: string };
    return summaryObj.value || summaryObj.text || "No summary available";
  }
  return "No summary available";
}

// Helper to extract severity from severities array
function getSeverity(severities: unknown): string | undefined {
  if (!severities) return undefined;
  if (typeof severities === "string") return severities;
  if (Array.isArray(severities) && severities.length > 0) {
    const firstSeverity = severities[0];
    if (typeof firstSeverity === "object" && firstSeverity !== null) {
      const risk = (firstSeverity as { risk?: string }).risk;
      if (risk) {
        return risk.replace("RISK_", "").toLowerCase();
      }
    }
  }
  if (typeof severities === "object" && severities !== null) {
    const sevObj = severities as {
      value?: string;
      level?: string;
      risk?: string;
    };
    return (
      sevObj.risk?.replace("RISK_", "").toLowerCase() ||
      sevObj.value ||
      sevObj.level
    );
  }
  return undefined;
}

export function useVulnerabilitiesData({
  data,
}: UseVulnerabilitiesDataParams): VulnerabilitiesData {
  return useMemo(() => {
    const rawVulnerabilities = data.insight?.vulnerabilities;
    const vulnArray = Array.isArray(rawVulnerabilities)
      ? rawVulnerabilities
      : [];

    const vulnerabilities: ProcessedVulnerability[] = vulnArray.map(
      (
        vuln: Vulnerability & {
          severities?: unknown;
          publishedAt?: string;
          modifiedAt?: string;
        }
      ) => ({
        id: getVulnId(vuln.id),
        summary: getSummary(vuln.summary),
        severity: getSeverity(vuln.severities),
        publishedAt: vuln.publishedAt,
        modifiedAt: vuln.modifiedAt,
      })
    );

    return {
      vulnerabilities,
      hasVulnerabilities: vulnerabilities.length > 0,
    };
  }, [data]);
}

// Format date helper for display
export function formatVulnerabilityDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

// Severity configuration for badges
export interface SeverityConfig {
  label: string;
  className: string;
  iconType: "check" | "alert" | "octagon" | "circle";
}

export function getSeverityConfig(severity?: string): SeverityConfig {
  const severityLower = severity?.toLowerCase() || "unspecified";

  const configs: Record<string, SeverityConfig> = {
    low: {
      label: "Low",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconType: "check",
    },
    medium: {
      label: "Medium",
      className: "bg-amber-50 text-amber-700 border-amber-700",
      iconType: "alert",
    },
    high: {
      label: "High",
      className: "bg-red-50 text-orange-700 text-orange-700 border-orange-700",
      iconType: "octagon",
    },
    critical: {
      label: "Critical",
      className: "bg-red-400 text-red-700 border-red-200",
      iconType: "alert",
    },
    unspecified: {
      label: "Unspecified",
      className: "bg-gray-50 text-gray-600 border-gray-200",
      iconType: "circle",
    },
  };

  return configs[severityLower] || configs.unspecified;
}

export type { ProcessedVulnerability };
