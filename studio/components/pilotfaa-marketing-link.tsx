"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { pilotfaaMarketingPath } from "@/lib/pilotfaa-marketing";

type Props = {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onAfterNavigate?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLAnchorElement>;
};

/**
 * Marketing internal links: always use a clean pathname (no hash). On plain click, replace the
 * current URL without a fragment or hard-navigate so `/#courses` / doubled hashes cannot stick.
 */
export function PilotFAAMarketingLink({
  href,
  children,
  style,
  className,
  onAfterNavigate,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const router = useRouter();
  const path = pilotfaaMarketingPath(href);

  return (
    <Link
      href={path}
      prefetch={false}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        onAfterNavigate?.();
        if (typeof window === "undefined") return;
        const { pathname } = window.location;
        if (pathname === path) {
          window.history.replaceState(null, "", path);
          window.scrollTo(0, 0);
          return;
        }
        router.push(path, { scroll: true });
      }}
    >
      {children}
    </Link>
  );
}
