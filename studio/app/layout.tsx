import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, Lato, Source_Sans_3, Archivo } from "next/font/google"
import "./globals.css"
import { ToasterProvider } from "@/components/toaster-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { PostHogProviderWrapper } from "@/lib/posthog"
import { LanguageProvider } from "@/components/language-provider"
import { I18nProvider } from "@/components/i18n-provider"
import { MarketingHashRedirect } from "@/components/marketing-hash-redirect"

// Multi-language font support: Latin, Latin Extended, Cyrillic, Greek for European languages
const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek", "greek-ext"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
  preload: true
})

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true
})

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-lato',
  display: 'swap',
  preload: true
})

const sourceSans3 = Source_Sans_3({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek", "greek-ext", "vietnamese"],
  weight: ['400', '600', '700'],
  variable: '--font-source-sans-3',
  display: 'swap',
  preload: true
})

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: "PilotFAA",
  description: "FAA-grounded aviation ground school — lessons, quizzes, and progress tracking.",
  icons: {
    icon: [{ url: '/favicon_io/pilotfaa-favicon.png', type: 'image/png' }],
    apple: [{ url: '/favicon_io/pilotfaa-favicon.png', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon_io/pilotfaa-favicon.png" />
        <link rel="apple-touch-icon" href="/favicon_io/pilotfaa-favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1756C8" />
      </head>
      <body className={`${montserrat.className} ${inter.variable} ${lato.variable} ${sourceSans3.variable} ${archivo.variable}`}>
        <LanguageProvider />
        <I18nProvider>
        <PostHogProviderWrapper>
          <ThemeProvider>
            <MarketingHashRedirect />
            <main className="min-h-screen bg-background">{children}</main>
            <ToasterProvider />
          </ThemeProvider>
        </PostHogProviderWrapper>
        </I18nProvider>
      </body>
    </html>
  )
}
