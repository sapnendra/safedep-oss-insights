import { Card, CardContent } from "@/components/ui/card";
import { PackageInsightsData } from "@/lib/types/insights";
import { AlertCircle, ShieldCheck, FileText, Globe, Bug } from "lucide-react";

interface StatsCardsProps {
  data: PackageInsightsData;
}

export function StatsCards({ data }: StatsCardsProps) {
  const version = data.packageVersion?.version || "N/A";
  const vulnerabilitiesCount = data.insight?.vulnerabilities?.length || 0;
  // Scorecard is nested inside projectInsights[0].scorecard
  const projectInsight = data.insight?.projectInsights?.[0];
  const scorecardScore = projectInsight?.scorecard?.score;
  // Licenses is nested: insight.licenses.licenses[]
  const licensesList = data.insight?.licenses?.licenses;
  const license =
    Array.isArray(licensesList) && licensesList.length > 0
      ? licensesList[0]?.licenseId || licensesList[0]?.name || "Unknown"
      : "Unknown";
  const ecosystem =
    data.packageVersion?.package?.ecosystem?.replace("ECOSYSTEM_", "") || "N/A";

  const stats = [
    {
      label: "Version",
      value: version,
      icon: <AlertCircle className="w-4 h-4" />,
      iconColor: "text-red-500",
      valueColor: "text-gray-900",
    },
    {
      label: "Vulnerabilities",
      value: vulnerabilitiesCount.toString(),
      icon: <Bug className="w-4 h-4" />,
      iconColor: "text-red-500",
      valueColor: "text-gray-900",
    },
    {
      label: "OpenSSF Scorecard",
      value: scorecardScore !== undefined ? `${Math.round(scorecardScore * 10) / 10}/10` : "N/A",
      icon: <ShieldCheck className="w-4 h-4" />,
      iconColor: "text-emerald-500",
      valueColor: "text-emerald-500",
    },
    {
      label: "License",
      value: license,
      icon: <FileText className="w-4 h-4" />,
      iconColor: "text-emerald-500",
      valueColor: "text-gray-900",
    },
    {
      label: "Ecosystem",
      value: ecosystem,
      icon: <Globe className="w-4 h-4" />,
      iconColor: "text-emerald-500",
      valueColor: "text-gray-900",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border rounded-md border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={stat.iconColor}>{stat.icon}</span>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className={`text-2xl font-semibold ${stat.valueColor}`}>
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
