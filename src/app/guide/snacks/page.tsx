// 편의점 디저트/간식 가이드 페이지 — 한국인 추천 인기템 목록
import { supabase } from '@/lib/supabase'
import type { SnackItem } from '@/lib/types'
import SnacksView from './SnacksView'

export const revalidate = 60

export default async function SnacksPage() {
  const { data } = await supabase.from('snack_items').select('*').order('order_num')
  return <SnacksView items={(data ?? []) as SnackItem[]} />
}
