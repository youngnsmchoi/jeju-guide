// 편의점 결제 가이드 페이지
import type { Metadata } from 'next'
import PaymentView from './PaymentView'

export const metadata: Metadata = {
  title: 'How to Pay at a Korean Convenience Store — Card, Cash & Mobile Pay',
  description: 'How payment works at Korean convenience stores: card, cash, mobile pay, and what to expect at the register as a foreign traveler.',
}

export default function PaymentPage() {
  return <PaymentView />
}
