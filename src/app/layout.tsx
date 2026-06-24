// 전체 레이아웃 — 언어 Provider 포함
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/context/LangContext'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: '제주 서귀포 스마트 생존 가이드',
  description: 'Jeju Seogwipo Smart Survival Guide for foreigners',
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
