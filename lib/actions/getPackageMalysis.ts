"use server";

import { fetchPackageMalysis } from "@/lib/api/safedep-malysis";

export async function getPackageMalysis(params: {
  ecosystem: string;
  name: string;
  version: string;
}) {
  try {
    const data = await fetchPackageMalysis(params);
    // console.log("Malysis API Response:", data);
    return { success: true, data };
  } catch (error: unknown) {
    // NotFound errors are expected for packages without malware analysis
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isNotFound = errorMessage.includes("not_found") || errorMessage.includes("NotFound");
    
    if (!isNotFound) {
      console.error("SafeDep Malysis API error:", error);
    }
    
    return {
      success: false,
      error: "Failed to fetch package malware analysis",
    };
  }
}
