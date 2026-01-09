"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageInsightsData } from "@/lib/types/insights";
import { OverviewTab } from "./OverviewTab";
import { VulnerabilitiesTab } from "./VulnerabilitiesTab";
import { VersionsTab } from "./VersionsTab";
import { LicenseTab } from "./LicenseTab";

// Malysis API response type
interface MalysisData {
  analysisId?: string;
  report?: {
    analyzedAt?: string;
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

interface PackageTabsProps {
  data: PackageInsightsData;
  packageName: string;
  ecosystem: string;
  malysisData?: MalysisData;
}

export function PackageTabs({
  data,
  packageName,
  ecosystem,
  malysisData,
}: PackageTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full sm:w-auto bg-gray-100 rounded-lg p-2 justify-start h-auto gap-1 overflow-x-auto flex-nowrap">
        <TabsTrigger
          value="overview"
          className="rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all whitespace-nowrap"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="vulnerabilities"
          className="rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all whitespace-nowrap"
        >
          Vulnerabilities
        </TabsTrigger>
        <TabsTrigger
          value="versions"
          className="rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all whitespace-nowrap"
        >
          Versions
        </TabsTrigger>
        <TabsTrigger
          value="license"
          className="rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all whitespace-nowrap"
        >
          License
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <OverviewTab data={data} malysisData={malysisData} />
      </TabsContent>

      <TabsContent value="vulnerabilities" className="mt-6">
        <VulnerabilitiesTab data={data} />
      </TabsContent>

      <TabsContent value="versions" className="mt-6">
        <VersionsTab
          data={data}
          packageName={packageName}
          ecosystem={ecosystem}
        />
      </TabsContent>

      <TabsContent value="license" className="mt-6">
        <LicenseTab data={data} />
      </TabsContent>
    </Tabs>
  );
}
