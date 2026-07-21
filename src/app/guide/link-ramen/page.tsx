// 라면 가이드 v2 페이지 — 최소 정보 + 정부/제조사 링크 연결
import { supabase } from '@/lib/supabase'
import type { LinkRamenItem } from '@/lib/types'
import LinkRamenView from './LinkRamenView'

export const revalidate = 60

export default async function LinkRamenPage() {
  const { data } = await supabase.from('link_ramen_items').select('*').order('order_num')
  return <LinkRamenView items={(data ?? []) as LinkRamenItem[]} />
}
