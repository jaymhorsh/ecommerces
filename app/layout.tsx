import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { Provider } from "@/components/providers/provider"
import { Header } from "../components/layout/header"
import { cn } from "../lib/utils"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Store404 - Global Marketplace",
  description:
    "Discover millions of products from global merchants. Shop securely with fast checkout and easy returns.",
  applicationName: "Store404",
  authors: [{ name: "Store404 Team" }],
  keywords: ["marketplace", "ecommerce", "shopping"],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(geistSans.variable, geistMono.variable, "antialiased min-h-screen")} suppressHydrationWarning>
        <Provider>
          <main data-vaul-drawer-wrapper="true">
            <Header />
            {children}
          </main>
          <Toaster closeButton position="bottom-right" />
        </Provider>
      </body>
    </html>
  )
}
