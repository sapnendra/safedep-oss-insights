import { useMemo } from "react";
import { PackageInsightsData, License } from "@/lib/types/insights";

interface UseLicenseDataParams {
  data: PackageInsightsData;
}

interface LicenseData {
  licenses: License[];
  hasLicenses: boolean;
}

export function useLicenseData({ data }: UseLicenseDataParams): LicenseData {
  return useMemo(() => {
    // Licenses is nested: insight.licenses.licenses[]
    const rawLicenses = data.insight?.licenses?.licenses;
    const licenses = Array.isArray(rawLicenses) ? rawLicenses : [];

    return {
      licenses,
      hasLicenses: licenses.length > 0,
    };
  }, [data]);
}

// Helper to get license display name
export function getLicenseDisplay(license: License): string {
  return license.licenseId || license.name || "Unknown";
}

// Helper to get license name with fallback
export function getLicenseName(license: License): string {
  return license.name || license.licenseId || "N/A";
}
