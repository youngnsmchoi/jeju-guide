// 나도 먹을 수 있나요? — 성분 직접 확인 안내 페이지
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import IngredientsView from './IngredientsView'

export const metadata: Metadata = {
  title: 'Can I Eat This? — Checking Allergens, Halal & Vegetarian Status in Korea',
  description: 'How to check allergens, halal status, and vegetarian ingredients on Korean convenience store food packaging when you can\'t read Korean.',
}

const HOW_TO_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Check Allergens and Ingredients on Korean Food Packaging',
  step: [
    { '@type': 'HowToStep', text: 'Pick the item you want to check.' },
    { '@type': 'HowToStep', text: 'Open Papago or Google Translate, tap the camera icon, and point it at the ingredient label on the package.' },
    { '@type': 'HowToStep', text: 'Read the translated ingredients and decide for yourself whether you can eat it.' },
  ],
}

export default function IngredientsPage() {
  return (
    <>
      <JsonLd data={HOW_TO_JSON_LD} />
      <IngredientsView />
    </>
  )
}
