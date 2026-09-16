import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothScroll } from "@/components/smooth-scroll"
import CustomScrollbar from "@/components/custom/scrollbar"
import { WebSocketProvider } from "@/components/websocket-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "carts.lol",
  description:
    "Create a unique biolink that brings your profiles, links, content, and identity together in one place.",
  openGraph: {
    title: "carts.lol",
    description:
      "Create a unique biolink that brings your profiles, links, content, and identity together in one place.",
    siteName: "carts.lol",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "carts.lol",
    description:
      "Create a unique biolink that brings your profiles, links, content, and identity together in one place.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <WebSocketProvider>
              <CustomScrollbar />
              <SmoothScroll />
              {children}
            </WebSocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}