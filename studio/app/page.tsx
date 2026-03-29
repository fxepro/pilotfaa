"use client";

import React from "react";
import Link from "next/link";
import { PilotFAAMarketingLink } from "@/components/pilotfaa-marketing-link";
import { PilotFAAMarketingShell } from "@/components/pilotfaa-marketing-shell";
import { PILOTFAA_FEATURES } from "@/lib/pilotfaa-marketing";

export default function HomePage() {
  return (
    <PilotFAAMarketingShell>
      <section style={{
        background: "linear-gradient(130deg,#0F1F3A 0%,#1756C8 55%,#2362e0 100%)",
        padding: "100px 32px 80px",
        textAlign: "center" as const,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%) rotate(10deg)", fontSize: 180, opacity: 0.05, pointerEvents: "none" as const }}>✈</div>
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 20, padding: "4px 14px",
            fontSize: 11, color: "rgba(255,255,255,0.85)",
            letterSpacing: "2px", textTransform: "uppercase" as const,
            fontFamily: "monospace", marginBottom: 20,
          }}>FAA-Grounded Aviation Ground School</div>

          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,6vw,58px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
            Pass Your FAA Knowledge<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}>Test. First Try.</em>
          </h1>

          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: 540, margin: "0 auto 36px" }}>
            AI-powered lessons, quizzes, and an on-call AI ground instructor — all grounded
            in official FAA publications with citations on every answer.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const }}>
            <Link href="/checkout" style={{ background: "#fff", color: "#1756C8", padding: "14px 32px", borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              Start course →
            </Link>
            <PilotFAAMarketingLink
              href="/courses"
              style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none" }}
            >
              View Courses
            </PilotFAAMarketingLink>
            <PilotFAAMarketingLink
              href="/features"
              style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.35)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none" }}
            >
              Features
            </PilotFAAMarketingLink>
          </div>

          <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 48, flexWrap: "wrap" as const }}>
            {["📄 PHAK FAA-H-8083-25C","⚖️ 14 CFR Parts 61 & 91","🎯 Private Pilot ACS-6C","📡 AIM 2024"].map((b) => (
              <span key={b} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "20px 32px", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" as const }}>
        {[["200+","FAA Exam Questions"],["17","PHAK Chapters"],["60","ACS Task Codes"],["100%","FAA-Cited Answers"]].map(([v, l]) => (
          <div key={l} style={{ textAlign: "center" as const }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#1756C8", fontFamily: "Georgia,serif" }}>{v}</div>
            <div style={{ fontSize: 12, color: "#7A90AE", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      <section style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 34, fontWeight: 700, color: "#0F1F3A", marginBottom: 10 }}>Built Around How the FAA Thinks</h2>
            <p style={{ color: "#7A90AE", fontSize: 16 }}>Not a question bank. A complete ground school.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
            {PILOTFAA_FEATURES.map((f) => (
              <div key={f.title} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0F1F3A", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13.5, color: "#3A4E6B", lineHeight: 1.65 }}>{f.body}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center" as const, marginTop: 36 }}>
            <PilotFAAMarketingLink href="/features" style={{ color: "#1756C8", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Explore all platform features →
            </PilotFAAMarketingLink>
          </p>
        </div>
      </section>

      <section style={{ background: "linear-gradient(130deg,#0F1F3A,#1756C8)", padding: "72px 32px", textAlign: "center" as const }}>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 34, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Ready for your checkride?</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginBottom: 32 }}>Enroll, pay, and start your ground school in one flow.</p>
        <Link href="/checkout" style={{ background: "#fff", color: "#1756C8", padding: "14px 36px", borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          Start course →
        </Link>
      </section>

    </PilotFAAMarketingShell>
  );
}
