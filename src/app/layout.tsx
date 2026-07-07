// 전체 레이아웃 — 언어 Provider 포함
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/context/LangContext'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'K-Ramen Picks',
  description: 'Find the best Korean instant ramen at Jeju convenience stores. Spice levels, prices, cooking tips, and where to buy overseas.',
  openGraph: {
    title: 'K-Ramen Picks',
    description: 'Jeju convenience store ramen guide for travelers — spice levels, prices & tips.',
    url: 'https://jeju-guide-two.vercel.app',
    siteName: 'K-Ramen Picks',
    images: [{ url: 'https://jeju-guide-two.vercel.app/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K-Ramen Picks',
    description: 'Jeju convenience store ramen guide for travelers — spice levels, prices & tips.',
    images: ['https://jeju-guide-two.vercel.app/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-gray-50 antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
