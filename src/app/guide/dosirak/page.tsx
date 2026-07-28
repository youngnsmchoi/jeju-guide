// 편의점 도시락 가이드 페이지 — 데우는 법 안내 + 맛 카테고리
import type { Metadata } from 'next'
import DosirakView from './DosirakView'

export const metadata: Metadata = {
  title: 'Korean Convenience Store Bento (Dosirak) Guide — How to Heat & Choose',
  description: 'How to heat a Korean convenience store bento in the microwave, what dosirak types exist (chicken mayo, pork cutlet, spicy pork), and roughly how much they cost.',
}

export default function DosirakPage() {
  return <DosirakView />
}
