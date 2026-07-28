// 편의점 삼각김밥 가이드 페이지 — 포장 뜯는 법 + 실물로 직접 확인하는 법
import type { Metadata } from 'next'
import GimbapView from './GimbapView'

export const metadata: Metadata = {
  title: 'How to Unwrap a Korean Triangle Kimbap (Samgak Gimbap)',
  description: 'Step-by-step guide to opening a Korean convenience store triangle kimbap without tearing the seaweed, plus flavor types and price range.',
}

export default function GimbapPage() {
  return <GimbapView />
}
