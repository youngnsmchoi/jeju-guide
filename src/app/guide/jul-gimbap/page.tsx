// 편의점 김밥 가이드 페이지 — 포장 뜯기/데우기 안내 + 맛 카테고리
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import JulGimbapView from './JulGimbapView'

export const metadata: Metadata = {
  title: 'Korean Convenience Store Gimbap Roll Guide — Types & How to Heat',
  description: 'A bigger, heartier seaweed rice roll than triangle kimbap. How to unwrap and heat it, plus the different filling types (beef bulgogi, cheese, spicy).',
}

const HOW_TO_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Unwrap and Heat a Korean Gimbap Roll',
  step: [
    { '@type': 'HowToStep', text: 'Find the perforated line at the top or bottom of the wrapper and gently pull it open.' },
    { '@type': 'HowToStep', text: 'To microwave, leave the outer wrapper slightly open and heat for just 30-40 seconds.' },
  ],
}

export default function JulGimbapPage() {
  return (
    <>
      <JsonLd data={HOW_TO_JSON_LD} />
      <JulGimbapView />
    </>
  )
}
