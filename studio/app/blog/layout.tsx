import type { Metadata } from "next";
import { PilotFAAMarketingShell } from "@/components/pilotfaa-marketing-shell";

export const metadata: Metadata = {
  title: "PilotFAA Blog",
  description: "FAA ground school tips, study strategies, and aviation knowledge test prep.",
  keywords: "FAA, ground school, pilot training, knowledge test, PHAK, ACS",
  authors: [{ name: "PilotFAA" }],
  openGraph: {
    title: "PilotFAA Blog",
    description: "FAA ground school tips, study strategies, and aviation knowledge test prep.",
    type: "website",
    siteName: "PilotFAA",
  },
  twitter: {
    card: "summary_large_image",
    title: "PilotFAA Blog",
    description: "FAA ground school tips, study strategies, and aviation knowledge test prep.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PilotFAAMarketingShell>{children}</PilotFAAMarketingShell>;
}
