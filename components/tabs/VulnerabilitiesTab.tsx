"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PackageInsightsData } from "@/lib/types/insights";
import {
  useVulnerabilitiesData,
  formatVulnerabilityDate,
  getSeverityConfig,
} from "@/lib/hooks";
import { CircleCheck, CircleAlert, OctagonAlert, Circle } from "lucide-react";

interface VulnerabilitiesTabProps {
  data: PackageInsightsData;
}

function SeverityBadge({ severity }: { severity?: string }) {
  const config = getSeverityConfig(severity);

  const iconMap = {
    check: <CircleCheck className="w-3.5 h-3.5 mr-1" />,
    alert: <CircleAlert className="w-3.5 h-3.5 mr-1" />,
    octagon: <OctagonAlert className="w-3.5 h-3.5 mr-1" />,
    circle: <Circle className="w-3.5 h-3.5 mr-1" />,
  };

  return (
    <Badge
      variant="outline"
      className={`${config.className} flex items-center font-medium`}
    >
      {iconMap[config.iconType]}
      {config.label}
    </Badge>
  );
}

export function VulnerabilitiesTab({ data }: VulnerabilitiesTabProps) {
  const { vulnerabilities, hasVulnerabilities } = useVulnerabilitiesData({
    data,
  });

  if (!hasVulnerabilities) {
    return (
      <div className="text-gray-500 text-center py-8">
        No vulnerabilities found for this package version.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-200">
          <TableHead className="text-gray-500 font-medium">
            Vulnerability ID
          </TableHead>
          <TableHead className="text-gray-500 font-medium">Summary</TableHead>
          <TableHead className="text-gray-500 font-medium">Risk</TableHead>
          <TableHead className="text-gray-500 font-medium">Published</TableHead>
          <TableHead className="text-gray-500 font-medium">Modified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vulnerabilities.map((vuln, index) => (
          <TableRow
            key={`${vuln.id}-${index}`}
            className="border-b border-gray-100"
          >
            <TableCell className="font-medium text-gray-900">
              {vuln.id}
            </TableCell>
            <TableCell className="text-gray-600 max-w-md truncate">
              {vuln.summary}
            </TableCell>
            <TableCell>
              <SeverityBadge severity={vuln.severity} />
            </TableCell>
            <TableCell className="text-gray-500">
              {formatVulnerabilityDate(vuln.publishedAt)}
            </TableCell>
            <TableCell className="text-gray-500">
              {formatVulnerabilityDate(vuln.modifiedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
