"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export const PILOTFAA_WORDMARK_SRC = "/pilotfaa-wordmark.png";
export const PILOTFAA_TAGLINE = "Aviation Ground School";

type PilotFAABrandContentProps = {
  width?: number;
  height?: number;
  showTagline?: boolean;
  className?: string;
  imageClassName?: string;
  taglineClassName?: string;
};

/** Wordmark image plus tagline; wrap in <Link> where needed */
export function PilotFAABrandContent({
  width = 160,
  height = 40,
  showTagline = true,
  className,
  imageClassName,
  taglineClassName,
}: PilotFAABrandContentProps) {
  return (
    <span className={cn("inline-flex flex-row items-center gap-2.5 shrink-0", className)}>
      <Image
        src={PILOTFAA_WORDMARK_SRC}
        alt="PilotFAA"
        width={width}
        height={height}
        className={cn("object-contain shrink-0", imageClassName)}
      />
      {showTagline ? (
        <span
          className={cn(
            "text-left text-[11px] font-medium leading-snug tracking-wide text-slate-600 sm:text-xs max-w-[9.5rem] sm:max-w-none",
            taglineClassName
          )}
        >
          {PILOTFAA_TAGLINE}
        </span>
      ) : null}
    </span>
  );
}
