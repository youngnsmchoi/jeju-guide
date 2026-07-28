// 나도 먹을 수 있나요? — 성분 직접 확인 안내 페이지
import type { Metadata } from 'next'
import IngredientsView from './IngredientsView'

export const metadata: Metadata = {
  title: 'Can I Eat This? — Checking Allergens, Halal & Vegetarian Status in Korea',
  description: 'How to check allergens, halal status, and vegetarian ingredients on Korean convenience store food packaging when you can\'t read Korean.',
}

export default function IngredientsPage() {
  return <IngredientsView />
}
