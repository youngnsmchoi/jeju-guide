// 편의점 김밥 가이드 페이지 — 포장 뜯기/데우기 안내 + 맛 카테고리
import type { Metadata } from 'next'
import JulGimbapView from './JulGimbapView'

export const metadata: Metadata = {
  title: 'Korean Convenience Store Gimbap Roll Guide — Types & How to Heat',
  description: 'A bigger, heartier seaweed rice roll than triangle kimbap. How to unwrap and heat it, plus the different filling types (beef bulgogi, cheese, spicy).',
}

export default function JulGimbapPage() {
  return <JulGimbapView />
}
