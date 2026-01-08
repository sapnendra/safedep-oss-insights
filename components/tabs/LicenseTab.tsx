import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PackageInsightsData } from "@/lib/types/insights";

interface LicenseTabProps {
  data: PackageInsightsData;
}

export function LicenseTab({ data }: LicenseTabProps) {
  // Licenses is nested: insight.licenses.licenses[]
  const rawLicenses = data.insight?.licenses?.licenses;
  const licenses = Array.isArray(rawLicenses) ? rawLicenses : [];

  if (licenses.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No license information available for this package.
      </div>
    );
  }

  // Helper to get license name or ID for display
  const getLicenseDisplay = (license: typeof licenses[0]) => {
    return license.licenseId || license.name || "Unknown";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-200">
          <TableHead className="text-gray-500 font-medium">
            License ID
          </TableHead>
          <TableHead className="text-gray-500 font-medium">
            License Name
          </TableHead>
          <TableHead className="text-gray-500 font-medium">
            Reference URL
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {licenses.map((license, index) => (
          <TableRow
            key={license.licenseId || license.name || index}
            className="border-b border-gray-100"
          >
            <TableCell className="font-medium text-gray-900">
              {getLicenseDisplay(license)}
            </TableCell>
            <TableCell className="text-gray-600">
              {license.name || license.licenseId || "N/A"}
            </TableCell>
            <TableCell>
              {license.reference ? (
                <a
                  href={license.reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  {license.reference}
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
