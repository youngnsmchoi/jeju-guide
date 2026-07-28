// Best 5 추천 — 운영자 픽 라면 순위 페이지
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import Best5View from './Best5View'

export const metadata: Metadata = {
  title: 'Top 5 Korean Ramen Picks — Best Convenience Store Ramen Ranked',
  description: 'Our top 5 picked Korean convenience store ramen, ranked with price and where to buy each one.',
}

export const revalidate = 60

export default async function Best5Page() {
  const { data } = await supabase
    .from('best5_picks')
    .select('*, ramen_items(manufacturer_url, price_krw, name_ko, heat_source)')
    .order('rank_num')
  return <Best5View picks={data ?? []} />
}
