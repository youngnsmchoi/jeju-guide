// 교통카드(T-money) 안내 페이지
import type { Metadata } from 'next'
import TmoneyView from './TmoneyView'

export const metadata: Metadata = {
  title: 'T-money Card Guide — Buying & Topping Up Korea\'s Transit Card',
  description: 'How to buy and top up a T-money transit card at a Korean convenience store, and how to use it on buses and subways.',
}

export default function TmoneyPage() {
  return <TmoneyView />
}
