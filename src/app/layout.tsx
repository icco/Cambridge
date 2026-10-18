import "./globals.css"

import { WebVitals } from "@icco/react-common/WebVitals"
import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque } from "next/font/google"
import type { ReactNode } from "react"

import { site } from "@/lib/site"

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    title: site.name,
    description: site.description,
    siteName: site.name,
  },
  twitter: { card: "summary", title: site.name, description: site.description },
}

export const viewport: Viewport = { themeColor: "#e9e6f2" }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={display.variable}>
      <body className="flex min-h-dvh flex-col overflow-hidden bg-(--wall) font-sans text-(--ink-day) antialiased">
        {site.analyticsPath && <WebVitals analyticsPath={site.analyticsPath} />}
        <main
          id="main"
          tabIndex={-1}
          className="grid flex-1 place-items-center"
        >
          {children}
        </main>
      </body>
    </html>
  )
}
