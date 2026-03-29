"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PilotFAABrandContent } from "@/components/pilotfaa-brand";
import { PilotFAAMarketingLink } from "@/components/pilotfaa-marketing-link";
import { PILOTFAA_NAV } from "@/lib/pilotfaa-marketing";

export function PilotFAANav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        style={{
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
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <PilotFAABrandContent width={132} height={34} taglineClassName="text-[10px] text-slate-500" />
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
          {PILOTFAA_NAV.map((n) => (
            <PilotFAAMarketingLink
              key={n.label}
              href={n.href}
              onAfterNavigate={() => setMenuOpen(false)}
              style={{
                color: "#3A4E6B",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 6,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f1f5f9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {n.label}
            </PilotFAAMarketingLink>
          ))}

          <div style={{ width: 1, height: 20, background: "#e2e8f0", margin: "0 8px" }} className="pf-home-nav-divider" />

          <Link
            href="/checkout"
            style={{
              color: "#1756C8",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: 6,
              border: "1.5px solid #1756C8",
            }}
          >
            Start course
          </Link>

          <Link
            href="/login"
            style={{
              background: "#1756C8",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: 7,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              marginLeft: 4,
            }}
          >
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
    </>
  );
}
