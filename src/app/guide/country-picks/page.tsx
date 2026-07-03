// 나라별 인기 한국 라면 페이지
import { supabase } from '@/lib/supabase'
import CountryPicksView from './CountryPicksView'

export const revalidate = 0

export default async function CountryPicksPage() {
  const { data } = await supabase
    .from('country_picks')
    .select('*')
    .order('country_code')
    .order('rank_num')
  return <CountryPicksView picks={data ?? []} />
}
