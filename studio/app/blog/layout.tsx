import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Rodeo Blog",
  description: "Expert insights on platform development, best practices, and implementation strategies.",
  keywords: "admin platform, development, best practices, implementation",
  authors: [{ name: "Admin Rodeo Team" }],
  openGraph: {
    title: "Admin Rodeo Blog",
    description: "Expert insights on platform development, best practices, and implementation strategies.",
    type: "website",
    url: "https://adminrodeo.com/blog",
    siteName: "Admin Rodeo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin Rodeo Blog",
    description: "Expert insights on platform development, best practices, and implementation strategies.",
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
  return <>{children}</>;
}
