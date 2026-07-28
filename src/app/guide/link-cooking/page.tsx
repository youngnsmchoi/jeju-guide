// 라면 끓이는 법 페이지 — 컵/봉지/비벼먹기 탭
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Item } from '@/lib/types'
import CookingView from './CookingView'

export const metadata: Metadata = {
  title: 'How to Cook Korean Ramen — Cup, Bag & Dry Noodle Instructions',
  description: 'How to prepare Korean convenience store ramen: cup noodles, bag (pot) noodles, and dry mix-style noodles, step by step.',
}

export const revalidate = 60

export default async function CookingPage() {
  const { data: items } = await supabase
    .from('jeju_items')
    .select('*')
    .in('slug', ['convenience-store-cup-noodle', 'convenience-store-bag-noodle', 'convenience-store-dry-noodle'])

  const find = (slug: string) => (items ?? []).find((i: Item) => i.slug === slug) ?? null

  return (
    <CookingView
      cupItem={find('convenience-store-cup-noodle')}
      bagItem={find('convenience-store-bag-noodle')}
      dryItem={find('convenience-store-dry-noodle')}
    />
  )
}
