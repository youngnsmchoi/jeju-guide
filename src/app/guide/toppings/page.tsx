// 꿀조합 커스터마이징 — 편의점 라면 토핑 조합 가이드
import { supabase } from '@/lib/supabase'
import ToppingsView from './ToppingsView'

export const revalidate = 60

export default async function ToppingsPage() {
  const { data } = await supabase.from('topping_combos').select('*').order('order_num')
  return <ToppingsView combos={data ?? []} />
}
