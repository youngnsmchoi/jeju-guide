// 편의점 도시락 가이드 페이지 — 데우는 법 + 종류별 구성 안내
import { supabase } from '@/lib/supabase'
import type { DosirakItem } from '@/lib/types'
import DosirakView from './DosirakView'

export const revalidate = 60

export default async function DosirakPage() {
  const { data } = await supabase.from('dosirak_items').select('*').order('order_num')
  return <DosirakView items={(data ?? []) as DosirakItem[]} />
}
