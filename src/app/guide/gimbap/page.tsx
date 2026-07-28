// 편의점 삼각김밥 가이드 페이지 — 포장 뜯는 법 + 실물로 직접 확인하는 법
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import GimbapView from './GimbapView'

export const metadata: Metadata = {
  title: 'How to Unwrap a Korean Triangle Kimbap (Samgak Gimbap)',
  description: 'Step-by-step guide to opening a Korean convenience store triangle kimbap without tearing the seaweed, plus flavor types and price range.',
}

const HOW_TO_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Unwrap a Korean Triangle Kimbap',
  step: [
    { '@type': 'HowToStep', text: 'Hold the top tab and pull it downward.' },
    { '@type': 'HowToStep', text: 'Pull the left side of the wrapper to the left.' },
    { '@type': 'HowToStep', text: 'Pull the right side of the wrapper to the right.' },
  ],
}

export default function GimbapPage() {
  return (
    <>
      <JsonLd data={HOW_TO_JSON_LD} />
      <GimbapView />
    </>
  )
}
