"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PilotFAABrandContent } from "@/components/pilotfaa-brand";

const COURSES = [
  { emoji: "✈️", name: "Private Pilot",    sub: "Fixed-Wing", ref: "PHAK FAA-H-8083-25C", lessons: 60, hours: "40h", color: "#1756C8" },
  { emoji: "🚁", name: "Helicopter PPL",   sub: "Rotorcraft",  ref: "RFH FAA-H-8083-21B",  lessons: 48, hours: "32h", color: "#127A48" },
  { emoji: "🛩️", name: "Instrument Rating", sub: "IFR",       ref: "IFH FAA-H-8083-15B",  lessons: 52, hours: "36h", color: "#C8860A" },
];

const FEATURES = [
  { icon: "🤖", title: "AI Ground Instructor",    body: "Captain FAA answers every question grounded in official PHAK, FAR/AIM, and ACS sources — with citations on every response." },
  { icon: "✏️", title: "FAA-Style Quizzes",        body: "Chapter quizzes and full 60-question mock exams with rationale sourced directly from the FAA handbook." },
  { icon: "📊", title: "ACS Progress Tracking",    body: "Track mastery at the ACS task level — the same standard your DPE uses on checkride day." },
  { icon: "📖", title: "Integrated PHAK Reference", body: "Every lesson links directly to the source chapter and page. No guessing, no paraphrasing." },
];

const NAV_LINKS = [
  { label: "Courses",      href: "#courses"  },
  { label: "Features",     href: "#features" },
  { label: "Plans",        href: "/plans"    },
  { label: "Blog",         href: "/blog"     },
  { label: "About",        href: "/about"    },
  { label: "Contact",      href: "/contact"  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 16px 0 32px",
        minHeight: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 4px rgba(15,31,58,0.06)",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <PilotFAABrandContent
            width={132}
            height={34}
            taglineClassName="text-[10px] text-slate-500"
          />
        </Link>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: "none",
            border: "1px solid #e2e8f0",
            background: "#fff",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 18,
            cursor: "pointer",
            color: "#0F1F3A",
          }}
          className="pf-home-nav-toggle"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
          className="pf-home-nav-links"
          data-open={menuOpen ? "true" : undefined}
        >
          {NAV_LINKS.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#3A4E6B", fontSize: 14, fontWeight: 500,
                textDecoration: "none", padding: "6px 12px",
                borderRadius: 6, transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {n.label}
            </Link>
          ))}

          <div style={{ width: 1, height: 20, background: "#e2e8f0", margin: "0 8px" }} className="pf-home-nav-divider" />

          <Link href="/register" style={{
            color: "#1756C8", fontSize: 14, fontWeight: 600,
            textDecoration: "none", padding: "6px 14px",
            borderRadius: 6, border: "1.5px solid #1756C8",
          }}>
            Register
          </Link>

          <Link href="/login" style={{
            background: "#1756C8", color: "#fff",
            padding: "8px 18px", borderRadius: 7,
            fontSize: 14, fontWeight: 600, textDecoration: "none",
            marginLeft: 4,
          }}>
            Sign In
          </Link>
        </div>
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .pf-home-nav-toggle { display: block !important; }
          .pf-home-nav-links {
            display: none !important;
            width: 100%;
            flex-direction: column !important;
            align-items: stretch !important;
            padding-bottom: 12px;
          }
          .pf-home-nav-links[data-open="true"] {
            display: flex !important;
          }
          .pf-home-nav-divider { display: none; }
        }
      `}</style>

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
            <Link href="/register" style={{ background: "#fff", color: "#1756C8", padding: "14px 32px", borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              Start Studying Free →
            </Link>
            <Link href="#courses" style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              View Courses
            </Link>
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

      <section id="courses" style={{ padding: "72px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: 34, fontWeight: 700, color: "#0F1F3A", marginBottom: 10 }}>FAA Certification Courses</h2>
          <p style={{ color: "#7A90AE", fontSize: 16 }}>Every course maps directly to its FAA source publication and ACS standard.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {COURSES.map((c) => (
            <div key={c.name} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28, boxShadow: "0 2px 12px rgba(15,31,58,0.06)", borderTop: `3px solid ${c.color}` }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{c.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#0F1F3A" }}>{c.name}</div>
              <div style={{ fontSize: 13, color: "#7A90AE", marginBottom: 14 }}>{c.sub}</div>
              <div style={{ display: "inline-block", background: "#EBF1FB", color: "#1756C8", fontSize: 10, fontWeight: 600, fontFamily: "monospace", padding: "3px 9px", borderRadius: 4, marginBottom: 16 }}>{c.ref}</div>
              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#3A4E6B" }}><strong>{c.lessons}</strong> <span style={{ color: "#7A90AE" }}>lessons</span></div>
                <div style={{ fontSize: 13, color: "#3A4E6B" }}><strong>{c.hours}</strong> <span style={{ color: "#7A90AE" }}>est.</span></div>
              </div>
              <Link href="/register" style={{ display: "block", textAlign: "center" as const, background: c.color, color: "#fff", padding: "10px 0", borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                Start Course →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="features" style={{ background: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 34, fontWeight: 700, color: "#0F1F3A", marginBottom: 10 }}>Built Around How the FAA Thinks</h2>
            <p style={{ color: "#7A90AE", fontSize: 16 }}>Not a question bank. A complete ground school.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0F1F3A", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13.5, color: "#3A4E6B", lineHeight: 1.65 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "linear-gradient(130deg,#0F1F3A,#1756C8)", padding: "72px 32px", textAlign: "center" as const }}>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 34, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Ready for your checkride?</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginBottom: 32 }}>Start studying today. Free access to preview lessons.</p>
        <Link href="/register" style={{ background: "#fff", color: "#1756C8", padding: "14px 36px", borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          Create Free Account →
        </Link>
      </section>

      <footer style={{ background: "#0F1F3A", padding: "40px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 8 }}>Pilot<span style={{ color: "#90cdf4" }}>FAA</span></div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", maxWidth: 260, lineHeight: 1.6 }}>
                FAA-grounded aviation ground school. Every answer cited to an official FAA publication.
              </div>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" as const }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "1.5px", fontFamily: "monospace", marginBottom: 12 }}>Product</div>
                {[["Courses","#courses"],["Features","#features"],["Plans","/plans"],["Blog","/blog"]].map(([l, h]) => (
                  <div key={l} style={{ marginBottom: 8 }}>
                    <Link href={h} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none" }}>{l}</Link>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "1.5px", fontFamily: "monospace", marginBottom: 12 }}>Company</div>
                {[["About","/about"],["Contact","/contact"],["Request Demo","/request-demo"],["Deals","/deals"]].map(([l, h]) => (
                  <div key={l} style={{ marginBottom: 8 }}>
                    <Link href={h} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none" }}>{l}</Link>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "1.5px", fontFamily: "monospace", marginBottom: 12 }}>Legal</div>
                {[["Privacy","/privacy"],["Terms","/terms"],["Cookies","/cookies"]].map(([l, h]) => (
                  <div key={l} style={{ marginBottom: 8 }}>
                    <Link href={h} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none" }}>{l}</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 12 }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
              © {new Date().getFullYear()} PilotFAA — FAA content is public domain per 17 U.S.C. section 105
            </div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "monospace" }}>
              PHAK · FAR/AIM · ACS · AIM 2024
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
