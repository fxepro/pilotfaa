import type { Metadata } from "next";
import { PilotFAAProvider } from "@/contexts/PilotFAAContext";
import "@/styles/pilotfaa.css";

export const metadata: Metadata = {
  title: "PilotFAA — Aviation Ground School",
  description: "Aviation ground school, study tools, and progress tracking.",
};

export default function LMSRouteLayout({ children }: { children: React.ReactNode }) {
  return <PilotFAAProvider>{children}</PilotFAAProvider>;
}
