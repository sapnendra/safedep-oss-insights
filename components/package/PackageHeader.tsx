import { PackageInsightsData } from "@/lib/types/insights";

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

interface PackageHeaderProps {
  data: PackageInsightsData;
  malysisData?: MalysisData;
}

export function PackageHeader({ data, malysisData }: PackageHeaderProps) {
  const packageName = data.packageVersion?.package?.name || "Unknown Package";
  const version = data.packageVersion?.version || "";

  // Check if malysis data is available (version has been scanned)
  const hasMalysisData =
    malysisData && malysisData.status === "ANALYSIS_STATUS_COMPLETED";

  // Extract target from malysisData report
  const malysisTarget = hasMalysisData
    ? (malysisData?.report as { target?: { origin?: string; sha256?: string } })
        ?.target
    : null;

  // Use malysis data for analysis info, fallback to insights data
  const analysedAt = hasMalysisData
    ? malysisData?.report?.analyzedAt
    : data.insight?.analysedAt;
  const sourceUrl = malysisTarget?.origin || data.insight?.sourceUrl;
  const sha256 = malysisTarget?.sha256 || data.insight?.sha256;

  // Format the analysed date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Not Scanned Banner */}
      {!hasMalysisData && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
          <svg
            className="w-5 h-5 text-amber-500 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-sm text-amber-700">
            <span className="font-medium">Security analysis pending:</span> This
            version hasn&apos;t been scanned yet. Malware analysis data will be
            available once the scan is complete.
          </p>
        </div>
      )}

      {/* Package Name with Icon */}
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-5 h-5 text-gray-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        <h1 className="text-lg font-semibold text-gray-900">
          {packageName}@{version}
        </h1>
      </div>

      {/* Metadata */}
      <div className="space-y-1 text-sm">
        <p className="text-gray-500">
          <span className="text-gray-400 text-xs sm:text-md">
            Analysed at :{" "}
          </span>{" "}
          <span className="text-black text-xs sm:text-md">
            {formatDate(analysedAt)}
          </span>
        </p>

        <p>
          <span className="text-gray-400 text-xs sm:text-md">Source : </span>{" "}
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-black/70 hover:underline text-xs sm:text-md"
            >
              {sourceUrl}
            </a>
          ) : (
            <span className="text-gray-500">N/A</span>
          )}
        </p>

        <p className="w-full">
          <span className="text-gray-400 text-xs sm:text-md">SHA256 : </span>{" "}
          <code className="text-black text-xs sm:text-md break-all">
            {sha256 || "N/A"}
          </code>
        </p>

        <p>
          <span className="text-gray-400 text-xs sm:text-md">
            Confidence :{" "}
          </span>{" "}
          <code className="text-black text-xs sm:text-md">
            {malysisData?.report?.inference?.confidence || "N/A"}
          </code>
        </p>
      </div>
    </div>
  );
}
