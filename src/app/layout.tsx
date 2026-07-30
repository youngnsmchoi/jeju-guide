// 전체 레이아웃 — 언어 Provider 포함
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { LangProvider } from '@/context/LangContext'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.koreacvsguide.com'),
  title: 'Korea Convenience Store Guide',
  description: "Real answers for when you're stuck at a Korean convenience store. Payment, ramen cooking, T-money and more.",
  alternates: {
    canonical: 'https://www.koreacvsguide.com',
  },
  openGraph: {
    title: 'Korea Convenience Store Guide',
    description: "Real answers for when you're stuck at a Korean convenience store.",
    url: 'https://www.koreacvsguide.com',
    siteName: 'Korea Convenience Store Guide',
    images: [{ url: 'https://www.koreacvsguide.com/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korea Convenience Store Guide',
    description: "Real answers for when you're stuck at a Korean convenience store.",
    images: ['https://www.koreacvsguide.com/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-gray-50 antialiased">
        <LangProvider>{children}</LangProvider>
        <Analytics />
      </body>
    </html>
  )
}
