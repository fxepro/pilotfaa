"use client";

import React from "react";
import Link from "next/link";
import { PilotFAAMarketingLink } from "@/components/pilotfaa-marketing-link";
import { PilotFAAMarketingShell } from "@/components/pilotfaa-marketing-shell";
import { PILOTFAA_COURSES } from "@/lib/pilotfaa-marketing";

export default function CoursesPage() {
  return (
    <PilotFAAMarketingShell>
      <section style={{ padding: "48px 32px 72px", maxWidth: 1100, margin: "0 auto" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "#7A90AE", marginBottom: 20 }}>
          <PilotFAAMarketingLink href="/" style={{ color: "#1756C8", textDecoration: "none", fontWeight: 600 }}>
            Home
          </PilotFAAMarketingLink>
          <span style={{ margin: "0 8px", color: "#cbd5e1" }}>/</span>
          <span style={{ color: "#0F1F3A", fontWeight: 600 }}>Courses</span>
        </nav>
        <div
          style={{
            background: "linear-gradient(130deg,#f1f5f9 0%,#e2e8f0 100%)",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1756C8", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>
            Courses page
          </div>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0F1F3A", marginBottom: 8, lineHeight: 1.2 }}>
            FAA certification course catalog
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, maxWidth: 640, margin: 0, lineHeight: 1.6 }}>
            Full outlines, lesson counts, and enroll links for every certification track. Each path maps to its FAA source publication and ACS standard.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {PILOTFAA_COURSES.map((c) => (
            <div
              key={c.checkoutSlug}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 28,
                boxShadow: "0 2px 12px rgba(15,31,58,0.06)",
                borderTop: `3px solid ${c.color}`,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{c.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#0F1F3A" }}>{c.name}</div>
              <div style={{ fontSize: 13, color: "#7A90AE", marginBottom: 14 }}>{c.sub}</div>
              <div
                style={{
                  display: "inline-block",
                  background: "#EBF1FB",
                  color: "#1756C8",
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: "monospace",
                  padding: "3px 9px",
                  borderRadius: 4,
                  marginBottom: 16,
                }}
              >
                {c.ref}
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "#3A4E6B" }}>
                  <strong>{c.lessons}</strong> <span style={{ color: "#7A90AE" }}>lessons</span>
                </div>
                <div style={{ fontSize: 13, color: "#3A4E6B" }}>
                  <strong>{c.hours}</strong> <span style={{ color: "#7A90AE" }}>est.</span>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 15,
                    color: "#94a3b8",
                    textDecoration: "line-through",
                    marginRight: 10,
                  }}
                >
                  ${c.priceRegular}
                </span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#0F1F3A" }}>${c.introPrice}</span>
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#b45309",
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  Intro
                </span>
              </div>
              <Link
                href={`/checkout?course=${encodeURIComponent(c.checkoutSlug)}`}
                style={{
                  display: "block",
                  textAlign: "center" as const,
                  background: c.color,
                  color: "#fff",
                  padding: "10px 0",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Start Course →
              </Link>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center" as const, marginTop: 40 }}>
          <Link href="/lms" style={{ color: "#1756C8", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
            Open ground school (LMS) →
          </Link>
        </p>
      </section>

    </PilotFAAMarketingShell>
  );
}
