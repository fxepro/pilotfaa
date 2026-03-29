"use client";

import React from "react";
import { PilotFAAMarketingLink } from "@/components/pilotfaa-marketing-link";
import { PILOTFAA_FOOTER_LINK_GROUPS } from "@/lib/pilotfaa-marketing";

export function PilotFAAMarketingFooter() {
  return (
    <footer style={{ background: "#0F1F3A", padding: "40px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 8 }}>
              Pilot<span style={{ color: "#90cdf4" }}>FAA</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", maxWidth: 260, lineHeight: 1.6 }}>
              FAA-grounded aviation ground school. Every answer cited to an official FAA publication.
            </div>
          </div>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" as const }}>
            {PILOTFAA_FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "1.5px",
                    fontFamily: "monospace",
                    marginBottom: 12,
                  }}
                >
                  {group.title}
                </div>
                {group.links.map((item) => (
                  <div key={item.href} style={{ marginBottom: 8 }}>
                    <PilotFAAMarketingLink
                      href={item.href}
                      style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none" }}
                    >
                      {item.label}
                    </PilotFAAMarketingLink>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap" as const,
            gap: 12,
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            © {new Date().getFullYear()} PilotFAA — FAA content is public domain per 17 U.S.C. section 105
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "monospace" }}>
            PHAK · FAR/AIM · ACS · AIM 2024
          </div>
        </div>
      </div>
    </footer>
  );
}
