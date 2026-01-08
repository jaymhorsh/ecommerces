import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { CartProvider } from "@/components/cart/cart-context"
import { Header } from "../components/layout/header"
import { cn } from "../lib/utils"
import { ZustandProvider } from "@/components/providers/zustand-provider"
import { QueryProvider } from "@/components/providers/query-provider"

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
    "Discover millions of products from global merchants. Shop securely with fast checkout and easy returns. Your marketplace for everything, everywhere.",
  applicationName: "Store404",
  authors: [{ name: "Store404 Team" }],
  keywords: ["marketplace", "ecommerce", "shopping", "merchants", "products"],
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
        <QueryProvider>
          <ZustandProvider>
            <CartProvider>
              <main data-vaul-drawer-wrapper="true">
                <Header />
                {children}
              </main>
              <Toaster closeButton position="bottom-right" />
            </CartProvider>
          </ZustandProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
