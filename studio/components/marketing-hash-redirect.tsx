"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/** Legacy anchor URLs (e.g. pilotfaa.com/#courses) never hit the server — redirect client-side to real routes */
const HASH_TO_PATH: Record<string, string> = {
  courses: "/courses",
  features: "/features",
  plans: "/courses",
  blog: "/blog",
  about: "/about",
  contact: "/contact",
};

function firstHashSegment(): string {
  if (typeof window === "undefined") return "";
  const raw = window.location.hash.replace(/^#/, "");
  const segment = raw.split("#")[0]?.trim().toLowerCase() ?? "";
  return segment;
}

export function MarketingHashRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/") return;

    const redirectIfLegacy = () => {
      const key = firstHashSegment();
      if (!key) return;
      const target = HASH_TO_PATH[key];
      if (!target) return;
      router.replace(target);
    };

    redirectIfLegacy();
    window.addEventListener("hashchange", redirectIfLegacy);
    return () => window.removeEventListener("hashchange", redirectIfLegacy);
  }, [pathname, router]);

  return null;
}
