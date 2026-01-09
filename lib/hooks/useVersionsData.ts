import { useMemo, useState, useCallback } from "react";
import { PackageInsightsData, VersionInfo } from "@/lib/types/insights";

const VERSIONS_PER_PAGE = 5;

interface UseVersionsDataParams {
  data: PackageInsightsData;
}

interface VersionsData {
  displayVersions: VersionInfo[];
  allVersions: VersionInfo[];
  visibleCount: number;
  hasMore: boolean;
  totalCount: number;
  handleLoadMore: () => void;
}

export function useVersionsData({ data }: UseVersionsDataParams): VersionsData {
  const [visibleCount, setVisibleCount] = useState(VERSIONS_PER_PAGE);

  // Process versions data
  const { allVersions } = useMemo(() => {
    const rawVersions = data.insight?.availableVersions;
    const versions = Array.isArray(rawVersions) ? rawVersions : [];
    const currentVersion = data.packageVersion?.version;

    // Sort versions: defaultVersion (Latest) first, then by publishedAt (newest first)
    const sortedVersions = [...versions].sort((a, b) => {
      if (a.defaultVersion && !b.defaultVersion) return -1;
      if (!a.defaultVersion && b.defaultVersion) return 1;

      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

    // If no versions data, show the current version at least
    const allVersions =
      sortedVersions.length > 0
        ? sortedVersions
        : currentVersion
        ? [{ version: currentVersion, defaultVersion: true }]
        : [];

    return { allVersions };
  }, [data]);

  const displayVersions = useMemo(() => {
    return allVersions.slice(0, visibleCount);
  }, [allVersions, visibleCount]);

  const hasMore = visibleCount < allVersions.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + VERSIONS_PER_PAGE);
  }, []);

  return {
    displayVersions,
    allVersions,
    visibleCount,
    hasMore,
    totalCount: allVersions.length,
    handleLoadMore,
  };
}

// Format date helper
export function formatVersionDate(dateString?: string): string {
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
