"use client";

import React from "react";
import { PilotFAANav } from "@/components/pilotfaa-nav";
import { PilotFAAMarketingFooter } from "@/components/pilotfaa-marketing-footer";

export const PILOTFAA_MARKETING_PAGE_STYLE = {
  fontFamily: "'Inter', system-ui, sans-serif",
  background: "#f8fafc",
  minHeight: "100vh",
} as const;

export function PilotFAAMarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={PILOTFAA_MARKETING_PAGE_STYLE}>
      <PilotFAANav />
      {children}
      <PilotFAAMarketingFooter />
    </div>
  );
}
