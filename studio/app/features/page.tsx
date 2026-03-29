"use client";

import React from "react";
import Link from "next/link";
import { PilotFAAMarketingShell } from "@/components/pilotfaa-marketing-shell";
import { PILOTFAA_FEATURES } from "@/lib/pilotfaa-marketing";

export default function PilotFAAFeaturesPage() {
  return (
    <PilotFAAMarketingShell>
      <section style={{ background: "#fff", padding: "48px 32px 80px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0F1F3A", marginBottom: 10 }}>
              Built Around How the FAA Thinks
            </h1>
            <p style={{ color: "#7A90AE", fontSize: 16 }}>Not a question bank. A complete ground school.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
            {PILOTFAA_FEATURES.map((f) => (
              <div
                key={f.title}
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0F1F3A", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13.5, color: "#3A4E6B", lineHeight: 1.65 }}>{f.body}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" as const, marginTop: 48 }}>
            <Link
              href="/checkout"
              style={{
                display: "inline-block",
                background: "#1756C8",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Start course →
            </Link>
          </div>
        </div>
      </section>

    </PilotFAAMarketingShell>
  );
}
