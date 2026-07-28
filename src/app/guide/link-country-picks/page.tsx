// 나라별 인기 한국 라면 페이지
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import CountryPicksView from './CountryPicksView'

export const metadata: Metadata = {
  title: 'Most Popular Korean Ramen by Country — What Travelers From Your Country Pick',
  description: 'See which Korean convenience store ramen is most popular with travelers from your country.',
}

export const revalidate = 60

export default async function CountryPicksPage() {
  const { data } = await supabase
    .from('country_picks')
    .select('*')
    .order('country_code')
    .order('rank_num')
  return <CountryPicksView picks={data ?? []} />
}
