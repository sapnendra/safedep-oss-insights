import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PackageInsightsData } from "@/lib/types/insights";
import { useLicenseData, getLicenseDisplay, getLicenseName } from "@/lib/hooks";

interface LicenseTabProps {
  data: PackageInsightsData;
}

export function LicenseTab({ data }: LicenseTabProps) {
  const { licenses, hasLicenses } = useLicenseData({ data });

  if (!hasLicenses) {
    return (
      <div className="text-gray-500 text-center py-8">
        No license information available for this package.
      </div>
    );
  }

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
              {getLicenseName(license)}
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
