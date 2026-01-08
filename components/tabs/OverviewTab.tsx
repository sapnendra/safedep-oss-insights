import { PackageInsightsData } from "@/lib/types/insights";

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

interface OverviewTabProps {
  data: PackageInsightsData;
  malysisData?: MalysisData;
}

// Function to parse and format text with markdown-like syntax
function formatText(text: string): React.ReactNode[] {
  // Split by single * for paragraph separation (but not **)
  const paragraphs = text.split(/(?<!\*)\*(?!\*)/).map((p) => p.trim()).filter(Boolean);

  return paragraphs.map((paragraph, pIndex) => {
    // Parse the paragraph for ** bold ** and `code` formatting
    const parts: React.ReactNode[] = [];
    let remaining = paragraph;
    let keyIndex = 0;

    while (remaining.length > 0) {
      // Find the next formatting marker
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const codeMatch = remaining.match(/`([^`]+)`/);

      // Determine which match comes first
      const boldIndex = boldMatch?.index ?? Infinity;
      const codeIndex = codeMatch?.index ?? Infinity;

      if (boldIndex === Infinity && codeIndex === Infinity) {
        // No more matches, add the remaining text
        parts.push(<span key={`${pIndex}-${keyIndex++}`}>{remaining}</span>);
        break;
      }

      if (boldIndex <= codeIndex && boldMatch) {
        // Bold comes first
        if (boldIndex > 0) {
          parts.push(
            <span key={`${pIndex}-${keyIndex++}`}>
              {remaining.slice(0, boldIndex)}
            </span>
          );
        }
        parts.push(
          <span key={`${pIndex}-${keyIndex++}`} className="font-semibold text-gray-900">
            {boldMatch[1]}
          </span>
        );
        remaining = remaining.slice(boldIndex + boldMatch[0].length);
      } else if (codeMatch) {
        // Code comes first
        if (codeIndex > 0) {
          parts.push(
            <span key={`${pIndex}-${keyIndex++}`}>
              {remaining.slice(0, codeIndex)}
            </span>
          );
        }
        parts.push(
          <code
            key={`${pIndex}-${keyIndex++}`}
            className="px-1.5 py-0.5 rounded text-sm font-mono"
            style={{ backgroundColor: "rgba(58, 151, 137, 0.15)", color: "#3A9789" }}
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeIndex + codeMatch[0].length);
      }
    }

    return (
      <p key={pIndex} className="text-gray-600 leading-relaxed">
        {parts}
      </p>
    );
  });
}

export function OverviewTab({ data, malysisData }: OverviewTabProps) {
  // Check if malysis data is available (version has been scanned)
  const hasMalysisData = malysisData && malysisData.status === "ANALYSIS_STATUS_COMPLETED";

  // Analysis fields from malysis API (primary source for summary/details)
  const malysisSummary = hasMalysisData ? malysisData?.report?.inference?.summary : undefined;
  const malysisDetails = hasMalysisData ? malysisData?.report?.inference?.details : undefined;
  const malysisConfidence = hasMalysisData ? malysisData?.report?.inference?.confidence?.replace("CONFIDENCE_", "") : undefined;

  // Analysis fields from insights API (fallback)
  const insightSummary = data.insight?.summary;
  const analysisNote = data.insight?.analysisNote;
  const verificationRecord = data.insight?.verificationRecord;
  const insightDetails = data.insight?.details;
  const detailsNote = data.insight?.detailsNote;

  // Use malysis data if available, otherwise fallback to insights
  const summary = malysisSummary || insightSummary;
  const details = malysisDetails || insightDetails;

  // Project insights (GitHub info, scorecard, etc.)
  const projectInsight = data.insight?.projectInsights?.[0];
  const project = projectInsight?.project;
  const stars = projectInsight?.stars;
  const forks = projectInsight?.forks;
  const openIssues = projectInsight?.issues?.open;
  const scorecard = projectInsight?.scorecard;

  // Dependencies
  const dependencies = data.insight?.dependencies;
  const dependencyCount = Array.isArray(dependencies) ? dependencies.length : 0;

  // Check if we have analysis data
  const hasAnalysisData = summary || verificationRecord || details;

  // Check if we have project data
  const hasProjectData = project || stars || forks || scorecard;

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
                <span className={`font-medium ${malysisConfidence === "HIGH" ? "text-emerald-600" : malysisConfidence === "MEDIUM" ? "text-amber-600" : "text-red-600"}`}>
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
              <div className="space-y-3">{formatText(details)}</div>
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
