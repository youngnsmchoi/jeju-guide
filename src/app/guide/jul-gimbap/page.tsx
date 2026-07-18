// 편의점 줄김밥 가이드 페이지 — 종류별 구성 안내
import { supabase } from '@/lib/supabase'
import type { JulGimbapItem } from '@/lib/types'
import JulGimbapView from './JulGimbapView'

export const revalidate = 60

export default async function JulGimbapPage() {
  const { data } = await supabase.from('jul_gimbap_items').select('*').order('order_num')
  return <JulGimbapView items={(data ?? []) as JulGimbapItem[]} />
}
