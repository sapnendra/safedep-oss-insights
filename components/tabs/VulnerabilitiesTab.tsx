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
import { CircleCheck, CircleAlert, OctagonAlert, Circle } from "lucide-react";

interface VulnerabilitiesTabProps {
  data: PackageInsightsData;
}

function getSeverityBadge(severity?: string) {
  const severityLower = severity?.toLowerCase() || "unspecified";

  const severityConfig: Record<
    string,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    low: {
      label: "Low",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CircleCheck className="w-3.5 h-3.5 mr-1" />,
    },
    medium: {
      label: "Medium",
      className: "bg-amber-50 text-amber-700 border-amber-700",
      icon: <CircleAlert className="w-3.5 h-3.5 mr-1" />,
    },
    high: {
      label: "High",
      className: "bg-red-50 text-orange-700 text-orange-700 border-orange-700",
      icon: <OctagonAlert className="w-3.5 h-3.5 mr-1" />,
    },
    critical: {
      label: "Critical",
      className: "bg-red-400 text-red-700 border-red-200",
      icon: <CircleAlert className="w-3.5 h-3.5 mr-1" />,
    },
    unspecified: {
      label: "Unspecified",
      className: "bg-gray-50 text-gray-600 border-gray-200",
      icon: <Circle className="w-3.5 h-3.5 mr-1" />,
    },
  };

  const config = severityConfig[severityLower] || severityConfig.unspecified;

  return (
    <Badge
      variant="outline"
      className={`${config.className} flex items-center font-medium`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}

function formatDate(dateString?: string) {
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

export function VulnerabilitiesTab({ data }: VulnerabilitiesTabProps) {
  const rawVulnerabilities = data.insight?.vulnerabilities;
  const vulnerabilities = Array.isArray(rawVulnerabilities)
    ? rawVulnerabilities
    : [];

  if (vulnerabilities.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No vulnerabilities found for this package version.
      </div>
    );
  }

  // Helper to extract vulnerability ID (can be string or object with {type, value})
  const getVulnId = (id: unknown): string => {
    if (!id) return "N/A";
    if (typeof id === "string") return id;
    if (typeof id === "object" && id !== null) {
      const idObj = id as { type?: string; value?: string };
      return idObj.value || idObj.type || "N/A";
    }
    return "N/A";
  };

  // Helper to extract summary (can be string or object)
  const getSummary = (summary: unknown): string => {
    if (!summary) return "No summary available";
    if (typeof summary === "string") return summary;
    if (typeof summary === "object" && summary !== null) {
      const summaryObj = summary as { value?: string; text?: string };
      return summaryObj.value || summaryObj.text || "No summary available";
    }
    return "No summary available";
  };

  // Helper to extract severity from severities array
  const getSeverity = (severities: unknown): string | undefined => {
    if (!severities) return undefined;
    if (typeof severities === "string") return severities;
    if (Array.isArray(severities) && severities.length > 0) {
      const firstSeverity = severities[0];
      if (typeof firstSeverity === "object" && firstSeverity !== null) {
        // Extract risk from severities[0].risk (e.g., "RISK_MEDIUM" -> "medium")
        const risk = (firstSeverity as { risk?: string }).risk;
        if (risk) {
          return risk.replace("RISK_", "").toLowerCase();
        }
      }
    }
    if (typeof severities === "object" && severities !== null) {
      const sevObj = severities as { value?: string; level?: string; risk?: string };
      return sevObj.risk?.replace("RISK_", "").toLowerCase() || sevObj.value || sevObj.level;
    }
    return undefined;
  };

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
        {vulnerabilities.map((vuln, index) => {
          const vulnId = getVulnId(vuln.id);
          return (
            <TableRow key={`${vulnId}-${index}`} className="border-b border-gray-100">
              <TableCell className="font-medium text-gray-900">
                {vulnId}
              </TableCell>
              <TableCell className="text-gray-600 max-w-md truncate">
                {getSummary(vuln.summary)}
              </TableCell>
              <TableCell>{getSeverityBadge(getSeverity(vuln.severities))}</TableCell>
              <TableCell className="text-gray-500">
                {formatDate(vuln.publishedAt)}
              </TableCell>
              <TableCell className="text-gray-500">
                {formatDate(vuln.modifiedAt)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
