// 편의점 삼각김밥 가이드 페이지 — 포장 뜯는 법 + 맛 종류 목록
import { supabase } from '@/lib/supabase'
import type { GimbapItem } from '@/lib/types'
import GimbapView from './GimbapView'

export const revalidate = 60

export default async function GimbapPage() {
  const { data } = await supabase.from('gimbap_items').select('*').order('order_num')
  return <GimbapView items={(data ?? []) as GimbapItem[]} />
}
