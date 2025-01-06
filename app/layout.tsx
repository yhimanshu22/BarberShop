import { Suspense } from 'react'
import { Inter } from "next/font/google"
import { siteConfig } from "@/config/site"
import dynamic from 'next/dynamic'
import "./globals.css"
import { Toaster } from 'sonner';
import AuthProvider from "@/components/providers/auth-provider"

const inter = Inter({ subsets: ["latin"] })

// Dynamic imports for heavy components
const Navbar = dynamic(() => import("@/components/layout/navbar"), {
  ssr: true,
  loading: () => <div className="h-16" />
})

const Footer = dynamic(() => import("@/components/layout/footer"), {
  ssr: true,
})

export const metadata = {
  metadataBase: new URL(siteConfig.url.base),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url.author,
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url.base,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url.base}/og.jpg`],
    creator: "@yourtwitterhandle",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
