import { getPackageInsights } from "@/lib/actions/getPackageInsights";
import { getPackageMalysis } from "@/lib/actions/getPackageMalysis";
import { PackageHeader } from "@/components/package/PackageHeader";
import { StatsCards } from "@/components/package/StatsCards";
import { PackageTabs } from "@/components/tabs/PackageTabs";
import { PackageInsightsData } from "@/lib/types/insights";
import { DebugLogger } from "./DebugLogger";

// Malysis API response type
interface MalysisData {
  analysisId?: string;
  report?: {
    analyzedAt?: string;
    reportId?: string;
    inference?: {
      confidence?: string;
      summary?: string;
      details?: string;
    };
  };
  target?: {
    origin?: string;
    sha256?: string;
  };
  packageVersion?: {
    package?: {
      ecosystem?: string;
      name?: string;
    };
    version?: string;
  };
  status?: string;
}

type PageProps = {
  params: Promise<{
    ecosystem: string;
    name: string;
    version: string;
  }>;
};

export default async function PackagePage({ params }: PageProps) {
  const resolvedParams = await params;
  const result = await getPackageInsights(resolvedParams);
  const malysisResult = await getPackageMalysis(resolvedParams);

  if (!result.success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Failed to load package data
          </h2>
          <p className="text-red-600">
            Unable to fetch insights for {resolvedParams.name}@
            {resolvedParams.version}. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const data = result.data as PackageInsightsData;

  // Check if insight object is empty (package not found in SafeDep)
  const isInsightEmpty = !data.insight || Object.keys(data.insight).length === 0;

  // Check if version exists - real packages have packagePublishedAt or availableVersions
  const isVersionInvalid = !isInsightEmpty && 
    !data.insight?.packagePublishedAt && 
    (!data.insight?.availableVersions || data.insight.availableVersions.length === 0) &&
    !data.insight?.licenses;

  if (isInsightEmpty) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-amber-700 mb-2">
            Package not found
          </h2>
          <p className="text-amber-600">
            No insights available for <span className="font-medium">{resolvedParams.name}@{resolvedParams.version}</span> in the {resolvedParams.ecosystem.toUpperCase()} ecosystem.
          </p>
          <p className="text-amber-500 text-sm mt-2">
            This package may not exist or hasn&apos;t been indexed by SafeDep yet.
          </p>
        </div>
      </div>
    );
  }

  if (isVersionInvalid) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-amber-700 mb-2">
            Version not found
          </h2>
          <p className="text-amber-600">
            Version <span className="font-medium">{resolvedParams.version}</span> of <span className="font-medium">{resolvedParams.name}</span> does not exist in the {resolvedParams.ecosystem.toUpperCase()} registry.
          </p>
          <p className="text-amber-500 text-sm mt-2">
            Please check the version number and try again.
          </p>
        </div>
      </div>
    );
  }

  const packageName = data.packageVersion?.package?.name || resolvedParams.name;
  const ecosystem = (
    data.packageVersion?.package?.ecosystem?.replace("ECOSYSTEM_", "") ||
    resolvedParams.ecosystem
  ).toLowerCase();

  // Cast malysis data to proper type
  const malysisData = malysisResult.success ? (malysisResult.data as MalysisData) : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-x border-b rounded-b">
      {/* Debug Logger - logs to browser console */}
      <DebugLogger data={malysisData} label="Malysis API Response" />
      
      <div className="space-y-6">
        {/* Package Header Card */}
        <PackageHeader data={data} malysisData={malysisData} />

        {/* Stats Cards */}
        <StatsCards data={data} />

        {/* Tabs */}
        <PackageTabs
          data={data}
          packageName={packageName}
          ecosystem={ecosystem}
          malysisData={malysisData}
        />
      </div>
    </div>
  );
}
