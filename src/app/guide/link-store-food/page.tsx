// 편의점 먹거리 허브 페이지 — 삼각김밥/김밥/도시락/핫바/디저트 카드 모음
import type { Metadata } from 'next'
import StoreFoodView from './StoreFoodView'

export const metadata: Metadata = {
  title: 'Korean Convenience Store Food Guide — Kimbap, Bento, Hotbar & Snacks',
  description: 'Everything to eat at a Korean convenience store beyond ramen: triangle kimbap, gimbap rolls, bento, hotbar, and desserts.',
}

export default function StoreFoodPage() {
  return <StoreFoodView />
}
