// 편의점 도시락 가이드 페이지 — 데우는 법 안내 + 맛 카테고리
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import DosirakView from './DosirakView'

export const metadata: Metadata = {
  title: 'Korean Convenience Store Bento (Dosirak) Guide — How to Heat & Choose',
  description: 'How to heat a Korean convenience store bento in the microwave, what dosirak types exist (chicken mayo, pork cutlet, spicy pork), and roughly how much they cost.',
}

const HOW_TO_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Heat a Korean Convenience Store Bento in the Microwave',
  step: [
    { '@type': 'HowToStep', text: "Don't close the lid all the way — lift one corner slightly so steam can escape." },
    { '@type': 'HowToStep', text: "If there's a separate sauce packet, take it out first (never microwave it)." },
    { '@type': 'HowToStep', text: 'Heat for the time printed on the label (usually 1-2 min), then pour the sauce back on.' },
  ],
}

export default function DosirakPage() {
  return (
    <>
      <JsonLd data={HOW_TO_JSON_LD} />
      <DosirakView />
    </>
  )
}
