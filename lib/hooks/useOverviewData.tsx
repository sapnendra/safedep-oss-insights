import { useMemo } from "react";
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

interface UseOverviewDataParams {
  data: PackageInsightsData;
  malysisData?: MalysisData;
}

interface OverviewData {
  summary: string | undefined;
  analysisNote: string | undefined;
  verificationRecord: string | undefined;
  details: string | undefined;
  detailsNote: string | undefined;
  malysisConfidence: string | undefined;
  hasAnalysisData: boolean;
}

export function useOverviewData({
  data,
  malysisData,
}: UseOverviewDataParams): OverviewData {
  return useMemo(() => {
    // Check if malysis data is available (version has been scanned)
    const hasMalysisData =
      malysisData && malysisData.status === "ANALYSIS_STATUS_COMPLETED";

    // Analysis fields from malysis API (primary source for summary/details)
    const malysisSummary = hasMalysisData
      ? malysisData?.report?.inference?.summary
      : undefined;
    const malysisDetails = hasMalysisData
      ? malysisData?.report?.inference?.details
      : undefined;
    const malysisConfidence = hasMalysisData
      ? malysisData?.report?.inference?.confidence?.replace("CONFIDENCE_", "")
      : undefined;

    // Analysis fields from insights API (fallback)
    const insightSummary = data.insight?.summary;
    const analysisNote = data.insight?.analysisNote;
    const verificationRecord = data.insight?.verificationRecord;
    const insightDetails = data.insight?.details;
    const detailsNote = data.insight?.detailsNote;

    // Use malysis data if available, otherwise fallback to insights
    const summary = malysisSummary || insightSummary;
    const details = malysisDetails || insightDetails;

    // Check if we have analysis data
    const hasAnalysisData = !!(summary || verificationRecord || details);

    return {
      summary,
      analysisNote,
      verificationRecord,
      details,
      detailsNote,
      malysisConfidence,
      hasAnalysisData,
    };
  }, [data, malysisData]);
}

// Format text with markdown-like syntax (bold and code)
export function formatOverviewText(text: string): React.ReactNode[] {
  // Split by single * for paragraph separation (but not **)
  const paragraphs = text
    .split(/(?<!\*)\*(?!\*)/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph, pIndex) => {
    const parts: React.ReactNode[] = [];
    let remaining = paragraph;
    let keyIndex = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const codeMatch = remaining.match(/`([^`]+)`/);

      const boldIndex = boldMatch?.index ?? Infinity;
      const codeIndex = codeMatch?.index ?? Infinity;

      if (boldIndex === Infinity && codeIndex === Infinity) {
        parts.push(<span key={`${pIndex}-${keyIndex++}`}>{remaining}</span>);
        break;
      }

      if (boldIndex <= codeIndex && boldMatch) {
        if (boldIndex > 0) {
          parts.push(
            <span key={`${pIndex}-${keyIndex++}`}>
              {remaining.slice(0, boldIndex)}
            </span>
          );
        }
        parts.push(
          <span
            key={`${pIndex}-${keyIndex++}`}
            className="font-semibold text-gray-900"
          >
            {boldMatch[1]}
          </span>
        );
        remaining = remaining.slice(boldIndex + boldMatch[0].length);
      } else if (codeMatch) {
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
            style={{
              backgroundColor: "rgba(58, 151, 137, 0.15)",
              color: "#3A9789",
            }}
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

export type { MalysisData };
