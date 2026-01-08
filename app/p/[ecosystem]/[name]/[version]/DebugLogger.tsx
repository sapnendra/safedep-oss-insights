"use client";

import { useEffect } from "react";

export function DebugLogger({
  data,
  label = "Debug Data",
}: {
  data: unknown;
  label?: string;
}) {
  useEffect(() => {
    console.log(`[${label}]`, data);
    // console.log("Debug Logger");
  }, [data, label]);

  return null;
}
