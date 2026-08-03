// 이용자 레시피 목록 페이지
import type { Metadata } from 'next'
import RecipesView from './RecipesView'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Convenience Store Ramen Recipes | Korea Convenience Store Guide',
  description: 'Ramen recipe ideas and combos shared by travelers — egg, cheese, rice ball combinations you can make at a Korean convenience store.',
  alternates: {
    canonical: 'https://www.koreacvsguide.com/recipes',
  },
}

export default function RecipesPage() {
  return <RecipesView />
}
