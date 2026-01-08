"use server";

import { fetchPackageInsights } from "@/lib/api/safedep-insight";

export async function getPackageInsights(params: {
  ecosystem: string;
  name: string;
  version: string;
}) {
  try {
    const data = await fetchPackageInsights(params);
    // console.log("Insights API Response:", data);
    return { success: true, data };
  } catch (error) {
    console.error("SafeDep API error:", error);
    return {
      success: false,
      error: "Failed to fetch package insights",
    };
  }
}
