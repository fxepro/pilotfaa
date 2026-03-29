"use client";
import Link from "next/link";
import { PILOTFAA_NAV } from "@/lib/pilotfaa-marketing";

/** Legacy compact header; prefer `PilotFAANav` from `@/components/pilotfaa-nav` for the main site shell. */
export function PilotFAALayoutNav() {
  return (
    <nav style={{
      background: "#fff",
      borderBottom: "1px solid #e2e8f0",
      padding: "0 32px",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "0 1px 4px rgba(15,31,58,0.06)",
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg,#1756C8,#4A7AE0)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "#fff",
        }}>✈</div>
        <span style={{ fontWeight: 800, fontSize: 18, color: "#0F1F3A", fontFamily: "Georgia,serif" }}>
          Pilot<span style={{ color: "#1756C8" }}>FAA</span>
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
        {PILOTFAA_NAV.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            style={{
              color: "#3A4E6B", fontSize: 14, fontWeight: 500,
              textDecoration: "none", padding: "6px 12px", borderRadius: 6,
            }}
          >
            {n.label}
          </Link>
        ))}
        <div style={{ width: 1, height: 18, background: "#e2e8f0", margin: "0 6px" }} />
        <Link
          href="/checkout"
          style={{
            color: "#1756C8", fontSize: 14, fontWeight: 600,
            textDecoration: "none", padding: "6px 14px",
            borderRadius: 6, border: "1.5px solid #1756C8",
            marginRight: 6,
          }}
        >
          Start course
        </Link>
        <Link
          href="/login"
          style={{
            background: "#1756C8", color: "#fff",
            padding: "7px 18px", borderRadius: 7,
            fontSize: 14, fontWeight: 600, textDecoration: "none",
          }}
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}

export function PilotFAAFooter() {
  return (
    <footer style={{ background: "#0F1F3A", padding: "40px 32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Top row */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          flexWrap: "wrap" as const, gap: 32, marginBottom: 32,
        }}>
          {/* Brand */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", fontFamily: "Georgia,serif", marginBottom: 8 }}>
              Pilot<span style={{ color: "#90cdf4" }}>FAA</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", maxWidth: 240, lineHeight: 1.6 }}>
              FAA-grounded aviation ground school. Every answer cited to an official FAA publication.
            </div>
          </div>

          {/* Link columns */}
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" as const }}>

            {/* Product */}
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" as const, letterSpacing: "1.5px", fontFamily: "monospace", marginBottom: 12 }}>
                Product
              </div>
              {[
                ["Courses",  "/courses"],
                ["Features", "/features"],
                ["Blog",     "/blog"],
              ].map(([label, href]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <Link href={href} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none" }}>
                    {label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Company */}
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" as const, letterSpacing: "1.5px", fontFamily: "monospace", marginBottom: 12 }}>
                Company
              </div>
              {[
                ["About",        "/about"],
                ["Contact",      "/contact"],
                ["Deals",        "/deals"],
              ].map(([label, href]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <Link href={href} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none" }}>
                    {label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" as const, letterSpacing: "1.5px", fontFamily: "monospace", marginBottom: 12 }}>
                Legal
              </div>
              {[
                ["Privacy", "/privacy"],
                ["Terms",   "/terms"],
                ["Cookies", "/cookies"],
              ].map(([label, href]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <Link href={href} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none" }}>
                    {label}
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 20,
          display: "flex", justifyContent: "space-between",
          flexWrap: "wrap" as const, gap: 12,
        }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            © {new Date().getFullYear()} PilotFAA — FAA content is public domain per 17 U.S.C. §105
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "monospace" }}>
            PHAK · FAR/AIM · ACS · AIM 2024
          </div>
        </div>

      </div>
    </footer>
  );
}
