import { PackageInsightsData } from "@/lib/types/insights";
import { useOverviewData, formatOverviewText, MalysisData } from "@/lib/hooks";

interface OverviewTabProps {
  data: PackageInsightsData;
  malysisData?: MalysisData;
}

export function OverviewTab({ data, malysisData }: OverviewTabProps) {
  const {
    summary,
    analysisNote,
    verificationRecord,
    details,
    detailsNote,
    malysisConfidence,
    hasAnalysisData,
  } = useOverviewData({ data, malysisData });

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Summary Section */}
      {(summary || analysisNote) && (
        <div className="flex gap-4">
          <div className="w-1 bg-amber-400 rounded-full shrink-0" />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
            {summary && (
              <p className="text-gray-600 leading-relaxed">{summary}</p>
            )}
            {analysisNote && (
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Note:</span>{" "}
                {analysisNote}
              </p>
            )}
            {malysisConfidence && (
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Confidence:</span>{" "}
                <span
                  className={`font-medium ${
                    malysisConfidence === "HIGH"
                      ? "text-emerald-600"
                      : malysisConfidence === "MEDIUM"
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {malysisConfidence}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Verification Record Section */}
      {verificationRecord && (
        <div className="flex gap-4">
          <div className="w-1 bg-gray-300 rounded-full shrink-0" />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Verification Record
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {verificationRecord}
            </p>
          </div>
        </div>
      )}

      {/* Details Section */}
      {(details || detailsNote) && (
        <div className="flex gap-4">
          <div className="w-1 bg-gray-300 rounded-full shrink-0" />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Details</h3>
            {detailsNote && (
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Note:</span>{" "}
                {detailsNote}
              </p>
            )}
            {details && (
              <div className="space-y-3">{formatOverviewText(details)}</div>
            )}
          </div>
        </div>
      )}

      {/* Fallback when no data */}
      {!hasAnalysisData && (
        <div className="text-gray-500 text-center py-8">
          No overview information available for this package.
        </div>
      )}
    </div>
  );
}
