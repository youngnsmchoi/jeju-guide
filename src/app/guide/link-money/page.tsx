// 한국 화폐 안내 페이지
import type { Metadata } from 'next'
import MoneyView from './MoneyView'

export const metadata: Metadata = {
  title: 'Korean Won Currency Guide — Bills, Coins & Exchange Rate for Travelers',
  description: 'A quick guide to Korean won bills and coins, typical convenience store prices, and how to check the current exchange rate.',
}

export default function MoneyPage() {
  return <MoneyView />
}
