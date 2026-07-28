// 편의점 꿀팁 페이지 — 전자레인지·삼각김밥·T-money 안내
import type { Metadata } from 'next'
import { Suspense } from 'react'
import CvsTipsView from './CvsTipsView'

export const metadata: Metadata = {
  title: 'Korean Convenience Store Tips — Microwave, Wi-Fi, Restrooms & More',
  description: 'Practical tips for using a Korean convenience store: how to use the microwave, free Wi-Fi, restrooms, and other things travelers often ask about.',
}

export default function CvsTipsPage() {
  return (
    <Suspense>
      <CvsTipsView />
    </Suspense>
  )
}
