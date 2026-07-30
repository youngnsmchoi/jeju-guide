// 이 말이 필요할 때 페이지 — 말을 몰라도 화면을 보여주기만 하면 되는 문구 모음
import type { Metadata } from 'next'
import PhrasesView from './PhrasesView'

export const metadata: Metadata = {
  title: 'Show This to Staff — Korean Phrases for Convenience Stores',
  description: 'No Korean needed. Common convenience store phrases (heating food, restroom, transit card) shown large enough to hold up to staff.',
}

export default function PhrasesPage() {
  return <PhrasesView />
}
