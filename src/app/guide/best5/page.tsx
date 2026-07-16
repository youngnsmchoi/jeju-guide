// Best 5 추천 — 운영자 픽 라면 순위 페이지
import { supabase } from '@/lib/supabase'
import Best5View from './Best5View'

export const revalidate = 60

export default async function Best5Page() {
  const { data } = await supabase
    .from('best5_picks')
    .select('*, ramen_items(manufacturer_url)')
    .order('rank_num')
  return <Best5View picks={data ?? []} />
}
