// 편의점 꿀팁 페이지 — 전자레인지·삼각김밥·T-money 안내
import type { Metadata } from 'next'
import { Suspense } from 'react'
import JsonLd from '@/components/JsonLd'
import CvsTipsView from './CvsTipsView'

export const metadata: Metadata = {
  title: 'Korean Convenience Store Tips — Microwave, Wi-Fi, Restrooms & More',
  description: 'Practical tips for using a Korean convenience store: how to use the microwave, free Wi-Fi, restrooms, and other things travelers often ask about.',
}

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I use the microwave at a Korean convenience store?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Find the microwave, usually near the eat-in seating area. Follow the heating instructions printed on the food package, press the time buttons to set how long you need, then press start. Never put aluminum containers or foil inside.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do Korean convenience stores have a customer restroom?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Most Korean convenience stores don't have a customer restroom, or it's staff-only. Subway stations, large marts, and franchise cafes are more reliable options.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I sort trash at a Korean convenience store?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Korea sorts trash into three types: general waste, food waste, and cans/bottles/plastic. In-store trash bins are usually split the same way.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do Korean convenience stores have free Wi-Fi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Policy varies by store, so free Wi-Fi isn't guaranteed everywhere. Some stores only carry carrier Wi-Fi, not a store-run network.",
      },
    },
  ],
}

export default function CvsTipsPage() {
  return (
    <Suspense>
      <JsonLd data={FAQ_JSON_LD} />
      <CvsTipsView />
    </Suspense>
  )
}
