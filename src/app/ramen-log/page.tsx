// My Ramen Log 페이지 — 라면 경험 남기기
import { supabase } from '@/lib/supabase'
import type { RamenItem } from '@/lib/types'
import RamenLogView from './RamenLogView'

export default async function RamenLogPage() {
  const { data: ramenItems } = await supabase.from('ramen_items').select('id, name_ko, name_en, name_zh, name_ja').order('order_num')
  return <RamenLogView items={(ramenItems ?? []) as RamenItem[]} />
}
