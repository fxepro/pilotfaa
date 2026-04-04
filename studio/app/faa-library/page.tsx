"use client";

import React from "react";
import Link from "next/link";
import { PilotFAAMarketingShell } from "@/components/pilotfaa-marketing-shell";
import { PilotFAAMarketingLink } from "@/components/pilotfaa-marketing-link";

const COURSE_COLORS: Record<string, string> = {
  "Private Pilot":     "#1756C8",
  "Helicopter PPL":    "#127A48",
  "Instrument Rating": "#C8860A",
  "Commercial Pilot":  "#6B21A8",
  "Sport Pilot":       "#0D9488",
  "Drone / Part 107":  "#7c3aed",
  "CFI":               "#B91C1C",
};

const HANDBOOKS = [
  {
    emoji: "📗",
    shortCode: "PHAK",
    pubRef: "FAA-H-8083-25C",
    title: "Pilot's Handbook of Aeronautical Knowledge",
    edition: "Rev C, 2023",
    pages: "~500 pages",
    courses: ["Private Pilot", "Commercial Pilot", "Sport Pilot", "CFI"],
    faaUrl: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak",
    description: "The foundational ground-school text. Covers aerodynamics, aircraft systems, weather, navigation, flight physiology, and FARs. Required reading for every fixed-wing certification.",
  },
  {
    emoji: "📘",
    shortCode: "IFH",
    pubRef: "FAA-H-8083-15B",
    title: "Instrument Flying Handbook",
    edition: "Rev B, 2012",
    pages: "~350 pages",
    courses: ["Instrument Rating"],
    faaUrl: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/instrument_flying_handbook",
    description: "IFR procedures, approach charts, holding patterns, weather interpretation, and cockpit automation. Primary source for the Instrument Rating ground school.",
  },
  {
    emoji: "📙",
    shortCode: "RFH",
    pubRef: "FAA-H-8083-21B",
    title: "Rotorcraft Flying Handbook",
    edition: "Rev B, 2019",
    pages: "~290 pages",
    courses: ["Helicopter PPL"],
    faaUrl: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook",
    description: "Helicopter aerodynamics, systems, flight maneuvers, autorotation, and emergency procedures. The rotorcraft equivalent of the PHAK.",
  },
  {
    emoji: "📕",
    shortCode: "AIM",
    pubRef: "AIM",
    title: "Aeronautical Information Manual",
    edition: "Current edition",
    pages: "~900 pages",
    courses: ["Private Pilot", "Helicopter PPL", "Instrument Rating", "Commercial Pilot", "Sport Pilot", "CFI"],
    faaUrl: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html",
    description: "ATC procedures, airspace rules, NOTAMs, weather services, navigation aids, and emergency procedures. Referenced across every course for regulatory and procedural questions.",
  },
];

const ACS_STANDARDS = [
  {
    emoji: "✈️",
    shortCode: "ACS_PPL",
    pubRef: "FAA-S-ACS-6C",
    title: "Private Pilot Airman Certification Standards",
    edition: "Rev C, 2023",
    courses: ["Private Pilot"],
    faaUrl: "https://www.faa.gov/training_testing/testing/acs/media/private_airplane_acs_change_1.pdf",
    description: "Defines every knowledge, risk management, and skill task required to pass the Private Pilot checkride. Every quiz question and lesson maps to an ACS task code.",
  },
  {
    emoji: "🛩️",
    shortCode: "ACS_IFR",
    pubRef: "FAA-S-ACS-8C",
    title: "Instrument Rating Airman Certification Standards",
    edition: "Rev C, 2022",
    courses: ["Instrument Rating"],
    faaUrl: "https://www.faa.gov/training_testing/testing/acs/media/instrument_rating_acs_change_1.pdf",
    description: "IFR checkride standard. Covers precision and non-precision approaches, holds, partial-panel, and emergency instrument flight.",
  },
  {
    emoji: "🛫",
    shortCode: "ACS_COM",
    pubRef: "FAA-S-ACS-7B",
    title: "Commercial Pilot Airman Certification Standards",
    edition: "Rev B, 2023",
    courses: ["Commercial Pilot"],
    faaUrl: "https://www.faa.gov/training_testing/testing/acs/media/commercial_airplane_acs.pdf",
    description: "Commercial checkride standard. Builds on Private Pilot ACS with higher precision requirements and complex/high-performance maneuver tasks.",
  },
  {
    emoji: "🪂",
    shortCode: "ACS_SPT",
    pubRef: "FAA-S-ACS-9",
    title: "Sport Pilot Airman Certification Standards",
    edition: "2016",
    courses: ["Sport Pilot"],
    faaUrl: "https://www.faa.gov/training_testing/testing/acs/media/sport_pilot_acs.pdf",
    description: "Light-sport aircraft checkride standard. Subset of Private Pilot ACS with limitations specific to LSA operations.",
  },
  {
    emoji: "🚁",
    shortCode: "ACS_HELI",
    pubRef: "FAA-S-ACS-16",
    title: "Private Pilot Helicopter Airman Certification Standards",
    edition: "2019",
    courses: ["Helicopter PPL"],
    faaUrl: "https://www.faa.gov/training_testing/testing/acs/media/private_helicopter_acs.pdf",
    description: "Helicopter-specific checkride standard covering autorotations, slope operations, hovering, and confined-area procedures.",
  },
  {
    emoji: "🎓",
    shortCode: "PTS_CFI",
    pubRef: "FAA-S-8081-6D",
    title: "Flight Instructor Practical Test Standards",
    edition: "Rev D, 2012",
    courses: ["CFI"],
    faaUrl: "https://www.faa.gov/training_testing/testing/test_standards/media/FAA-S-8081-6D.pdf",
    description: "CFI checkride standard. Covers fundamentals of instruction, teaching all Private and Commercial maneuvers, and spin awareness.",
  },
  {
    emoji: "🛸",
    shortCode: "ACS_UAS",
    pubRef: "FAA-G-8082-22",
    title: "Remote Pilot — Small Unmanned Aircraft Systems Study Guide",
    edition: "2016",
    courses: ["Drone / Part 107"],
    faaUrl: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/media/remote_pilot_study_guide.pdf",
    description: "Part 107 knowledge test study guide. Covers airspace, weather, loading, emergency procedures, and drone regulations.",
  },
];

const REGULATIONS = [
  {
    shortCode: "14 CFR Part 61",
    title: "Certification: Pilots, Flight Instructors, and Ground Instructors",
    courses: ["Private Pilot", "Helicopter PPL", "Instrument Rating", "Commercial Pilot", "Sport Pilot", "CFI"],
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61",
    description: "Defines eligibility, aeronautical experience, and knowledge/skill requirements for all pilot certificates.",
  },
  {
    shortCode: "14 CFR Part 91",
    title: "General Operating and Flight Rules",
    courses: ["Private Pilot", "Helicopter PPL", "Instrument Rating", "Commercial Pilot", "Sport Pilot", "CFI"],
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-91",
    description: "Operational rules: fuel minimums, VFR weather minimums, right-of-way, equipment requirements, and more.",
  },
  {
    shortCode: "14 CFR Part 107",
    title: "Small Unmanned Aircraft Systems",
    courses: ["Drone / Part 107"],
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-107",
    description: "Complete regulatory framework for commercial drone operations under 55 lbs.",
  },
];

function CourseBadge({ course }: { course: string }) {
  const color = COURSE_COLORS[course] || "#64748b";
  return (
    <span style={{
      display: "inline-block",
      background: color + "18",
      color,
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 4,
      border: `1px solid ${color}30`,
      marginRight: 4,
      marginBottom: 4,
      whiteSpace: "nowrap" as const,
    }}>
      {course}
    </span>
  );
}

function HandbookCard({ doc }: { doc: typeof HANDBOOKS[0] }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: "24px 28px",
      boxShadow: "0 2px 10px rgba(15,31,58,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{doc.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const, marginBottom: 4 }}>
            <span style={{
              fontFamily: "monospace",
              fontSize: 11,
              fontWeight: 700,
              background: "#EBF1FB",
              color: "#1756C8",
              padding: "2px 8px",
              borderRadius: 4,
            }}>{doc.pubRef}</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{doc.edition} · {doc.pages}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0F1F3A", lineHeight: 1.3 }}>{doc.title}</div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16, margin: "0 0 16px" }}>
        {doc.description}
      </p>

      <div style={{ marginBottom: 16 }}>
        {doc.courses.map(c => <CourseBadge key={c} course={c} />)}
      </div>

      <a
        href={doc.faaUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "#1756C8",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          padding: "8px 16px",
          borderRadius: 7,
          textDecoration: "none",
        }}
      >
        Download from FAA.gov ↗
      </a>
    </div>
  );
}

function ACSCard({ doc }: { doc: typeof ACS_STANDARDS[0] }) {
  const color = COURSE_COLORS[doc.courses[0]] || "#64748b";
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderTop: `3px solid ${color}`,
      borderRadius: 10,
      padding: "20px 22px",
      boxShadow: "0 1px 6px rgba(15,31,58,0.04)",
    }}>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{doc.emoji}</div>
      <div style={{
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 700,
        color,
        marginBottom: 6,
        letterSpacing: "0.04em",
      }}>{doc.pubRef}</div>
      <div style={{ fontWeight: 700, fontSize: 14, color: "#0F1F3A", marginBottom: 8, lineHeight: 1.3 }}>
        {doc.title}
      </div>
      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 14, margin: "0 0 14px" }}>
        {doc.description}
      </p>
      <div style={{ marginBottom: 14 }}>
        {doc.courses.map(c => <CourseBadge key={c} course={c} />)}
        <span style={{ fontSize: 11, color: "#94a3b8" }}>{doc.edition}</span>
      </div>
      <a
        href={doc.faaUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 12,
          fontWeight: 600,
          color,
          textDecoration: "none",
          borderBottom: `1px solid ${color}40`,
        }}
      >
        Download PDF ↗
      </a>
    </div>
  );
}

function RegCard({ reg }: { reg: typeof REGULATIONS[0] }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      padding: "18px 20px",
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
    }}>
      <div style={{
        background: "#f1f5f9",
        borderRadius: 8,
        padding: "6px 10px",
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "monospace",
        color: "#475569",
        whiteSpace: "nowrap" as const,
        flexShrink: 0,
      }}>{reg.shortCode}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#0F1F3A", marginBottom: 4 }}>{reg.title}</div>
        <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: "0 0 10px" }}>{reg.description}</p>
        <div style={{ marginBottom: 8 }}>
          {reg.courses.slice(0, 3).map(c => <CourseBadge key={c} course={c} />)}
          {reg.courses.length > 3 && (
            <span style={{ fontSize: 11, color: "#94a3b8" }}>+{reg.courses.length - 3} more</span>
          )}
        </div>
        <a
          href={reg.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, fontWeight: 600, color: "#1756C8", textDecoration: "none" }}
        >
          View on eCFR.gov ↗
        </a>
      </div>
    </div>
  );
}

export default function FAALibraryPage() {
  const totalDocs = HANDBOOKS.length + ACS_STANDARDS.length;

  return (
    <PilotFAAMarketingShell>
      <section style={{ padding: "48px 32px 80px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "#7A90AE", marginBottom: 20 }}>
          <PilotFAAMarketingLink href="/" style={{ color: "#1756C8", textDecoration: "none", fontWeight: 600 }}>
            Home
          </PilotFAAMarketingLink>
          <span style={{ margin: "0 8px", color: "#cbd5e1" }}>/</span>
          <span style={{ color: "#0F1F3A", fontWeight: 600 }}>FAA Reference Library</span>
        </nav>

        {/* Header */}
        <div style={{
          background: "linear-gradient(130deg,#f1f5f9 0%,#e2e8f0 100%)",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 40,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1756C8", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>
            Official FAA Publications
          </div>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: "#0F1F3A", margin: "0 0 8px", lineHeight: 1.2 }}>
            FAA Reference Library
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, maxWidth: 640, margin: 0, lineHeight: 1.6 }}>
            Every official FAA publication used across all PilotFAA courses — {HANDBOOKS.length} handbooks and {ACS_STANDARDS.length} certification standards.
            All content, quizzes, and AI responses trace back to these documents.
          </p>
          <div style={{ display: "flex", gap: 24, marginTop: 16, flexWrap: "wrap" as const }}>
            {[
              { n: HANDBOOKS.length, label: "Handbooks & Manuals" },
              { n: ACS_STANDARDS.length, label: "ACS / PTS Standards" },
              { n: REGULATIONS.length, label: "CFR References" },
              { n: totalDocs, label: "Total PDFs to download" },
            ].map(({ n, label }) => (
              <div key={label}>
                <span style={{ fontWeight: 800, fontSize: 22, color: "#1756C8" }}>{n}</span>
                <span style={{ fontSize: 12, color: "#64748b", marginLeft: 6 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Handbooks */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 22, fontWeight: 700, color: "#0F1F3A", margin: 0 }}>
              Handbooks & Manuals
            </h2>
            <span style={{ fontSize: 12, color: "#94a3b8", background: "#f1f5f9", padding: "2px 10px", borderRadius: 20 }}>
              {HANDBOOKS.length} documents
            </span>
          </div>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, lineHeight: 1.6, marginTop: 0 }}>
            Large reference handbooks that form the content backbone of each course. Download once — they're used across multiple certifications.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: 20 }}>
            {HANDBOOKS.map(doc => <HandbookCard key={doc.shortCode} doc={doc} />)}
          </div>
        </div>

        {/* ACS Standards */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 22, fontWeight: 700, color: "#0F1F3A", margin: 0 }}>
              Airman Certification Standards
            </h2>
            <span style={{ fontSize: 12, color: "#94a3b8", background: "#f1f5f9", padding: "2px 10px", borderRadius: 20 }}>
              {ACS_STANDARDS.length} documents
            </span>
          </div>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, lineHeight: 1.6, marginTop: 0 }}>
            One ACS per certification. Every quiz question and lesson is tagged to an ACS task code — the same standard your DPE uses on checkride day.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {ACS_STANDARDS.map(doc => <ACSCard key={doc.shortCode} doc={doc} />)}
          </div>
        </div>

        {/* Regulations */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 22, fontWeight: 700, color: "#0F1F3A", margin: 0 }}>
              Federal Aviation Regulations
            </h2>
            <span style={{ fontSize: 12, color: "#94a3b8", background: "#f1f5f9", padding: "2px 10px", borderRadius: 20 }}>
              Live on eCFR.gov — no download needed
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {REGULATIONS.map(reg => <RegCard key={reg.shortCode} reg={reg} />)}
          </div>
        </div>

        {/* Upload note */}
        <div style={{
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: 10,
          padding: "18px 22px",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#92400e", marginBottom: 4 }}>
              Loading PDFs into the AI Tutor
            </div>
            <p style={{ fontSize: 13, color: "#78350f", margin: 0, lineHeight: 1.6 }}>
              Once downloaded, use <code style={{ background: "#fef3c7", padding: "1px 5px", borderRadius: 3, fontFamily: "monospace" }}>upload_pdf.py</code> in the backend to store each PDF in the database.
              The AI tutor (Captain FAA) then cites specific pages from these documents in every response.
            </p>
          </div>
        </div>

      </section>
    </PilotFAAMarketingShell>
  );
}
