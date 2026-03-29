import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact — PilotFAA",
  description:
    "Contact PilotFAA for help with FAA ground school, your account, courses, and citations to official FAA sources.",
  openGraph: {
    title: "Contact — PilotFAA",
    description:
      "Reach the PilotFAA team for ground school support, billing, and product questions.",
    siteName: "PilotFAA",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
