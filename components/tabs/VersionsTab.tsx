"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageInsightsData } from "@/lib/types/insights";
import { useVersionsData, formatVersionDate } from "@/lib/hooks";

interface VersionsTabProps {
  data: PackageInsightsData;
  packageName: string;
  ecosystem: string;
}

export function VersionsTab({
  data,
  packageName,
  ecosystem,
}: VersionsTabProps) {
  const { displayVersions, allVersions, hasMore, handleLoadMore } =
    useVersionsData({ data });

  if (allVersions.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No version information available for this package.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="min-h-60 border border-gray-200 rounded-lg overflow-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-gray-500 font-medium">
                Version
              </TableHead>
              <TableHead className="text-gray-500 font-medium">
                Published On
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayVersions.map((ver, index) => (
              <TableRow
                key={ver.version || index}
                className="border-b border-gray-100"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {ver.version || "Unknown"}
                    </span>
                    {ver.defaultVersion && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                      >
                        Latest
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">
                  {formatVersionDate(ver.publishedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/p/${ecosystem.toLowerCase()}/${packageName}/${
                      ver.version
                    }`}
                    className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                  >
                    View Version
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="text-gray-600 hover:text-gray-900"
          >
            Load More ({allVersions.length - displayVersions.length} remaining)
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 mt-2">
        Showing {displayVersions.length} of {allVersions.length} versions
      </div>
    </div>
  );
}
